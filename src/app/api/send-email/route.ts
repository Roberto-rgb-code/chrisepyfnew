import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/send-order-email';

export async function POST(request: NextRequest) {
  try {
    const { type, orderData, customerEmail } = await request.json();

    if (!customerEmail || !type || !orderData) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const validTypes = [
      'order_confirmation',
      'order_processing',
      'order_shipped',
      'transfer_pending',
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Tipo de email no válido' }, { status: 400 });
    }

    const data = await sendOrderEmail(type, orderData, customerEmail);

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Error en send-email API:', error);
    const message = error instanceof Error ? error.message : 'Error enviando email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
