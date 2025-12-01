import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Crear line items para Stripe
    const lineItems = items.map((item: any) => {
      // Usar la imagen base del teléfono para Stripe
      // (Las imágenes base64 son muy grandes para Stripe)
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

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/carrito`,
      customer_email: userEmail,
      metadata: {
        userId,
        userEmail: userEmail,
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          modelName: item.modelName,
          modelId: item.modelId || item.id.split('-')[0],
          quantity: item.quantity,
          price: item.price,
          colorURL: item.colorURL || '',
          maskURL: item.maskURL || '',
          customImage: item.customImage || '',
          imageControls: item.imageControls || null,
        }))),
        customImages: JSON.stringify(items.reduce((acc: any, item: any) => {
          if (item.customImage) {
            acc[item.id] = {
              imageUrl: item.customImage,
              imageControls: item.imageControls || null,
              modelName: item.modelName,
              colorURL: item.colorURL || '',
              maskURL: item.maskURL || '',
            };
          }
          return acc;
        }, {})),
      },
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

