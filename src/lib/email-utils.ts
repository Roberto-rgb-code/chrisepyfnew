export interface EmailAttachment {
  filename: string;
  content: string;
  cid: string;
}

export interface EmailReadyItem {
  modelName: string;
  quantity: number;
  price: number;
  imageCid: string | null;
  hasCustomDesign: boolean;
}

export function formatOrderNumber(orderId: string): string {
  if (orderId.startsWith('TRF-')) return orderId;
  return orderId.slice(-8).toUpperCase();
}

export function prepareOrderEmailData(orderData: {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    modelName: string;
    quantity: number;
    price: number;
    customImage?: string | null;
  }>;
  date?: string;
}) {
  const attachments: EmailAttachment[] = [];
  const emailItems: EmailReadyItem[] = orderData.items.map((item, index) => {
    const hasCustomDesign = Boolean(item.customImage?.startsWith('data:image'));

    if (hasCustomDesign && item.customImage) {
      const cid = `design-${index}`;
      const base64 = item.customImage.includes(',')
        ? item.customImage.split(',')[1]
        : item.customImage;

      attachments.push({
        filename: `${item.modelName.replace(/\s+/g, '-')}-diseno.png`,
        content: base64,
        cid,
      });

      return {
        modelName: item.modelName,
        quantity: item.quantity,
        price: item.price,
        imageCid: cid,
        hasCustomDesign: true,
      };
    }

    return {
      modelName: item.modelName,
      quantity: item.quantity,
      price: item.price,
      imageCid: null,
      hasCustomDesign: false,
    };
  });

  return {
    orderNumber: formatOrderNumber(orderData.id),
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    total: orderData.total,
    date: orderData.date || new Date().toISOString(),
    items: emailItems,
    attachments,
  };
}
