import {
  applyDiscount,
  calculatePromoCodeDiscount,
  getEffectiveUnitPrice,
  isPromoCodeValid,
  normalizePromoCode,
  toStripeUnitAmount,
} from '@/lib/pricing';
import { buildStripeLineItems, calculateCheckoutSubtotal } from '@/lib/checkout-builder';

describe('pricing utilities', () => {
  it('applies percent discount', () => {
    expect(applyDiscount(599, 'percent', 20)).toBe(479.2);
  });

  it('applies fixed discount without going negative', () => {
    expect(applyDiscount(599, 'fixed', 100)).toBe(499);
    expect(applyDiscount(50, 'fixed', 100)).toBe(0);
  });

  it('returns base price when promo inactive', () => {
    expect(
      getEffectiveUnitPrice({
        basePriceMxn: 599,
        promoActive: false,
        promoTitle: null,
        promoDiscountType: null,
        promoDiscountValue: null,
      })
    ).toBe(599);
  });

  it('returns discounted price when global promo active', () => {
    expect(
      getEffectiveUnitPrice({
        basePriceMxn: 599,
        promoActive: true,
        promoTitle: 'Sale',
        promoDiscountType: 'percent',
        promoDiscountValue: 10,
      })
    ).toBe(539.1);
  });

  it('calculates promo code discount on subtotal', () => {
    expect(calculatePromoCodeDiscount(1000, 'percent', 15)).toBe(150);
    expect(calculatePromoCodeDiscount(1000, 'fixed', 200)).toBe(200);
  });

  it('normalizes promo codes', () => {
    expect(normalizePromoCode('  verano 20 ')).toBe('VERANO20');
  });

  it('validates promo code usage limits', () => {
    expect(
      isPromoCodeValid({
        active: true,
        expiresAt: null,
        maxUses: 5,
        usedCount: 4,
      })
    ).toBe(true);
    expect(
      isPromoCodeValid({
        active: true,
        expiresAt: null,
        maxUses: 5,
        usedCount: 5,
      })
    ).toBe(false);
  });

  it('converts MXN to Stripe centavos', () => {
    expect(toStripeUnitAmount(599)).toBe(59900);
    expect(toStripeUnitAmount(539.1)).toBe(53910);
  });
});

describe('checkout builder', () => {
  const settings = {
    basePriceMxn: 500,
    promoActive: true,
    promoTitle: 'Promo',
    promoDiscountType: 'percent' as const,
    promoDiscountValue: 10,
  };

  const items = [
    {
      id: 'ip17-1',
      modelName: 'iPhone 17',
      colorURL: '/downloaded_images/ip17_c002_color.png',
      quantity: 2,
    },
  ];

  it('builds stripe line items with server-side unit price', () => {
    const lineItems = buildStripeLineItems(items, settings, 'https://example.com');
    expect(lineItems[0].price_data.unit_amount).toBe(45000);
    expect(lineItems[0].quantity).toBe(2);
    expect(lineItems[0].price_data.currency).toBe('mxn');
  });

  it('calculates checkout subtotal from settings not client price', () => {
    const subtotal = calculateCheckoutSubtotal(
      [{ ...items[0], price: 999 }],
      settings
    );
    expect(subtotal).toBe(900);
  });
});
