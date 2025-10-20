import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { type, orderData, customerEmail } = await request.json();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email del cliente es requerido' },
        { status: 400 }
      );
    }

    let emailTemplate;
    let emailSubject;

    switch (type) {
      case 'order_confirmation':
        emailTemplate = emailTemplates.orderConfirmation(orderData);
        break;
      case 'order_processing':
        emailTemplate = emailTemplates.orderProcessing(orderData);
        break;
      case 'order_shipped':
        emailTemplate = emailTemplates.orderShipped(orderData);
        break;
      default:
        return NextResponse.json(
          { error: 'Tipo de email no válido' },
          { status: 400 }
        );
    }

    const { data, error } = await resend.emails.send({
      from: 'Empaques & Fundas <noreply@empaquesyfundas.com>',
      to: [customerEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return NextResponse.json(
        { error: 'Error enviando email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        messageId: data?.id,
        message: 'Email enviado exitosamente' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en send-email API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
