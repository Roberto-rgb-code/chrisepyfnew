import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';

let adminApp: App | null | undefined;

function getAdminApp(): App | null {
  if (adminApp !== undefined) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    adminApp = null;
    return null;
  }

  adminApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return adminApp;
}

export function isFirebaseAdminConfigured(): boolean {
  return getAdminApp() !== null;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const app = getAdminApp();
  if (!app) return null;

  try {
    return await getAuth(app).verifyIdToken(idToken);
  } catch {
    return null;
  }
}
