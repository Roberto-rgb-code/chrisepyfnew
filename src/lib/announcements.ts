import { prisma } from '@/lib/prisma';

export interface AnnouncementMessage {
  id: string;
  desktop: string;
  mobile: string;
  sortOrder: number;
  active: boolean;
}

export const DEFAULT_ANNOUNCEMENTS = [
  {
    desktop: '🎉 ¡ENVÍO GRATIS en pedidos +$500 MXN! | 📱 +1000 fundas vendidas | ⭐ 4.9/5 estrellas',
    mobile: '🎉 Envío GRATIS +$500 · ⭐ 4.9/5',
  },
  {
    desktop: '🔥 ¡DESCUENTO 20% en tu primera compra! | 🎨 Diseña tu funda personalizada HOY',
    mobile: '🔥 20% primera compra · Diseña HOY',
  },
];

export async function ensureDefaultAnnouncements(): Promise<void> {
  const count = await prisma.announcement.count();
  if (count > 0) return;

  await prisma.announcement.createMany({
    data: DEFAULT_ANNOUNCEMENTS.map((item, index) => ({
      desktop: item.desktop,
      mobile: item.mobile,
      sortOrder: index,
      active: true,
    })),
  });
}

export async function getActiveAnnouncements(): Promise<AnnouncementMessage[]> {
  await ensureDefaultAnnouncements();

  const rows = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });

  return rows.map((row) => ({
    id: row.id,
    desktop: row.desktop,
    mobile: row.mobile,
    sortOrder: row.sortOrder,
    active: row.active,
  }));
}

export async function getAllAnnouncements(): Promise<AnnouncementMessage[]> {
  await ensureDefaultAnnouncements();

  const rows = await prisma.announcement.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return rows.map((row) => ({
    id: row.id,
    desktop: row.desktop,
    mobile: row.mobile,
    sortOrder: row.sortOrder,
    active: row.active,
  }));
}
