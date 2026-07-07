import { isUserAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('isUserAdmin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns false when user not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    expect(await isUserAdmin('uid-123')).toBe(false);
  });

  it('returns true when user has admin role', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'admin',
      email: 'other@example.com',
    });
    expect(await isUserAdmin('uid-123')).toBe(true);
  });

  it('returns true when user email is admin email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'user',
      email: 'admin@empaquesyfundas.com',
    });
    expect(await isUserAdmin('uid-123')).toBe(true);
  });

  it('returns false for regular user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      role: 'user',
      email: 'cliente@example.com',
    });
    expect(await isUserAdmin('uid-123')).toBe(false);
  });
});
