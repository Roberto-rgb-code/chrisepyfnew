'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PhoneLoader from '@/components/PhoneLoader';
import LoadingScreen from '@/components/LoadingScreen';

const RegisterAnimation = dynamic(() => import('@/components/RegisterAnimation'), {
  ssr: false,
  loading: () => <PhoneLoader size="sm" className="mx-auto" />,
});

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      await signup(email, password, name);
      router.push(returnUrl);
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'Este correo ya está registrado' : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-gray-100 overflow-hidden">
        <div className="mb-4">
          <RegisterAnimation />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">Crea tu cuenta</h1>
        <p className="text-gray-500 text-center mb-6">Regístrate en segundos y compra tu funda</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña (mín. 6 caracteres)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-blue-600 font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Preparando registro..." />}>
      <RegisterForm />
    </Suspense>
  );
}
