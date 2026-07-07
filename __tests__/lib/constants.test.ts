import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DISPLAY_NAME } from '@/lib/constants';

describe('Admin constants', () => {
  it('should have valid admin email format', () => {
    expect(ADMIN_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(ADMIN_EMAIL).toBe('admin@empaquesyfundas.com');
  });

  it('should have admin password with minimum length', () => {
    expect(ADMIN_PASSWORD.length).toBeGreaterThanOrEqual(8);
  });

  it('should have display name', () => {
    expect(ADMIN_DISPLAY_NAME).toBeTruthy();
  });
});
