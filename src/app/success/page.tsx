'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/CheckoutSteps';
import { CheckCircle, Mail, Package, ArrowRight } from 'lucide-react';
import { formatOrderNumber } from '@/lib/email-utils';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  const orderNumber = sessionId ? formatOrderNumber(sessionId) : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <CheckoutSteps current={3} />
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
            {orderNumber && (
              <p className="text-lg text-gray-600 mb-1">
                Pedido <span className="font-bold text-blue-600">#{orderNumber}</span>
              </p>
            )}
            <p className="text-gray-500 mb-8">Tu pago fue procesado correctamente</p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-left space-y-4">
              {[
                { icon: Mail, text: 'Revisa tu correo — incluye la imagen de tu diseño personalizado' },
                { icon: Package, text: 'Preparamos tu funda en 24-48 horas hábiles' },
                { icon: ArrowRight, text: 'Rastrea tu pedido en "Mis Órdenes"' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/ordenes')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Ver mis órdenes
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Crear otra funda
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
