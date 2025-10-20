'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CasePreview from '@/components/CasePreview';
import CheckoutModal from '@/components/CheckoutModal';
import { Trash2, Plus, Minus } from 'lucide-react';
import { redirectToCheckout } from '@/lib/stripe';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      alert('Debes iniciar sesión para continuar con la compra');
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      // Llamar a la API de Stripe para crear una sesión de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirigir a Stripe Checkout
        await redirectToCheckout(data.url);
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
      setShowCheckoutModal(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">¡Agrega productos para comenzar tu compra!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Ir a Personalizar
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🛒 Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  {/* Preview de la funda personalizada */}
                  <CasePreview 
                    item={item} 
                    className="w-24 h-48" 
                    showControls={true}
                  />

                  {/* Detalles */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.modelName}</h3>
                    <p className="text-gray-600">Funda Personalizada</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">${item.price} MXN</p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${getCartTotal()} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-xl font-bold text-green-600">${getCartTotal()} MXN</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Proceder al Pago'}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Vaciar Carrito
              </button>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <span>Envío gratis en pedidos +$500</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Garantía de 2 años</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        items={cart}
        total={getCartTotal()}
        onConfirmPayment={handleConfirmPayment}
        loading={loading}
      />
    </>
  );
}

