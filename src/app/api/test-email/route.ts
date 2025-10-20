import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Datos de prueba
    const testOrderData = {
      id: 'TEST-' + Date.now(),
      customerName: 'Cliente de Prueba',
      customerEmail: email,
      total: 299,
      items: [
        {
          modelName: 'iPhone 17 Pro Max',
          quantity: 1,
          price: 299
        }
      ],
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    // Enviar email de prueba
    const emailTemplate = emailTemplates.orderConfirmation(testOrderData);

    const { data, error } = await resend.emails.send({
      from: 'Empaques & Fundas <noreply@empaquesyfundas.com>',
      to: [email],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Error enviando email de prueba:', error);
      return NextResponse.json(
        { error: 'Error enviando email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'Email de prueba enviado exitosamente'
    });

  } catch (error: any) {
    console.error('Error en test-email API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
