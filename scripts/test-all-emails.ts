import { sendOrderEmail } from '../src/lib/send-order-email';
import { sendNewAccountEmails, sendAccountVerifiedEmail } from '../src/lib/send-account-email';

const targetEmail = process.argv[2] || 'empaquesyfundas@gmail.com';

const tinyPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const shippingDetails = {
  firstName: 'Cliente',
  lastName: 'Prueba',
  whatsApp: '3311493852',
  email: targetEmail,
  street: 'Av. Revolución 123',
  neighborhood: 'Centro',
  postalCode: '44100',
  city: 'Guadalajara',
  state: 'Jalisco',
  recipientName: 'Cliente Prueba',
  hasValidIne: true,
};

const baseOrder = {
  customerName: 'Cliente de Prueba EFM',
  customerEmail: targetEmail,
  total: 599,
  date: new Date().toISOString(),
  items: [
    {
      modelName: 'iPhone 15',
      quantity: 1,
      price: 599,
      customImage: tinyPng,
    },
  ],
  shippingDetails,
};

const emailTests = [
  {
    name: 'transfer_pending',
    type: 'transfer_pending' as const,
    data: { ...baseOrder, id: `TRF-TEST-${Date.now()}` },
  },
  {
    name: 'order_confirmation',
    type: 'order_confirmation' as const,
    data: { ...baseOrder, id: `ORD-TEST-${Date.now()}` },
  },
  {
    name: 'order_processing',
    type: 'order_processing' as const,
    data: { ...baseOrder, id: `ORD-PROC-${Date.now()}` },
  },
  {
    name: 'order_shipped',
    type: 'order_shipped' as const,
    data: {
      ...baseOrder,
      id: `ORD-SHIP-${Date.now()}`,
      trackingNumber: 'MX123456789',
      shippingCompany: 'Paquetexpress',
      trackingUrl: 'https://www.empaquesyfundas.com',
    },
  },
];

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('FAIL: RESEND_API_KEY no está en el entorno');
    process.exit(1);
  }

  console.log(`Enviando ${emailTests.length} correos de prueba a ${targetEmail}...\n`);

  for (const test of emailTests) {
    process.stdout.write(`→ ${test.name}... `);
    const result = await sendOrderEmail(test.type, test.data, targetEmail);
    console.log(`OK (${result?.id})`);
  }

  process.stdout.write('→ welcome_account... ');
  const welcome = await sendNewAccountEmails({
    customerName: 'Cliente Prueba',
    customerEmail: targetEmail,
    userId: 'test-uid-123',
    registeredAt: new Date().toISOString(),
  });
  console.log(`OK (welcome + admin)`);

  process.stdout.write('→ account_verified... ');
  const verified = await sendAccountVerifiedEmail({
    customerName: 'Cliente Prueba',
    customerEmail: targetEmail,
  });
  console.log(`OK (${verified?.id})`);

  console.log('\nTodos los correos se enviaron correctamente desde noreply@empaquesyfundas.com');
}

main().catch((error) => {
  console.error('\nFAIL:', error?.message || error);
  process.exit(1);
});
