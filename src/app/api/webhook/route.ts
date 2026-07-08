import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderEmail } from '@/lib/send-order-email';
import { formatOrderNumber } from '@/lib/email-utils';
import {
  metadataToShippingDetails,
  shippingDetailsToOrderData,
  type ShippingDetails,
} from '@/lib/shipping';

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
        console.log(`Payment succeeded: ${(event.data.object as Stripe.PaymentIntent).id}`);
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
      const cart = await prisma.cart.findUnique({ where: { id: metadata.cartId } });
      if (cart) {
        completeItems = (cart.items as any[]) || [];
        cartId = cart.id;
      }
    }

    if (completeItems.length === 0 && metadata?.items) {
      try {
        completeItems = JSON.parse(metadata.items);
      } catch {
        /* ignore */
      }
    }

    if (completeItems.length === 0) {
      console.error('❌ No se pudieron obtener items para la orden');
      return;
    }

    const customerName =
      metadata?.customerName ||
      customer_email.split('@')[0];

    const userId = metadata?.userId && metadata.userId !== 'guest' ? metadata.userId : null;
    const shippingDetails: ShippingDetails | null = metadata
      ? metadataToShippingDetails({ ...metadata, customerEmail: customer_email })
      : null;
    const shippingData = shippingDetails ? shippingDetailsToOrderData(shippingDetails) : {};

    await prisma.order.upsert({
      where: { orderId: session.id },
      update: {
        status: 'confirmed',
        paymentStatus: session.payment_status,
        paymentMethod: 'stripe',
        amountTotal: (session.amount_total || 0) / 100,
        items: completeItems,
        hasCustomDesigns: completeItems.some((item: any) => item.customImage),
        totalItems: completeItems.length,
        customerName,
        ...shippingData,
      },
      create: {
        orderId: session.id,
        userId,
        customerEmail: customer_email,
        customerName,
        status: 'confirmed',
        paymentStatus: session.payment_status,
        paymentMethod: 'stripe',
        amountTotal: (session.amount_total || 0) / 100,
        currency: session.currency || 'mxn',
        items: completeItems,
        hasCustomDesigns: completeItems.some((item: any) => item.customImage),
        totalItems: completeItems.length,
        cartId,
        orderDate: new Date(),
        ...shippingData,
      },
    });

    if (cartId) {
      await prisma.cart.update({
        where: { id: cartId },
        data: { status: 'completed' },
      });
    }

    await sendOrderEmail(
      'order_confirmation',
      {
        id: session.id,
        customerName,
        customerEmail: customer_email,
        total: (session.amount_total || 0) / 100,
        items: completeItems,
        date: new Date().toISOString(),
        shippingDetails: shippingDetails || undefined,
      },
      customer_email
    );

    console.log(`✅ Orden #${formatOrderNumber(session.id)} confirmada y email enviado`);
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}
