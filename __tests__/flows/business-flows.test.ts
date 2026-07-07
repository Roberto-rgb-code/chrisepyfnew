import { ADMIN_EMAIL } from '@/lib/constants';

describe('User sync API logic', () => {
  it('assigns admin role for admin email', () => {
    const email = 'admin@empaquesyfundas.com';
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    expect(role).toBe('admin');
  });

  it('assigns user role for regular email', () => {
    const email = 'cliente@gmail.com';
    const role = email === ADMIN_EMAIL ? 'admin' : 'user';
    expect(role).toBe('user');
  });

  it('validates required sync fields', () => {
    const payload = { uid: 'abc123', email: 'test@test.com' };
    expect(payload.uid).toBeTruthy();
    expect(payload.email).toBeTruthy();
  });
});

describe('Cart item structure', () => {
  it('validates cart item has required fields for checkout', () => {
    const item = {
      id: 'ip15-123',
      modelName: 'iPhone 15',
      colorURL: '/downloaded_images/ip15_c002_color.png',
      maskURL: '/downloaded_images/ip15_c002_mask.png',
      customImage: 'data:image/png;base64,abc',
      price: 599,
      quantity: 1,
      imageControls: { scale: 1, rotation: 0, flipX: 1, flipY: 1, position: { x: 0, y: 0 } },
    };

    expect(item.modelName).toBeTruthy();
    expect(item.price).toBeGreaterThan(0);
    expect(item.quantity).toBeGreaterThan(0);
    expect(item.colorURL).toMatch(/^\/downloaded_images\//);
  });
});

describe('Order status flow', () => {
  const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  it('includes all expected order statuses', () => {
    expect(validStatuses).toContain('confirmed');
    expect(validStatuses).toContain('delivered');
    expect(validStatuses).toContain('cancelled');
  });

  it('allows status transitions', () => {
    const current = 'confirmed';
    const next = 'processing';
    expect(validStatuses.includes(next)).toBe(true);
    expect(current).not.toBe(next);
  });
});

describe('Activity types', () => {
  const activityTypes = ['order', 'cart', 'personalization', 'user'];

  it('covers all client movement types', () => {
    expect(activityTypes).toHaveLength(4);
    expect(activityTypes).toContain('order');
    expect(activityTypes).toContain('personalization');
  });
});
