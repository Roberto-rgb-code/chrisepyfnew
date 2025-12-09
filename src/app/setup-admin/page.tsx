'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const ADMIN_EMAIL = 'admin@empaquesyfundas.com';
const ADMIN_PASSWORD = 'Admin123!';

export default function SetupAdminPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const createAdmin = async () => {
    if (!auth || !db) {
      setStatus('❌ Firebase no está inicializado');
      return;
    }

    setLoading(true);
    setStatus('🔄 Creando cuenta de admin...');

    try {
      // Intentar crear el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      const user = userCredential.user;

      // Actualizar el perfil
      await updateProfile(user, { displayName: 'Admin' });

      // Crear documento en Firestore con rol admin
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: ADMIN_EMAIL,
        displayName: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStatus('✅ ¡Admin creado exitosamente!');
      setSuccess(true);

      // Redirigir al panel de admin después de 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('⚠️ La cuenta ya existe. Intentando iniciar sesión...');
        
        try {
          // Intentar login si ya existe
          await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
          
          // Asegurar que el documento tenga rol admin
          const user = auth.currentUser;
          if (user) {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: ADMIN_EMAIL,
              displayName: 'Admin',
              role: 'admin',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          }

          setStatus('✅ ¡Sesión iniciada como admin!');
          setSuccess(true);
          
          setTimeout(() => {
            router.push('/admin');
          }, 2000);
        } catch (loginError: any) {
          setStatus(`❌ Error al iniciar sesión: ${loginError.message}`);
        }
      } else {
        setStatus(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configurar Admin</h1>
          <p className="text-gray-500 mt-2">Crea la cuenta de administrador</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Credenciales del Admin:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-mono text-gray-900">{ADMIN_EMAIL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contraseña:</span>
              <span className="font-mono text-gray-900">{ADMIN_PASSWORD}</span>
            </div>
          </div>
        </div>

        {status && (
          <div className={`p-4 rounded-lg mb-6 ${
            status.includes('✅') ? 'bg-green-50 text-green-800' :
            status.includes('❌') ? 'bg-red-50 text-red-800' :
            status.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {status}
          </div>
        )}

        <button
          onClick={createAdmin}
          disabled={loading || success}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            loading || success
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {loading ? '⏳ Procesando...' : success ? '✅ Completado' : '🚀 Crear Admin'}
        </button>

        {success && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Redirigiendo al panel de admin...
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            Esta página solo debe usarse una vez para configurar la cuenta de administrador.
          </p>
        </div>
      </div>
    </div>
  );
}

