import { loadStripe } from '@stripe/stripe-js';

// Crear una instancia de Stripe con la clave pública
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Función simple para redirigir usando window.location
export const redirectToCheckout = async (checkoutUrl: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
  }
};
