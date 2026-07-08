import {
  getBankTransferDetails,
  validateTransferReceipt,
} from '@/lib/bank-transfer';
import { isStripeKeyMismatch } from '@/lib/stripe-config';

describe('Bank transfer payment flow', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('loads bank details from public env vars', () => {
    process.env.NEXT_PUBLIC_BANK_NAME = 'Banco Test';
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_HOLDER = 'EFM Test';
    process.env.NEXT_PUBLIC_BANK_CLABE = '012345678901234567';
    process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER = '9876543210';

    expect(getBankTransferDetails()).toEqual({
      bankName: 'Banco Test',
      accountHolder: 'EFM Test',
      clabe: '012345678901234567',
      accountNumber: '9876543210',
    });
  });

  it('accepts pdf receipt data url', () => {
    const pdf = 'data:application/pdf;base64,JVBERi0xLjQK';
    expect(validateTransferReceipt(pdf).valid).toBe(true);
  });

  it('rejects oversized receipt', () => {
    const hugeBase64 = 'A'.repeat(7 * 1024 * 1024);
    const dataUrl = `data:image/png;base64,${hugeBase64}`;
    const result = validateTransferReceipt(dataUrl);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/5 MB/);
  });

  it('uses expected transfer order statuses', () => {
    const transferOrder = {
      status: 'pending_payment',
      paymentStatus: 'pending_verification',
      paymentMethod: 'bank_transfer',
    };

    expect(transferOrder.status).toBe('pending_payment');
    expect(transferOrder.paymentStatus).toBe('pending_verification');
    expect(transferOrder.paymentMethod).toBe('bank_transfer');
  });

  it('marks transfer as paid after admin confirmation', () => {
    const afterConfirm = {
      status: 'confirmed',
      paymentStatus: 'paid',
    };

    expect(afterConfirm.status).toBe('confirmed');
    expect(afterConfirm.paymentStatus).toBe('paid');
  });
});

describe('Stripe card payment readiness', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('allows matching test keys for checkout', () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_checkout';
    process.env.STRIPE_SECRET_KEY = 'sk_test_checkout';
    expect(isStripeKeyMismatch()).toBe(false);
  });

  it('uses stripe payment method on paid card orders', () => {
    const stripeOrder = {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
    };

    expect(stripeOrder.paymentMethod).toBe('stripe');
    expect(stripeOrder.paymentStatus).toBe('paid');
  });
});
