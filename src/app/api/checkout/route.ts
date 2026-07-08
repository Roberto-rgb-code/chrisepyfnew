import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { validateStripeKeys } from '@/lib/stripe-config';
import { getStoreSettings } from '@/lib/store-settings';
import { getEffectiveUnitPrice, normalizePromoCode } from '@/lib/pricing';
import { buildStripeLineItems, calculateCheckoutSubtotal } from '@/lib/checkout-builder';
import { isFirebaseAdminConfigured, verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { ADMIN_EMAIL } from '@/lib/constants';
import {
  shippingDetailsToMetadata,
  shippingDetailsToOrderData,
  validateShippingDetails,
} from '@/lib/shipping';

validateStripeKeys();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail, promoCode, shippingDetails } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!shippingDetails) {
      return NextResponse.json({ error: 'Debes completar los datos de entrega' }, { status: 400 });
    }

    const shippingValidation = validateShippingDetails({
      ...shippingDetails,
      email: userEmail,
    });

    if (!shippingValidation.valid || !shippingValidation.data) {
      return NextResponse.json(
        { error: 'Datos de entrega inválidos', details: shippingValidation.errors },
        { status: 400 }
      );
    }

    const shipping = shippingValidation.data;
    const shippingOrderData = shippingDetailsToOrderData(shipping);

    if (userId && isFirebaseAdminConfigured()) {
      const idToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (!idToken) {
        return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 });
      }

      const decoded = await verifyFirebaseIdToken(idToken);
      if (!decoded || decoded.uid !== userId) {
        return NextResponse.json({ error: 'Sesión no válida' }, { status: 401 });
      }

      const email = decoded.email?.toLowerCase();
      if (email !== ADMIN_EMAIL.toLowerCase() && !decoded.email_verified) {
        return NextResponse.json(
          { error: 'Debes verificar tu correo electrónico antes de pagar' },
          { status: 403 }
        );
      }
    }

    const settings = await getStoreSettings();
    const unitPrice = getEffectiveUnitPrice(settings);
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const lineItems = buildStripeLineItems(items, settings, baseUrl);

    let cartId: string | null = null;
    let appliedPromoId: string | null = null;
    let stripePromotionCodeId: string | null = null;

    try {
      const cartItems = items.map((item: any) => ({
        id: item.id,
        modelName: item.modelName,
        modelId: item.modelId || item.id.split('-')[0],
        quantity: item.quantity,
        price: unitPrice,
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
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }

    if (promoCode) {
      const normalized = normalizePromoCode(promoCode);
      const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });

      if (!promo || !promo.active) {
        return NextResponse.json({ error: 'Código promocional no válido' }, { status: 400 });
      }

      if (promo.expiresAt && promo.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Este código expiró' }, { status: 400 });
      }

      if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
        return NextResponse.json({ error: 'Este código ya no tiene usos disponibles' }, { status: 400 });
      }

      if (!promo.stripePromotionCodeId) {
        return NextResponse.json(
          { error: 'Código no sincronizado con Stripe. Contacta al administrador.' },
          { status: 400 }
        );
      }

      appliedPromoId = promo.id;
      stripePromotionCodeId = promo.stripePromotionCodeId;
    }

    const subtotal = calculateCheckoutSubtotal(items, settings);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      customer_email: userEmail,
      metadata: {
        userId: userId || '',
        cartId: cartId || '',
        itemCount: items.length.toString(),
        customerName: shippingOrderData.customerName,
        promoCodeId: appliedPromoId || '',
        unitPriceMxn: unitPrice.toString(),
        subtotalMxn: subtotal.toString(),
        ...shippingDetailsToMetadata(shipping),
      },
    };

    if (stripePromotionCodeId) {
      sessionParams.discounts = [{ promotion_code: stripePromotionCodeId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (appliedPromoId) {
      await prisma.promoCode.update({
        where: { id: appliedPromoId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      unitPriceMxn: unitPrice,
      subtotalMxn: subtotal,
    });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
