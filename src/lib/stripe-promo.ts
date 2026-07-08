import Stripe from 'stripe';
import { DiscountType } from '@/lib/pricing';

export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2024-04-10' });
}

export async function createStripePromoPair(
  code: string,
  discountType: DiscountType,
  discountValue: number
): Promise<{ couponId: string; promotionCodeId: string } | null> {
  const stripe = getStripeClient();
  if (!stripe) return null;

  const couponParams: Stripe.CouponCreateParams =
    discountType === 'percent'
      ? {
          percent_off: Math.min(discountValue, 100),
          duration: 'once',
          name: `Promo ${code}`,
        }
      : {
          amount_off: Math.round(discountValue * 100),
          currency: 'mxn',
          duration: 'once',
          name: `Promo ${code}`,
        };

  const coupon = await stripe.coupons.create(couponParams);
  const promotionCode = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code,
    active: true,
  });

  return {
    couponId: coupon.id,
    promotionCodeId: promotionCode.id,
  };
}

export async function setStripePromotionActive(
  promotionCodeId: string,
  active: boolean
): Promise<void> {
  const stripe = getStripeClient();
  if (!stripe) return;
  await stripe.promotionCodes.update(promotionCodeId, { active });
}
