import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { getStoreSettings } from '@/lib/store-settings';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const settings = await getStoreSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin pricing GET:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, basePriceMxn, promoActive, promoTitle, promoDiscountType, promoDiscountValue } = body;

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    if (basePriceMxn != null && (basePriceMxn < 1 || basePriceMxn > 99999)) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    if (promoDiscountType && !['percent', 'fixed'].includes(promoDiscountType)) {
      return NextResponse.json({ error: 'Tipo de descuento inválido' }, { status: 400 });
    }

    const settings = await prisma.storeSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        basePriceMxn: basePriceMxn ?? 599,
        promoActive: promoActive ?? false,
        promoTitle: promoTitle ?? null,
        promoDiscountType: promoDiscountType ?? null,
        promoDiscountValue: promoDiscountValue ?? null,
      },
      update: {
        ...(basePriceMxn != null ? { basePriceMxn } : {}),
        ...(promoActive != null ? { promoActive } : {}),
        ...(promoTitle !== undefined ? { promoTitle: promoTitle || null } : {}),
        ...(promoDiscountType !== undefined ? { promoDiscountType: promoDiscountType || null } : {}),
        ...(promoDiscountValue !== undefined ? { promoDiscountValue: promoDiscountValue ?? null } : {}),
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Admin pricing PATCH:', error);
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 });
  }
}
