export function validateStripeKeys(): void {
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  const secret = process.env.STRIPE_SECRET_KEY || '';

  const pubIsLive = publishable.startsWith('pk_live_');
  const pubIsTest = publishable.startsWith('pk_test_');
  const secIsLive = secret.startsWith('sk_live_');
  const secIsTest = secret.startsWith('sk_test_');

  if ((pubIsLive && secIsTest) || (pubIsTest && secIsLive)) {
    console.error(
      '⚠️ Stripe: las claves pública y secreta deben ser del mismo modo (live+live o test+test)'
    );
  }
}
