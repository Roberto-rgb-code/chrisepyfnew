import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { getAllAnnouncements } from '@/lib/announcements';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const messages = await getAllAnnouncements();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Admin announcements GET:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, messages } = body;

    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    if (!(await isUserAdmin(userId))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Debe haber al menos un mensaje' }, { status: 400 });
    }

    for (const msg of messages) {
      if (!msg.desktop?.trim() || !msg.mobile?.trim()) {
        return NextResponse.json(
          { error: 'Cada mensaje necesita texto para escritorio y móvil' },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction([
      prisma.announcement.deleteMany(),
      prisma.announcement.createMany({
        data: messages.map(
          (msg: { desktop: string; mobile: string; active?: boolean }, index: number) => ({
            desktop: msg.desktop.trim(),
            mobile: msg.mobile.trim(),
            sortOrder: index,
            active: msg.active !== false,
          })
        ),
      }),
    ]);

    const updated = await getAllAnnouncements();
    return NextResponse.json({ messages: updated });
  } catch (error) {
    console.error('Admin announcements PUT:', error);
    return NextResponse.json({ error: 'Failed to save announcements' }, { status: 500 });
  }
}
