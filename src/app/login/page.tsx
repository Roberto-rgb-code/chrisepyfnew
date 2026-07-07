'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from '@/components/icons';
import PhoneLoader from '@/components/PhoneLoader';
import LoadingScreen from '@/components/LoadingScreen';
import { ADMIN_EMAIL } from '@/lib/constants';

const LoginAnimation = dynamic(() => import('@/components/LoginAnimation'), {
  ssr: false,
  loading: () => <PhoneLoader size="sm" className="mx-auto" />,
});

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        router.push('/admin');
      } else {
        router.push(returnUrl);
      }
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-gray-100 overflow-hidden">
        <div className="mb-4">
          <LoginAnimation />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Bienvenido de vuelta</h1>
        <p className="text-gray-500 text-center mb-6">Inicia sesión para continuar tu compra</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Iniciando sesión...' : <>Iniciar sesión <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-blue-600 font-semibold hover:underline">Regístrate gratis</Link>
          </p>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Preparando inicio de sesión..." />}>
      <LoginForm />
    </Suspense>
  );
}

