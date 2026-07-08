export type DiscountType = 'percent' | 'fixed';

export interface StoreSettingsDTO {
  basePriceMxn: number;
  promoActive: boolean;
  promoTitle: string | null;
  promoDiscountType: DiscountType | null;
  promoDiscountValue: number | null;
}

export interface PromoCodeDTO {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
}

export const DEFAULT_BASE_PRICE_MXN = 599;

export function applyDiscount(
  amount: number,
  type: DiscountType,
  value: number
): number {
  if (value <= 0) return amount;
  if (type === 'percent') {
    const pct = Math.min(value, 100);
    return Math.max(0, Math.round(amount * (1 - pct / 100) * 100) / 100);
  }
  return Math.max(0, Math.round((amount - value) * 100) / 100);
}

export function getEffectiveUnitPrice(settings: StoreSettingsDTO): number {
  if (
    !settings.promoActive ||
    !settings.promoDiscountType ||
    settings.promoDiscountValue == null ||
    settings.promoDiscountValue <= 0
  ) {
    return settings.basePriceMxn;
  }
  return applyDiscount(
    settings.basePriceMxn,
    settings.promoDiscountType,
    settings.promoDiscountValue
  );
}

export function calculatePromoCodeDiscount(
  subtotal: number,
  type: DiscountType,
  value: number
): number {
  if (subtotal <= 0 || value <= 0) return 0;
  if (type === 'percent') {
    const pct = Math.min(value, 100);
    return Math.round(subtotal * (pct / 100) * 100) / 100;
  }
  return Math.min(subtotal, Math.round(value * 100) / 100);
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

export function generatePromoCode(prefix = 'EFM'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
}

export function isPromoCodeValid(
  promo: Pick<PromoCodeDTO, 'active' | 'expiresAt' | 'maxUses' | 'usedCount'>,
  now = new Date()
): boolean {
  if (!promo.active) return false;
  if (promo.expiresAt && new Date(promo.expiresAt) < now) return false;
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses) return false;
  return true;
}

export function formatPriceMxn(amount: number): string {
  return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} MXN`;
}

export function toStripeUnitAmount(mxn: number): number {
  return Math.max(0, Math.round(mxn * 100));
}
