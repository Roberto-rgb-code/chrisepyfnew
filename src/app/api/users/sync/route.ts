import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL } from '@/lib/constants';
import { sendNewAccountEmails } from '@/lib/send-account-email';

export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ error: 'uid and email are required' }, { status: 400 });
    }

    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    const existing = await prisma.user.findUnique({ where: { id: uid } });
    const isNewUser = !existing;

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
        accountStatus: role === 'admin' ? 'verified' : 'pending',
      },
    });

    if (isNewUser && role !== 'admin') {
      try {
        await sendNewAccountEmails({
          customerName: displayName || email.split('@')[0],
          customerEmail: email,
          userId: uid,
          registeredAt: user.createdAt.toISOString(),
        });
      } catch (emailError) {
        console.error('New account email error:', emailError);
      }
    }

    return NextResponse.json({
      role: user.role,
      isAdmin: user.role === 'admin',
      accountStatus: user.accountStatus,
    });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}
