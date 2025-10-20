import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { customer_email, metadata } = session;
    
    if (!customer_email) {
      console.error('No customer email found');
      return;
    }

    // Crear datos del pedido
    const orderData = {
      id: session.id,
      customerName: customer_email.split('@')[0], // Usar parte del email como nombre
      customerEmail: customer_email,
      total: (session.amount_total || 0) / 100, // Convertir de centavos
      items: metadata?.items ? JSON.parse(metadata.items) : [],
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    // Enviar email de confirmación
    await sendOrderEmail('order_confirmation', orderData, customer_email);
    
    console.log(`Order confirmation email sent for session: ${session.id}`);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Aquí podrías enviar un email de procesamiento
    // Por ahora solo logueamos
    console.log(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function sendOrderEmail(type: string, orderData: any, customerEmail: string) {
  try {
    let emailTemplate;
    
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
        throw new Error('Invalid email type');
    }

    const { data, error } = await resend.emails.send({
      from: 'Empaques & Fundas <noreply@empaquesyfundas.com>',
      to: [customerEmail],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log(`Email sent successfully: ${data?.id}`);
    return data;
  } catch (error) {
    console.error('Error in sendOrderEmail:', error);
    throw error;
  }
}
