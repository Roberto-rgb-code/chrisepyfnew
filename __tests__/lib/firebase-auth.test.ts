import { firebaseAuthInternals } from '@/lib/firebase-admin';

describe('firebase token parsing', () => {
  it('parses a JWT structure', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'abc' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'user123' })).toString('base64url');
    const signature = Buffer.from('sig').toString('base64url');
    const token = `${header}.${payload}.${signature}`;

    const parsed = firebaseAuthInternals.parseJwt(token);
    expect(parsed?.header.kid).toBe('abc');
    expect(parsed?.payload.sub).toBe('user123');
  });

  it('rejects malformed tokens', () => {
    expect(firebaseAuthInternals.parseJwt('not-a-jwt')).toBeNull();
  });
});
