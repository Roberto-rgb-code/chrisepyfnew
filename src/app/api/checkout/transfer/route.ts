import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/store-settings';
import {
  calculatePromoCodeDiscount,
  getEffectiveUnitPrice,
  normalizePromoCode,
} from '@/lib/pricing';
import { calculateCheckoutSubtotal } from '@/lib/checkout-builder';
import { isFirebaseAdminConfigured, verifyFirebaseIdToken } from '@/lib/firebase-admin';
import { ADMIN_EMAIL } from '@/lib/constants';
import {
  shippingDetailsToOrderData,
  validateShippingDetails,
  type ShippingDetails,
} from '@/lib/shipping';
import { validateTransferReceipt } from '@/lib/bank-transfer';
import { sendOrderEmail } from '@/lib/send-order-email';
import { randomBytes } from 'crypto';

async function verifyCheckoutAuth(request: NextRequest, userId: string, userEmail: string) {
  if (!userId || !isFirebaseAdminConfigured()) return null;

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

  if (decoded.email && decoded.email.toLowerCase() !== userEmail?.toLowerCase()) {
    return NextResponse.json({ error: 'El correo no coincide con tu sesión' }, { status: 400 });
  }

  return null;
}

function buildCartItems(items: any[], unitPrice: number) {
  return items.map((item: any) => ({
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
}

async function resolvePromoDiscount(promoCode: string | null, subtotal: number) {
  if (!promoCode) return { total: subtotal, promoCodeApplied: null as string | null, promoId: null as string | null };

  const normalized = normalizePromoCode(promoCode);
  const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });

  if (!promo || !promo.active) {
    throw new Error('Código promocional no válido');
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    throw new Error('Este código expiró');
  }
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
    throw new Error('Este código ya no tiene usos disponibles');
  }

  const discount = calculatePromoCodeDiscount(
    subtotal,
    promo.discountType as 'percent' | 'fixed',
    promo.discountValue
  );

  return {
    total: Math.max(0, Math.round((subtotal - discount) * 100) / 100),
    promoCodeApplied: promo.code,
    promoId: promo.id,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { items, userId, userEmail, promoCode, shippingDetails, transferReceipt } =
      await request.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }
    if (!shippingDetails) {
      return NextResponse.json({ error: 'Debes completar los datos de entrega' }, { status: 400 });
    }

    const authError = await verifyCheckoutAuth(request, userId, userEmail);
    if (authError) return authError;

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

    const receiptValidation = validateTransferReceipt(transferReceipt);
    if (!receiptValidation.valid) {
      return NextResponse.json({ error: receiptValidation.error }, { status: 400 });
    }

    const settings = await getStoreSettings();
    const unitPrice = getEffectiveUnitPrice(settings);
    const subtotal = calculateCheckoutSubtotal(items, settings);

    let promoResult;
    try {
      promoResult = await resolvePromoDiscount(promoCode, subtotal);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const shipping = shippingValidation.data as ShippingDetails;
    const shippingData = shippingDetailsToOrderData(shipping);
    const cartItems = buildCartItems(items, unitPrice);
    const orderPublicId = `TRF-${randomBytes(4).toString('hex').toUpperCase()}`;

    const cart = await prisma.cart.create({
      data: {
        userId: userId || null,
        userEmail,
        items: cartItems,
        status: 'pending_transfer',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderId: orderPublicId,
        userId: userId || null,
        customerEmail: userEmail,
        status: 'pending_payment',
        paymentStatus: 'pending_verification',
        paymentMethod: 'bank_transfer',
        amountTotal: promoResult.total,
        currency: 'mxn',
        items: cartItems,
        hasCustomDesigns: cartItems.some((item) => item.customImage),
        totalItems: cartItems.length,
        cartId: cart.id,
        transferReceipt: transferReceipt,
        ...shippingData,
      },
    });

    if (promoResult.promoId) {
      await prisma.promoCode.update({
        where: { id: promoResult.promoId },
        data: { usedCount: { increment: 1 } },
      });
    }

    try {
      await sendOrderEmail(
        'transfer_pending',
        {
          id: order.orderId,
          customerName: shippingData.customerName || userEmail.split('@')[0],
          customerEmail: userEmail,
          total: promoResult.total,
          items: cartItems,
          date: new Date().toISOString(),
        },
        userEmail
      );
    } catch (emailError) {
      console.error('Transfer pending email error:', emailError);
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amountTotal: promoResult.total,
    });
  } catch (error: any) {
    console.error('Transfer checkout error:', error);
    return NextResponse.json({ error: error.message || 'Error al registrar la transferencia' }, { status: 500 });
  }
}
