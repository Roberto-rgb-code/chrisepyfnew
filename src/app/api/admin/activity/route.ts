import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isUserAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export type ActivityType = 'order' | 'cart' | 'personalization' | 'user';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  clientEmail: string;
  clientName: string | null;
  description: string;
  amount: number | null;
  status: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const admin = await isUserAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [orders, carts, personalizations, users] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.cart.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.personalization.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    ]);

    const activities: ActivityItem[] = [
      ...orders.map((order) => ({
        id: order.id,
        type: 'order' as const,
        clientEmail: order.customerEmail,
        clientName: order.customerName,
        description: `Compra completada — ${order.totalItems} producto(s)`,
        amount: order.amountTotal,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        metadata: {
          orderId: order.orderId,
          paymentStatus: order.paymentStatus,
          hasCustomDesigns: order.hasCustomDesigns,
        },
      })),
      ...carts.map((cart) => ({
        id: cart.id,
        type: 'cart' as const,
        clientEmail: cart.userEmail,
        clientName: null,
        description: `Carrito ${cart.status === 'completed' ? 'completado' : 'creado'}`,
        amount: null,
        status: cart.status,
        createdAt: cart.createdAt.toISOString(),
        metadata: {
          itemCount: Array.isArray(cart.items) ? (cart.items as unknown[]).length : 0,
        },
      })),
      ...personalizations.map((p) => ({
        id: p.id,
        type: 'personalization' as const,
        clientEmail: p.userEmail || 'sin email',
        clientName: null,
        description: `Personalizó funda — ${p.modelName}`,
        amount: null,
        status: p.status,
        createdAt: p.createdAt.toISOString(),
        metadata: {
          modelId: p.modelId,
          modelName: p.modelName,
        },
      })),
      ...users
        .filter((u) => u.role !== 'admin')
        .map((u) => ({
          id: u.id,
          type: 'user' as const,
          clientEmail: u.email,
          clientName: u.displayName,
          description: 'Nuevo cliente registrado',
          amount: null,
          status: 'registered',
          createdAt: u.createdAt.toISOString(),
          metadata: { role: u.role },
        })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const clients = await prisma.user.findMany({
      where: { role: { not: 'admin' } },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            orders: true,
            personalizations: true,
            carts: true,
          },
        },
        orders: {
          select: { amountTotal: true },
        },
      },
    });

    const clientsSummary = clients.map((client) => ({
      id: client.id,
      email: client.email,
      displayName: client.displayName,
      createdAt: client.createdAt.toISOString(),
      ordersCount: client._count.orders,
      personalizationsCount: client._count.personalizations,
      cartsCount: client._count.carts,
      totalSpent: client.orders.reduce((sum, o) => sum + o.amountTotal, 0),
    }));

    return NextResponse.json({
      activities,
      clients: clientsSummary,
      stats: {
        totalClients: clients.length,
        totalActivities: activities.length,
        totalOrders: orders.length,
        totalCarts: carts.length,
        totalPersonalizations: personalizations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
