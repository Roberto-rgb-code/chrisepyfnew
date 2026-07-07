import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { sendOrderEmail } from '@/lib/send-order-email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status are required' }, { status: 400 });
    }

    const admin = await isUserAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    const items = (order.items as any[]) || [];
    const emailPayload = {
      id: order.orderId,
      customerName: order.customerName || order.customerEmail.split('@')[0],
      customerEmail: order.customerEmail,
      total: order.amountTotal,
      items,
      date: order.orderDate.toISOString(),
    };

    if (status === 'processing') {
      await sendOrderEmail('order_processing', emailPayload, order.customerEmail);
    } else if (status === 'shipped') {
      await sendOrderEmail('order_shipped', emailPayload, order.customerEmail);
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
