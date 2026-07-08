'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import EmailVerificationNotice from '@/components/EmailVerificationNotice';
import { useAuth } from '@/contexts/AuthContext';

function VerifyEmailContent() {
  const { user, loading, emailVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent('/verificar-correo')}`);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && emailVerified) {
      router.push(returnUrl);
    }
  }, [user, loading, emailVerified, returnUrl, router]);

  if (loading) {
    return <LoadingScreen message="Cargando..." />;
  }

  if (!user) return null;

  if (emailVerified) {
    return <LoadingScreen message="Correo verificado. Redirigiendo..." />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Revisa tu correo</h1>
        <p className="text-gray-600">
          Tu cuenta fue creada. Solo falta confirmar que el correo es tuyo.
        </p>
      </div>

      <EmailVerificationNotice />

      <div className="mt-8 text-center space-y-3">
        <Link
          href={returnUrl}
          className="inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          Seguir navegando (no podrás pagar hasta verificar)
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen message="Cargando..." />}>
        <VerifyEmailContent />
      </Suspense>
      <Footer />
    </>
  );
}
