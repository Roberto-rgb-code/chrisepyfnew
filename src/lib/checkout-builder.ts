import { getEffectiveUnitPrice, StoreSettingsDTO, toStripeUnitAmount } from '@/lib/pricing';

export interface CheckoutCartItem {
  id: string;
  modelName: string;
  colorURL?: string;
  customImage?: string | null;
  quantity: number;
  price?: number;
}

export function buildStripeLineItems(
  items: CheckoutCartItem[],
  settings: StoreSettingsDTO,
  baseUrl: string
) {
  const unitPrice = getEffectiveUnitPrice(settings);

  return items.map((item) => {
    const productImage = `${baseUrl}${item.colorURL || ''}`;
    return {
      price_data: {
        currency: 'mxn' as const,
        product_data: {
          name: `Funda Personalizada - ${item.modelName}`,
          description: item.customImage ? 'Con diseño personalizado' : 'Funda sin personalizar',
          images: item.colorURL ? [productImage] : undefined,
          metadata: {
            productId: item.id,
            modelName: item.modelName,
          },
        },
        unit_amount: toStripeUnitAmount(unitPrice),
      },
      quantity: item.quantity,
    };
  });
}

export function calculateCheckoutSubtotal(
  items: CheckoutCartItem[],
  settings: StoreSettingsDTO
): number {
  const unitPrice = getEffectiveUnitPrice(settings);
  return items.reduce((sum, item) => sum + unitPrice * item.quantity, 0);
}
