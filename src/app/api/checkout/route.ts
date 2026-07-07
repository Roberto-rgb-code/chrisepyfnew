import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { validateStripeKeys } from '@/lib/stripe-config';

validateStripeKeys();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail, customerName } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const lineItems = items.map((item: any) => {
      const productImage = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}${item.colorURL}`;

      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Funda Personalizada - ${item.modelName}`,
            description: item.customImage ? 'Con diseño personalizado' : 'Funda sin personalizar',
            images: [productImage],
            metadata: {
              productId: item.id,
              modelName: item.modelName,
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    let cartId: string | null = null;

    try {
      const cartItems = items.map((item: any) => ({
        id: item.id,
        modelName: item.modelName,
        modelId: item.modelId || item.id.split('-')[0],
        quantity: item.quantity,
        price: item.price,
        colorURL: item.colorURL || '',
        maskURL: item.maskURL || '',
        customImage: item.customImage || null,
        imageControls: item.imageControls || null,
      }));

      const cart = await prisma.cart.create({
        data: {
          userId: userId || null,
          userEmail,
          items: cartItems,
          status: 'pending_checkout',
        },
      });

      cartId = cart.id;
      console.log('✅ Carrito guardado en PostgreSQL:', cartId);
    } catch (error) {
      console.error('❌ Error guardando carrito:', error);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/carrito`,
      customer_email: userEmail,
      metadata: {
        userId: userId || '',
        cartId: cartId || '',
        itemCount: items.length.toString(),
        customerName: customerName || userEmail?.split('@')[0] || '',
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
