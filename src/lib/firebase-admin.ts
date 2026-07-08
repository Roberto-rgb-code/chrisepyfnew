export interface DecodedIdToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

const FIREBASE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

type FirebaseJwks = Awaited<ReturnType<typeof loadFirebaseJwks>>;

let jwksPromise: Promise<FirebaseJwks> | null = null;

async function loadFirebaseJwks() {
  const { createRemoteJWKSet } = await import('jose');
  return createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
}

function getFirebaseJwks() {
  if (!jwksPromise) {
    jwksPromise = loadFirebaseJwks();
  }
  return jwksPromise;
}

/** Token verification only needs the Firebase project ID (public JWKS). */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;

  try {
    const { jwtVerify } = await import('jose');
    const jwks = await getFirebaseJwks();
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    if (!payload.sub) return null;

    return {
      uid: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      email_verified:
        typeof payload.email_verified === 'boolean' ? payload.email_verified : undefined,
    };
  } catch {
    return null;
  }
}
