import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import {
  calculatePromoCodeDiscount,
  generatePromoCode,
  normalizePromoCode,
} from '@/lib/pricing';
import { createStripePromoPair } from '@/lib/stripe-promo';
import { getStoreSettings } from '@/lib/store-settings';
import { calculateCheckoutSubtotal } from '@/lib/checkout-builder';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal, items } = await request.json();
    const normalized = normalizePromoCode(code || '');

    if (!normalized) {
      return NextResponse.json({ valid: false, error: 'Ingresa un código' }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({ where: { code: normalized } });
    if (!promo || !promo.active) {
      return NextResponse.json({ valid: false, error: 'Código no válido' });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'Este código expiró' });
    }

    if (promo.maxUses != null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ valid: false, error: 'Este código ya no tiene usos disponibles' });
    }

    let orderSubtotal = subtotal;
    if (orderSubtotal == null && items?.length) {
      const settings = await getStoreSettings();
      orderSubtotal = calculateCheckoutSubtotal(items, settings);
    }

    if (!orderSubtotal || orderSubtotal <= 0) {
      return NextResponse.json({ valid: false, error: 'Carrito vacío' }, { status: 400 });
    }

    const discount = calculatePromoCodeDiscount(
      orderSubtotal,
      promo.discountType as 'percent' | 'fixed',
      promo.discountValue
    );

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount: discount,
      totalAfterDiscount: Math.max(0, Math.round((orderSubtotal - discount) * 100) / 100),
    });
  } catch (error) {
    console.error('Promo validate:', error);
    return NextResponse.json({ valid: false, error: 'Error al validar código' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ code: generatePromoCode() });
}
