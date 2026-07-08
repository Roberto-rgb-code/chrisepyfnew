import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';
import { sendOrderEmail } from '@/lib/send-order-email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, status, paymentStatus, confirmPayment } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const admin = await isUserAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updateData: { status?: string; paymentStatus?: string } = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (confirmPayment) {
      updateData.status = 'confirmed';
      updateData.paymentStatus = 'paid';
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
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

    if (confirmPayment) {
      await sendOrderEmail('order_confirmation', emailPayload, order.customerEmail);
    } else if (status === 'processing') {
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
