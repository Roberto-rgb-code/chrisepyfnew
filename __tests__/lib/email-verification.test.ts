import { isEmailVerified } from '@/lib/email-verification';
import { ADMIN_EMAIL } from '@/lib/constants';

describe('isEmailVerified', () => {
  it('returns false for null user', () => {
    expect(isEmailVerified(null)).toBe(false);
  });

  it('returns true for admin email even if not verified', () => {
    expect(
      isEmailVerified({
        email: ADMIN_EMAIL,
        emailVerified: false,
      } as any)
    ).toBe(true);
  });

  it('returns true when emailVerified is true', () => {
    expect(
      isEmailVerified({
        email: 'user@example.com',
        emailVerified: true,
      } as any)
    ).toBe(true);
  });

  it('returns false when emailVerified is false for regular users', () => {
    expect(
      isEmailVerified({
        email: 'user@example.com',
        emailVerified: false,
      } as any)
    ).toBe(false);
  });
});
