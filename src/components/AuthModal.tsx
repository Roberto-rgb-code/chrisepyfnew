'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { X } from '@/components/icons';
import { BRAND_LOGO, BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);

  const auth = useAuth();
  const { login, signup } = auth || {};
  const router = useRouter();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setVerificationPending(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }
        if (!signup) {
          setError('Error de autenticación. Intenta recargar la página.');
          setLoading(false);
          return;
        }
        await signup(email, password, name);
        setVerificationPending(true);
        setName('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
        return;
      } else {
        if (!login) {
          setError('Error de autenticación. Intenta recargar la página.');
          setLoading(false);
          return;
        }
        const { emailVerified: verified } = await login(email, password);
        onClose();
        setEmail('');
        setPassword('');
        if (!verified) {
          router.push('/verificar-correo?returnUrl=%2Fcarrito');
          setLoading(false);
          return;
        }
      }
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onSuccess?.();
    } catch (err: any) {
      if (mode === 'login') {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      } else {
        if (err.code === 'auth/email-already-in-use') {
          setError('Este correo ya está registrado');
        } else {
          setError('Error al crear la cuenta. Intenta nuevamente.');
        }
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Fondo con blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Modal */}
      <div 
        className="relative bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[92dvh] overflow-y-auto p-6 sm:p-8 border border-white/20 animate-in fade-in zoom-in duration-300 mt-auto sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <Image
            src={BRAND_LOGO}
            alt={`${BRAND_NAME} - ${BRAND_TAGLINE}`}
            width={180}
            height={52}
            className="h-12 w-auto object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {verificationPending
            ? 'Revisa tu correo'
            : mode === 'login'
              ? 'Bienvenido de vuelta'
              : 'Crea tu cuenta'}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {verificationPending
            ? `Enviamos un enlace de verificación a ${email}`
            : mode === 'login'
              ? 'Inicia sesión para continuar'
              : 'Únete y personaliza tus fundas'}
        </p>

        {verificationPending ? (
          <div className="space-y-4">
            <div className="bg-brand-red-light border border-red-200 text-gray-700 px-4 py-4 rounded-lg text-sm leading-relaxed">
              Confirma tu correo para poder pagar. Revisa también la carpeta de spam.
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push('/verificar-correo?returnUrl=%2Fcarrito');
              }}
              className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition-all"
            >
              Ir a verificación
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-brand-red hover:text-brand-red-dark"
                onClick={async () => {
                  if (!email) { setError('Ingresa tu email primero'); return; }
                  try {
                    if (firebaseAuth) await sendPasswordResetEmail(firebaseAuth, email);
                    setError('');
                    alert('Te enviamos un enlace para restablecer tu contraseña');
                  } catch {
                    setError('No se pudo enviar el enlace. Verifica tu email.');
                  }
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition-all disabled:opacity-50"
          >
            {loading 
              ? (mode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') 
              : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-brand-red hover:text-brand-red-dark font-semibold"
            >
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
          </>
        )}
      </div>
    </div>
  );
}

