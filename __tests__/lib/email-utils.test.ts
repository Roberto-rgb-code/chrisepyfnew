import { prepareOrderEmailData, formatOrderNumber } from '@/lib/email-utils';

describe('email-utils', () => {
  const sampleOrder = {
    id: 'cs_test_abcdefghijklmnop',
    customerName: 'Juan Pérez',
    customerEmail: 'juan@test.com',
    total: 599,
    items: [
      {
        modelName: 'iPhone 15',
        quantity: 1,
        price: 599,
        customImage: 'data:image/png;base64,iVBORw0KGgo=',
      },
    ],
  };

  it('formats transfer order number without truncation', () => {
    expect(formatOrderNumber('TRF-AB12CD34')).toBe('TRF-AB12CD34');
  });

  it('formats order number from session id', () => {
    expect(formatOrderNumber('cs_test_abcdefghijklmnop')).toBe('IJKLMNOP');
  });

  it('prepares email attachments for custom images', () => {
    const result = prepareOrderEmailData(sampleOrder);
    expect(result.attachments).toHaveLength(1);
    expect(result.attachments[0].cid).toBe('design-0');
    expect(result.items[0].imageCid).toBe('design-0');
    expect(result.items[0].hasCustomDesign).toBe(true);
  });

  it('handles items without custom image', () => {
    const result = prepareOrderEmailData({
      ...sampleOrder,
      items: [{ modelName: 'iPhone 15', quantity: 1, price: 599 }],
    });
    expect(result.attachments).toHaveLength(0);
    expect(result.items[0].hasCustomDesign).toBe(false);
  });

  it('uses customer name in prepared data', () => {
    const result = prepareOrderEmailData(sampleOrder);
    expect(result.customerName).toBe('Juan Pérez');
    expect(result.orderNumber).toBeTruthy();
  });
});
