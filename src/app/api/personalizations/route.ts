import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, modelId, modelName, customImageUrl, imageControls } =
      await request.json();

    if (!userId || !modelId || !modelName || !customImageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: userEmail || `${userId}@unknown.local`,
      },
    });

    const personalization = await prisma.personalization.create({
      data: {
        userId,
        userEmail,
        modelId,
        modelName,
        customImageUrl,
        imageControls: imageControls || null,
        status: 'added_to_cart',
      },
    });

    return NextResponse.json({ personalization });
  } catch (error: any) {
    console.error('Error saving personalization:', error);
    return NextResponse.json({ error: 'Failed to save personalization' }, { status: 500 });
  }
}
