import { NextResponse } from 'next/server';
import { getEffectiveUnitPrice, formatPriceMxn } from '@/lib/pricing';
import { getStoreSettings } from '@/lib/store-settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    const effectivePrice = getEffectiveUnitPrice(settings);
    const hasSale =
      settings.promoActive &&
      settings.promoDiscountType &&
      settings.promoDiscountValue != null &&
      effectivePrice < settings.basePriceMxn;

    return NextResponse.json({
      basePriceMxn: settings.basePriceMxn,
      effectivePriceMxn: effectivePrice,
      formattedBase: formatPriceMxn(settings.basePriceMxn),
      formattedEffective: formatPriceMxn(effectivePrice),
      promo: hasSale
        ? {
            active: true,
            title: settings.promoTitle || 'Promoción activa',
            discountType: settings.promoDiscountType,
            discountValue: settings.promoDiscountValue,
          }
        : { active: false },
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'No se pudo cargar el precio' }, { status: 500 });
  }
}
