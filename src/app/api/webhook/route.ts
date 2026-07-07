import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';
import { prisma } from '@/lib/prisma';

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
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { customer_email, metadata } = session;

    if (!customer_email) {
      console.error('No customer email found');
      return;
    }

    let completeItems: any[] = [];
    let cartId: string | null = null;

    if (metadata?.cartId) {
      try {
        const cart = await prisma.cart.findUnique({
          where: { id: metadata.cartId },
        });

        if (cart) {
          completeItems = (cart.items as any[]) || [];
          cartId = cart.id;
          console.log('✅ Carrito recuperado desde PostgreSQL:', cartId);
        } else {
          console.warn('⚠️ Carrito no encontrado:', metadata.cartId);
        }
      } catch (error) {
        console.error('❌ Error recuperando carrito:', error);
      }
    }

    if (completeItems.length === 0 && metadata?.items) {
      try {
        const items = JSON.parse(metadata.items);
        completeItems = items.map((item: any) => ({
          id: item.id,
          modelId: item.modelId || item.id.split('-')[0],
          modelName: item.modelName,
          quantity: item.quantity,
          price: item.price,
          colorURL: item.colorURL || '',
          maskURL: item.maskURL || '',
          customImage: item.customImage || null,
          imageControls: item.imageControls || null,
        }));
      } catch (error) {
        console.error('❌ Error parseando items desde metadata:', error);
      }
    }

    if (completeItems.length === 0) {
      console.error('❌ No se pudieron obtener items para la orden');
      return;
    }

    const orderData = {
      id: session.id,
      customerName: customer_email.split('@')[0],
      customerEmail: customer_email,
      total: (session.amount_total || 0) / 100,
      items: completeItems,
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null;

    try {
      await prisma.order.upsert({
        where: { orderId: session.id },
        update: {
          status: 'confirmed',
          paymentStatus: session.payment_status,
          amountTotal: (session.amount_total || 0) / 100,
          items: completeItems,
          hasCustomDesigns: completeItems.some((item: any) => item.customImage),
          totalItems: completeItems.length,
        },
        create: {
          orderId: session.id,
          userId,
          customerEmail: customer_email,
          customerName: customer_email.split('@')[0],
          status: 'confirmed',
          paymentStatus: session.payment_status,
          amountTotal: (session.amount_total || 0) / 100,
          currency: session.currency || 'mxn',
          items: completeItems,
          hasCustomDesigns: completeItems.some((item: any) => item.customImage),
          totalItems: completeItems.length,
          cartId,
          orderDate: new Date(),
        },
      });

      if (cartId) {
        await prisma.cart.update({
          where: { id: cartId },
          data: { status: 'completed' },
        });
      }

      console.log('✅ Orden guardada en PostgreSQL:', session.id);
    } catch (dbError) {
      console.error('❌ Error guardando orden:', dbError);
    }

    await sendOrderEmail('order_confirmation', orderData, customer_email);
    console.log(`Order confirmation email sent for session: ${session.id}`);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment succeeded: ${paymentIntent.id}`);
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
