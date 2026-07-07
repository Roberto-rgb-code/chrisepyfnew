import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ error: 'uid and email are required' }, { status: 400 });
    }

    const role = email === ADMIN_EMAIL ? 'admin' : 'user';

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {
        email,
        displayName: displayName || undefined,
        role: email === ADMIN_EMAIL ? 'admin' : undefined,
      },
      create: {
        id: uid,
        email,
        displayName: displayName || null,
        role,
      },
    });

    return NextResponse.json({
      role: user.role,
      isAdmin: user.role === 'admin',
    });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
