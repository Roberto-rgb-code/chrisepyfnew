import { prisma } from '@/lib/prisma';
import { ADMIN_EMAIL } from '@/lib/constants';

export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });

  if (!user) return false;
  return user.role === 'admin' || user.email === ADMIN_EMAIL;
}

export { ADMIN_EMAIL };
