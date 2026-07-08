import { createPublicKey, verify } from 'crypto';

export interface DecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

const GOOGLE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let certsCache: { certs: Record<string, string>; expiresAt: number } | null = null;

function decodeBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, 'base64');
}

function parseJwt(token: string) {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader).toString('utf8')) as {
      alg?: string;
      kid?: string;
    };
    const payload = JSON.parse(decodeBase64Url(encodedPayload).toString('utf8')) as Record<
      string,
      unknown
    >;
    const signature = decodeBase64Url(encodedSignature);
    const signedData = Buffer.from(`${encodedHeader}.${encodedPayload}`);

    return { header, payload, signature, signedData };
  } catch {
    return null;
  }
}

async function getGoogleCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (certsCache && certsCache.expiresAt > now) {
    return certsCache.certs;
  }

  const response = await fetch(GOOGLE_CERTS_URL);
  if (!response.ok) {
    throw new Error('No se pudieron obtener certificados de Firebase');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAgeMs = maxAgeMatch ? Number(maxAgeMatch[1]) * 1000 : 60 * 60 * 1000;
  const certs = (await response.json()) as Record<string, string>;

  certsCache = { certs, expiresAt: now + maxAgeMs };
  return certs;
}

/** Token verification only needs the Firebase project ID (public Google certs). */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const parsed = parseJwt(idToken);
    if (!parsed) return null;

    const { header, payload, signature, signedData } = parsed;
    if (header.alg !== 'RS256' || !header.kid) return null;

    const certs = await getGoogleCerts();
    const pem = certs[header.kid];
    if (!pem) return null;

    const valid = verify('RSA-SHA256', signedData, createPublicKey(pem), signature);
    if (!valid) return null;

    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp;
    const iat = payload.iat;
    const sub = payload.sub;

    if (typeof exp !== 'number' || exp <= now) return null;
    if (typeof iat === 'number' && iat > now + 300) return null;
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;
    if (payload.aud !== projectId) return null;
    if (typeof sub !== 'string' || !sub) return null;

    return {
      uid: sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      email_verified:
        typeof payload.email_verified === 'boolean' ? payload.email_verified : undefined,
    };
  } catch {
    return null;
  }
}

/** @internal exported for tests */
export const firebaseAuthInternals = {
  decodeBase64Url,
  parseJwt,
};
