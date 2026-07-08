import { prisma } from '@/lib/prisma';
import { DEFAULT_BASE_PRICE_MXN, StoreSettingsDTO } from '@/lib/pricing';

export async function getStoreSettings(): Promise<StoreSettingsDTO> {
  let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: { id: 'default', basePriceMxn: DEFAULT_BASE_PRICE_MXN },
    });
  }

  return {
    basePriceMxn: settings.basePriceMxn,
    promoActive: settings.promoActive,
    promoTitle: settings.promoTitle,
    promoDiscountType: settings.promoDiscountType as StoreSettingsDTO['promoDiscountType'],
    promoDiscountValue: settings.promoDiscountValue,
  };
}
