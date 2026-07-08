'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, CheckCircle } from '@/components/icons';

interface EmailVerificationNoticeProps {
  variant?: 'banner' | 'card';
  showResend?: boolean;
}

export default function EmailVerificationNotice({
  variant = 'card',
  showResend = true,
}: EmailVerificationNoticeProps) {
  const { user, emailVerified, resendVerificationEmail, reloadUser } = useAuth();
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user || emailVerified) return null;

  const handleResend = async () => {
    setSending(true);
    setError('');
    setMessage('');
    try {
      await resendVerificationEmail();
      setMessage('Correo de verificación reenviado. Revisa tu bandeja y spam.');
    } catch {
      setError('No se pudo reenviar el correo. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    setChecking(true);
    setError('');
    setMessage('');
    try {
      const verified = await reloadUser();
      setMessage(
        verified
          ? '¡Correo verificado! Ya puedes completar tu compra.'
          : 'Aún no detectamos la verificación. Revisa tu bandeja, spam y espera un minuto.'
      );
    } catch {
      setError('No se pudo comprobar el estado. Intenta de nuevo.');
    } finally {
      setChecking(false);
    }
  };

  const content = (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
        <Mail className="w-5 h-5 text-brand-red" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-gray-900 mb-1">Verifica tu correo electrónico</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Enviamos un enlace a <strong className="text-gray-900">{user.email}</strong>.
          Debes verificarlo para completar compras y ver tus órdenes.
        </p>
        {message && (
          <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {showResend && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              className="px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red-dark disabled:opacity-50"
            >
              {sending ? 'Enviando...' : 'Reenviar correo'}
            </button>
            <button
              type="button"
              onClick={handleCheck}
              disabled={checking}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {checking ? 'Comprobando...' : 'Ya verifiqué'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === 'banner') {
    return (
      <div className="bg-brand-red-light border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">{content}</div>
      </div>
    );
  }

  return (
    <div className="bg-brand-red-light border border-red-200 rounded-2xl p-5 sm:p-6">
      {content}
    </div>
  );
}
