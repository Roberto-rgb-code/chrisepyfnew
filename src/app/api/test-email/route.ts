import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/send-order-email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const testOrderData = {
      id: 'TEST-' + Date.now(),
      customerName: 'Cliente de Prueba',
      customerEmail: email,
      total: 599,
      items: [
        {
          modelName: 'iPhone 17 Pro Max',
          quantity: 1,
          price: 599,
          customImage: null,
        },
      ],
      date: new Date().toISOString(),
    };

    const data = await sendOrderEmail('order_confirmation', testOrderData, email);

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'Email de prueba enviado exitosamente',
    });
  } catch (error) {
    console.error('Error en test-email API:', error);
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
