'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import CheckoutSteps from '@/components/CheckoutSteps';
import DeliveryDetailsForm from '@/components/DeliveryDetailsForm';
import PaymentMethodPanel from '@/components/PaymentMethodPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { redirectToCheckout } from '@/lib/stripe';
import {
  type ShippingDetails,
  type ShippingDetailsInput,
  validateShippingDetails,
} from '@/lib/shipping';

const PROMO_STORAGE_KEY = 'checkout_promo';

function CheckoutContent() {
  const { user, loading, emailVerified } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<'delivery' | 'payment'>('delivery');
  const [formValues, setFormValues] = useState<ShippingDetailsInput>({ hasValidIne: true });
  const [validatedShipping, setValidatedShipping] = useState<ShippingDetails | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stripeLoading, setStripeLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  const promoCode = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw)?.code || null;
    } catch {
      return null;
    }
  }, [step]);

  const orderTotal = useMemo(() => {
    if (typeof window === 'undefined') return getCartTotal();
    const raw = sessionStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return getCartTotal();
    try {
      const parsed = JSON.parse(raw);
      return parsed?.totalAfterDiscount ?? getCartTotal();
    } catch {
      return getCartTotal();
    }
  }, [getCartTotal, step]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?returnUrl=%2Fcheckout');
    } else if (!loading && user && !emailVerified) {
      router.push('/verificar-correo?returnUrl=%2Fcheckout');
    } else if (!loading && cart.length === 0) {
      router.push('/carrito');
    }
  }, [user, loading, emailVerified, cart.length, router]);

  useEffect(() => {
    if (!user) return;
    const parts = (user.displayName || '').trim().split(/\s+/);
    setFormValues((prev) => ({
      ...prev,
      firstName: prev.firstName || parts[0] || '',
      lastName: prev.lastName || parts.slice(1).join(' ') || '',
      email: user.email || '',
      recipientName: prev.recipientName || user.displayName || parts[0] || '',
    }));
  }, [user]);

  const handleChange = (field: keyof ShippingDetailsInput, value: string | boolean) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleDeliverySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.email) return;

    const validation = validateShippingDetails({
      ...formValues,
      email: user.email,
    });

    if (!validation.valid || !validation.data) {
      setErrors(validation.errors);
      showToast('Revisa los datos de entrega', 'error');
      return;
    }

    setValidatedShipping(validation.data);
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitCheckout = async (endpoint: string, extraBody: Record<string, unknown> = {}) => {
    if (!user?.email || !validatedShipping) return null;

    const idToken = await user.getIdToken();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        items: cart,
        userId: user.uid,
        userEmail: user.email,
        promoCode,
        shippingDetails: validatedShipping,
        ...extraBody,
      }),
    });

    return response.json();
  };

  const handlePayStripe = async () => {
    setStripeLoading(true);
    try {
      const data = await submitCheckout('/api/checkout');
      if (data?.url) {
        sessionStorage.removeItem(PROMO_STORAGE_KEY);
        await redirectToCheckout(data.url);
        return;
      }
      showToast(data?.error || 'Error al procesar el pago', 'error');
    } catch {
      showToast('Error al conectar con el pago. Intenta de nuevo.', 'error');
    } finally {
      setStripeLoading(false);
    }
  };

  const handlePayTransfer = async (transferReceipt: string) => {
    setTransferLoading(true);
    try {
      const data = await submitCheckout('/api/checkout/transfer', { transferReceipt });
      if (data?.success) {
        sessionStorage.removeItem(PROMO_STORAGE_KEY);
        clearCart();
        router.push(`/success?transfer=1&order=${encodeURIComponent(data.orderId)}`);
        return;
      }
      showToast(data?.error || 'Error al registrar la transferencia', 'error');
    } catch {
      showToast('Error al enviar el comprobante. Intenta de nuevo.', 'error');
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading || !user || cart.length === 0) {
    return <LoadingScreen message="Preparando checkout..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <CheckoutSteps current={step === 'delivery' ? 3 : 4} />

      {step === 'delivery' ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Datos de entrega</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Completa la información para enviar tu pedido. Total: ${orderTotal} MXN
            </p>
          </div>
          <DeliveryDetailsForm
            initialEmail={user.email || ''}
            values={formValues}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleDeliverySubmit}
          />
        </>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pago</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Elige cómo quieres pagar tu pedido.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep('delivery')}
              className="text-sm text-brand-red hover:underline shrink-0"
            >
              Editar entrega
            </button>
          </div>
          <PaymentMethodPanel
            total={orderTotal}
            onPayStripe={handlePayStripe}
            onPayTransfer={handlePayTransfer}
            stripeLoading={stripeLoading}
            transferLoading={transferLoading}
          />
        </>
      )}

      <div className="mt-6 text-center">
        <Link href="/carrito" className="text-sm text-gray-500 hover:text-gray-700">
          ← Volver al carrito
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen message="Preparando checkout..." />}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </>
  );
}
