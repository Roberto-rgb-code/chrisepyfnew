'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutSteps from '@/components/CheckoutSteps';
import { Mail, Package, ArrowRight, Sparkles, Clock, Download } from '@/components/icons';
import { formatOrderNumber } from '@/lib/email-utils';
import { downloadDataUrl } from '@/lib/download-image';
import { SOCIAL_LINKS } from '@/lib/constants';
import PhoneLoader from '@/components/PhoneLoader';
import LoadingScreen from '@/components/LoadingScreen';

const SuccessAnimation = dynamic(() => import('@/components/SuccessAnimation'), {
  ssr: false,
  loading: () => <PhoneLoader size="md" className="mx-auto" />,
});

const DESIGNS_STORAGE_KEY = 'last_order_designs';

interface SavedDesign {
  modelName: string;
  customImage: string;
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');
  const transferOrder = searchParams.get('order');
  const isTransfer = searchParams.get('transfer') === '1';
  const [showContent, setShowContent] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);

  useEffect(() => {
    if (sessionId) clearCart();
  }, [sessionId, clearCart]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DESIGNS_STORAGE_KEY);
      if (raw) {
        setSavedDesigns(JSON.parse(raw));
        sessionStorage.removeItem(DESIGNS_STORAGE_KEY);
      }
    } catch {
      setSavedDesigns([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const orderNumber = transferOrder
    ? transferOrder
    : sessionId
      ? formatOrderNumber(sessionId)
      : null;

  if (!sessionId && !isTransfer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md border border-gray-100">
            <p className="text-gray-600 mb-6">No encontramos información de tu pedido.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-brand-red text-white py-3 rounded-xl font-semibold"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-brand-red-light to-white py-10 sm:py-14 px-4">
        <div className="max-w-lg mx-auto">
          <CheckoutSteps current={4} />

          <div
            className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-700 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative pt-8 pb-2 px-6 bg-gradient-to-b from-green-50/80 to-white">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {isTransfer ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    Comprobante recibido
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Pago confirmado
                  </>
                )}
              </div>
              <SuccessAnimation />
            </div>

            <div className="px-8 sm:px-10 pb-8 sm:pb-10 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {isTransfer ? '¡Pedido registrado!' : '¡Gracias por tu compra!'}
              </h1>
              {orderNumber && (
                <p className="text-base sm:text-lg text-gray-600 mb-1">
                  Pedido{' '}
                  <span className="font-bold text-brand-red tracking-wide">#{orderNumber}</span>
                </p>
              )}
              <p className="text-gray-500 text-sm sm:text-base mb-8">
                {isTransfer
                  ? 'Recibimos tu comprobante de transferencia. Validaremos tu pago en un plazo de 24 horas hábiles.'
                  : 'Tu pago fue procesado de forma segura. Ya estamos preparando tu funda.'}
              </p>

              <div className="bg-gradient-to-r from-white to-brand-red-light rounded-2xl p-5 sm:p-6 mb-8 text-left space-y-4">
                {(isTransfer
                  ? [
                      { icon: Mail, title: 'Revisa tu correo', text: 'Te enviamos la confirmación de recepción del comprobante' },
                      { icon: Clock, title: 'Validación de pago', text: 'Te avisaremos cuando confirmemos tu transferencia' },
                      { icon: Package, title: 'Producción', text: 'Tu funda entrará en producción al confirmar el pago' },
                    ]
                  : [
                      { icon: Mail, title: 'Revisa tu correo', text: 'Te enviamos la confirmación con la imagen de tu diseño' },
                      { icon: Package, title: 'En producción', text: 'Tu funda estará lista en 24-48 horas hábiles' },
                      { icon: ArrowRight, title: 'Sigue tu pedido', text: 'Consulta el estado en Mis Órdenes' },
                    ]
                ).map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-red" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {savedDesigns.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 text-left">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">🎨 Tu diseño personalizado</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Guarda una copia de tu imagen antes de cerrar esta página.
                  </p>
                  <div className="space-y-4">
                    {savedDesigns.map((design, index) => (
                      <div
                        key={`${design.modelName}-${index}`}
                        className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100"
                      >
                        <img
                          src={design.customImage}
                          alt={design.modelName}
                          className="w-28 h-28 object-cover rounded-lg border border-gray-200 bg-white"
                        />
                        <div className="flex-1 text-center sm:text-left">
                          <p className="font-semibold text-gray-900">{design.modelName}</p>
                          <p className="text-sm text-gray-500 mb-3">Listo para descargar</p>
                          <button
                            type="button"
                            onClick={() =>
                              downloadDataUrl(
                                design.customImage,
                                `diseno-${design.modelName.replace(/\s+/g, '-')}.png`
                              )
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded-lg hover:bg-brand-red-dark transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Descargar imagen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {!isTransfer && (
                  <button
                    onClick={() => router.push('/ordenes')}
                    className="w-full bg-brand-red text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Ver mis órdenes
                  </button>
                )}
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Crear otra funda
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-4 text-sm">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:underline"
                >
                  Facebook
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:underline"
                >
                  Instagram
                </a>
              </div>
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
    <Suspense fallback={<LoadingScreen message="Confirmando tu pedido..." submessage="Verificando tu pago" />}>
      <SuccessContent />
    </Suspense>
  );
}
