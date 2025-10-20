'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Limpiar el carrito después de una compra exitosa
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Tu pedido ha sido procesado correctamente
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Qué sigue?
            </h2>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Recibirás un email de confirmación en breve</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Comenzaremos a preparar tu pedido</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Tu pedido llegará en 24-48 horas</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Puedes rastrear tu pedido desde "Mis Órdenes"</span>
              </li>
            </ul>
          </div>

          {sessionId && (
            <p className="text-sm text-gray-500 mb-8">
              ID de sesión: {sessionId}
            </p>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/ordenes')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Ver Mis Órdenes
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

