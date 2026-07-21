import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { sendAccountVerifiedEmail } from '@/lib/send-account-email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, verifyAccount } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const admin = await isUserAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!verifyAccount) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { accountStatus: 'verified' },
    });

    try {
      await sendAccountVerifiedEmail({
        customerName: user.displayName || user.email.split('@')[0],
        customerEmail: user.email,
      });
    } catch (emailError) {
      console.error('Account verified email error:', emailError);
      return NextResponse.json(
        { user, warning: 'Cuenta verificada, pero no se pudo enviar el correo al cliente.' },
        { status: 200 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error verifying user account:', error);
    return NextResponse.json({ error: 'Failed to verify account' }, { status: 500 });
  }
}
