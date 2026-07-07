'use client';

import { useState, Suspense } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasePreview from '@/components/CasePreview';
import CheckoutSteps from '@/components/CheckoutSteps';
import AuthModal from '@/components/AuthModal';
import LoadingScreen from '@/components/LoadingScreen';
import { Trash2, Plus, Minus, ShoppingBag, Shield, Truck, Lock } from '@/components/icons';
import { redirectToCheckout } from '@/lib/stripe';

function CartContent() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      setShowAuthModal(true);
      showToast('Inicia sesión para completar tu compra', 'info');
      return;
    }

    if (cart.length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          userId: user.uid,
          userEmail: user.email,
          customerName: user.displayName || user.email?.split('@')[0],
        }),
      });

      const data = await response.json();

      if (data.url) {
        await redirectToCheckout(data.url);
      } else {
        showToast(data.error || 'Error al procesar el pago', 'error');
      }
    } catch {
      showToast('Error al conectar con el pago. Intenta de nuevo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Personaliza tu funda y agrégala aquí cuando estés listo.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Crear mi funda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <CheckoutSteps current={2} />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tu carrito</h1>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">{cart.length} producto(s) · Revisa tu diseño antes de pagar</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-gray-100 hover:border-blue-100 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <CasePreview item={item} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{item.modelName}</h3>
                    <p className="text-sm text-purple-600 font-medium">🎨 Diseño personalizado</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600 mt-2">${item.price} MXN</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${getCartTotal()} MXN</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-semibold text-green-600">GRATIS</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-green-600">${getCartTotal()} MXN</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Redirigiendo a pago seguro...' : user ? 'Pagar con Stripe' : 'Iniciar sesión y pagar'}
            </button>

            {!user && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Necesitas una cuenta para completar la compra
              </p>
            )}

            <button onClick={clearCart} className="w-full mt-3 text-sm text-gray-500 hover:text-red-500 py-2 transition-colors">
              Vaciar carrito
            </button>

            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
              {[
                { icon: Shield, text: 'Pago 100% seguro con Stripe' },
                { icon: Truck, text: 'Envío gratis incluido' },
                { icon: ShoppingBag, text: 'Email con tu diseño al confirmar' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
        onSuccess={handleCheckout}
      />
    </div>
  );
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen fullScreen={false} message="Cargando carrito..." className="py-20" />}>
        <CartContent />
      </Suspense>
      <Footer />
    </>
  );
}
