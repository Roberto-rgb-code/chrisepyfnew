import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { generatePromoCode, normalizePromoCode } from '@/lib/pricing';
import { createStripePromoPair, setStripePromotionActive } from '@/lib/stripe-promo';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const promoCodes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ promoCodes });
  } catch (error) {
    console.error('Admin promo codes GET:', error);
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code, discountType, discountValue, expiresAt, maxUses, autoGenerate } = body;

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    if (!['percent', 'fixed'].includes(discountType)) {
      return NextResponse.json({ error: 'Tipo de descuento inválido' }, { status: 400 });
    }

    if (!discountValue || discountValue <= 0) {
      return NextResponse.json({ error: 'Valor de descuento inválido' }, { status: 400 });
    }

    if (discountType === 'percent' && discountValue > 100) {
      return NextResponse.json({ error: 'El porcentaje no puede ser mayor a 100' }, { status: 400 });
    }

    const finalCode = normalizePromoCode(autoGenerate ? generatePromoCode() : code);
    if (!finalCode || finalCode.length < 4) {
      return NextResponse.json({ error: 'Código demasiado corto' }, { status: 400 });
    }

    const existing = await prisma.promoCode.findUnique({ where: { code: finalCode } });
    if (existing) {
      return NextResponse.json({ error: 'Ese código ya existe' }, { status: 409 });
    }

    let stripeCouponId: string | null = null;
    let stripePromotionCodeId: string | null = null;

    try {
      const stripePair = await createStripePromoPair(finalCode, discountType, discountValue);
      if (stripePair) {
        stripeCouponId = stripePair.couponId;
        stripePromotionCodeId = stripePair.promotionCodeId;
      }
    } catch (stripeError) {
      console.error('Stripe promo create error:', stripeError);
      return NextResponse.json(
        { error: 'No se pudo crear el código en Stripe. Verifica tus claves.' },
        { status: 502 }
      );
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: finalCode,
        discountType,
        discountValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses ?? null,
        stripeCouponId,
        stripePromotionCodeId,
      },
    });

    return NextResponse.json({ promoCode });
  } catch (error) {
    console.error('Admin promo codes POST:', error);
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}
