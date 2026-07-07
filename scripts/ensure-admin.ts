/**
 * Crea o sincroniza el usuario admin en Firebase + PostgreSQL.
 * Ejecutar: npm run seed:admin
 */
import { PrismaClient } from '@prisma/client';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DISPLAY_NAME } from '../src/lib/constants';

const prisma = new PrismaClient();

async function ensureAdmin() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY no está configurada');
  }

  let uid: string;
  let idToken: string;

  const signUpRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        returnSecureToken: true,
      }),
    }
  );

  const signUpData = await signUpRes.json();

  if (signUpRes.ok) {
    uid = signUpData.localId;
    idToken = signUpData.idToken;
    console.log('✅ Admin creado en Firebase');
  } else if (signUpData.error?.message === 'EMAIL_EXISTS') {
    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          returnSecureToken: true,
        }),
      }
    );
    const signInData = await signInRes.json();
    if (!signInRes.ok) {
      throw new Error(`Error al iniciar sesión: ${signInData.error?.message}`);
    }
    uid = signInData.localId;
    idToken = signInData.idToken;
    console.log('✅ Admin ya existía en Firebase — sesión iniciada');
  } else {
    throw new Error(`Error Firebase: ${signUpData.error?.message}`);
  }

  await prisma.user.upsert({
    where: { id: uid },
    update: {
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
    },
    create: {
      id: uid,
      email: ADMIN_EMAIL,
      displayName: ADMIN_DISPLAY_NAME,
      role: 'admin',
    },
  });

  console.log('✅ Admin sincronizado en PostgreSQL');
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   UID:      ${uid}`);
  console.log(`   Panel:    /admin`);

  return { uid, idToken };
}

ensureAdmin()
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
