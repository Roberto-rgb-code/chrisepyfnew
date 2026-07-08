import { sendOrderEmail } from '../src/lib/send-order-email';

const targetEmail = process.argv[2] || 'admin@empaquesyfundas.com';

async function main() {
  if (!process.env.RESEND_API_KEY) {
    console.error('FAIL: RESEND_API_KEY no está en el entorno');
    process.exit(1);
  }

  console.log(`Enviando correo transfer_pending a ${targetEmail}...`);

  const data = await sendOrderEmail(
    'transfer_pending',
    {
      id: `TRF-TEST-${Date.now()}`,
      customerName: 'Cliente de Prueba EFM',
      customerEmail: targetEmail,
      total: 599,
      date: new Date().toISOString(),
      items: [
        {
          modelName: 'iPhone 15',
          quantity: 1,
          price: 599,
          customImage: null,
        },
      ],
      shippingDetails: {
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
      },
    },
    targetEmail
  );

  console.log('OK: correo enviado');
  console.log(JSON.stringify({ messageId: data?.id }, null, 2));
}

main().catch((error) => {
  console.error('FAIL:', error?.message || error);
  process.exit(1);
});
