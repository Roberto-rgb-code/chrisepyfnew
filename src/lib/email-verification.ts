import type { User } from 'firebase/auth';
import { ADMIN_EMAIL } from '@/lib/constants';

export function isEmailVerified(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
  return user.emailVerified;
}
