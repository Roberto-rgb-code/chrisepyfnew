import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { setStripePromotionActive } from '@/lib/stripe-promo';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, active } = body;

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const promo = await prisma.promoCode.findUnique({ where: { id: params.id } });
    if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (promo.stripePromotionCodeId && active != null) {
      try {
        await setStripePromotionActive(promo.stripePromotionCodeId, active);
      } catch (e) {
        console.error('Stripe promo update error:', e);
      }
    }

    const updated = await prisma.promoCode.update({
      where: { id: params.id },
      data: { ...(active != null ? { active } : {}) },
    });

    return NextResponse.json({ promoCode: updated });
  } catch (error) {
    console.error('Admin promo PATCH:', error);
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const promo = await prisma.promoCode.findUnique({ where: { id: params.id } });
    if (!promo) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (promo.stripePromotionCodeId) {
      try {
        await setStripePromotionActive(promo.stripePromotionCodeId, false);
      } catch (e) {
        console.error('Stripe promo deactivate error:', e);
      }
    }

    await prisma.promoCode.update({
      where: { id: params.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin promo DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}
