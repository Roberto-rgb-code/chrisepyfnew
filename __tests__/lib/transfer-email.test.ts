import { emailTemplates } from '@/lib/email-templates';

describe('transferPending email template', () => {
  it('includes emotional copy and order details', () => {
    const { subject, html } = emailTemplates.transferPending({
      orderNumber: 'TRF-AB12CD34',
      customerName: 'María',
      total: 599,
      date: '2026-07-08T00:00:00.000Z',
      items: [
        {
          modelName: 'iPhone 15',
          quantity: 1,
          price: 599,
          imageCid: null,
          hasCustomDesign: true,
        },
      ],
      shippingDetails: {
        firstName: 'María',
        lastName: 'López',
        whatsApp: '3312345678',
        email: 'maria@test.com',
        street: 'Av. Test 123',
        neighborhood: 'Centro',
        postalCode: '44100',
        city: 'Guadalajara',
        state: 'Jalisco',
        recipientName: 'María López',
        hasValidIne: true,
      },
    });

    expect(subject).toContain('TRF-AB12CD34');
    expect(html).toContain('¡Qué emoción!');
    expect(html).toContain('María');
    expect(html).toContain('BBVA');
    expect(html).toContain('012 180 01510320882 2');
    expect(html).toContain('iPhone 15');
  });
});
