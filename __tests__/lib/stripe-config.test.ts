import { isStripeKeyMismatch } from '@/lib/stripe-config';

describe('Stripe key validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('detects live publishable + test secret mismatch', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    expect(isStripeKeyMismatch()).toBe(true);
  });

  it('detects test publishable + live secret mismatch', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_live_abc';
    expect(isStripeKeyMismatch()).toBe(true);
  });

  it('allows matching live keys', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_live_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_live_abc';
    expect(isStripeKeyMismatch()).toBe(false);
  });

  it('allows matching test keys', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_abc';
    process.env.STRIPE_SECRET_KEY = 'sk_test_abc';
    expect(isStripeKeyMismatch()).toBe(false);
  });
});
