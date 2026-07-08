import { isStripeKeyMismatch } from '@/lib/stripe-config';

describe('Stripe checkout integration readiness', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('requires matching test keys for checkout in development', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    expect(isStripeKeyMismatch()).toBe(false);
  });

  it('blocks mixed live/test keys used together', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    expect(isStripeKeyMismatch()).toBe(true);
  });

  it('has stripe secret key format when configured', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    expect(process.env.STRIPE_SECRET_KEY.startsWith('sk_')).toBe(true);
  });
});
