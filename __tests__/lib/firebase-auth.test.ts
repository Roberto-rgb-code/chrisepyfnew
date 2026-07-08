import { generateKeyPairSync, createSign } from 'crypto';
import {
  isFirebaseAdminConfigured,
  resetFirebaseAuthCacheForTests,
  verifyFirebaseIdToken,
} from '@/lib/firebase-admin';

describe('verifyFirebaseIdToken', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  const kid = 'test-key-id';
  const projectId = 'efm-test-project';

  beforeEach(() => {
    process.env = { ...originalEnv, NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId };
    resetFirebaseAuthCacheForTests();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'max-age=3600' },
      json: async () => ({ [kid]: publicKey }),
    }) as unknown as typeof fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  function signToken(payload: Record<string, unknown>) {
    const header = { alg: 'RS256', typ: 'JWT', kid };
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const unsigned = `${encode(header)}.${encode(payload)}`;
    const signer = createSign('RSA-SHA256');
    signer.update(unsigned);
    signer.end();
    const signature = signer.sign(privateKey).toString('base64url');
    return `${unsigned}.${signature}`;
  }

  it('is configured when project id exists', () => {
    expect(isFirebaseAdminConfigured()).toBe(true);
  });

  it('verifies a valid signed firebase-like token', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = signToken({
      sub: 'user-abc123',
      email: 'cliente@test.com',
      email_verified: true,
      iss: `https://securetoken.google.com/${projectId}`,
      aud: projectId,
      exp: now + 3600,
      iat: now,
    });

    await expect(verifyFirebaseIdToken(token)).resolves.toEqual({
      uid: 'user-abc123',
      email: 'cliente@test.com',
      email_verified: true,
    });
  });

  it('rejects tokens with invalid signature', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = signToken({
      sub: 'user-abc123',
      iss: `https://securetoken.google.com/${projectId}`,
      aud: projectId,
      exp: now + 3600,
      iat: now,
    });

    const tampered = `${token.slice(0, -1)}x`;
    await expect(verifyFirebaseIdToken(tampered)).resolves.toBeNull();
  });

  it('rejects expired tokens', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = signToken({
      sub: 'user-abc123',
      iss: `https://securetoken.google.com/${projectId}`,
      aud: projectId,
      exp: now - 60,
      iat: now - 3600,
    });

    await expect(verifyFirebaseIdToken(token)).resolves.toBeNull();
  });
});
