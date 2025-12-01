import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/email-templates';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

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

    // Intentar recuperar información completa del carrito desde Firestore usando cartId
    let completeItems: any[] = [];
    let cartData: any = null;

    if (metadata?.cartId && db) {
      try {
        const cartDocRef = doc(db, 'carts', metadata.cartId);
        const cartDoc = await getDoc(cartDocRef);
        
        if (cartDoc.exists()) {
          cartData = cartDoc.data();
          completeItems = cartData.items || [];
          console.log('✅ Carrito recuperado desde Firestore:', metadata.cartId);
          console.log('📦 Items encontrados:', completeItems.length);
        } else {
          console.warn('⚠️ Carrito no encontrado en Firestore:', metadata.cartId);
        }
      } catch (error) {
        console.error('❌ Error recuperando carrito desde Firestore:', error);
      }
    }

    // Si no se pudo recuperar desde Firestore, intentar parsear desde metadata (fallback)
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
        console.log('⚠️ Usando datos de metadata como fallback');
      } catch (error) {
        console.error('❌ Error parseando items desde metadata:', error);
      }
    }

    if (completeItems.length === 0) {
      console.error('❌ No se pudieron obtener items para la orden');
      return;
    }

    // Crear datos del pedido
    const orderData = {
      id: session.id,
      customerName: customer_email.split('@')[0], // Usar parte del email como nombre
      customerEmail: customer_email,
      total: (session.amount_total || 0) / 100, // Convertir de centavos
      items: completeItems,
      status: 'confirmed',
      date: new Date().toISOString(),
    };

    // Guardar orden en Firestore con TODA la información
    if (db) {
      try {
        await addDoc(collection(db, 'orders'), {
          orderId: session.id,
          userId: metadata?.userId || 'guest',
          customerEmail: customer_email,
          customerName: customer_email.split('@')[0],
          status: 'confirmed',
          paymentStatus: session.payment_status,
          amountTotal: (session.amount_total || 0) / 100,
          currency: session.currency || 'mxn',
          // Items completos con toda la información (incluyendo customImage e imageControls)
          items: completeItems,
          // Información adicional para el jefe
          hasCustomDesigns: completeItems.some((item: any) => item.customImage),
          totalItems: completeItems.length,
          // Referencia al carrito original
          cartId: metadata?.cartId || null,
          // Timestamps
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          orderDate: new Date().toISOString(),
        });
        console.log('✅ Orden guardada en Firestore con toda la información:', session.id);
        console.log('📦 Items guardados:', completeItems.length);
        console.log('🖼️ Diseños personalizados:', completeItems.filter((item: any) => item.customImage).length);
      } catch (firestoreError) {
        console.error('❌ Error guardando en Firestore:', firestoreError);
      }
    }

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
