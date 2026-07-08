import { NextRequest } from 'next/server';
import { POST } from '@/app/api/checkout/transfer/route';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/store-settings';
import { sendOrderEmail } from '@/lib/send-order-email';
import { verifyFirebaseIdToken } from '@/lib/firebase-admin';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    cart: { create: jest.fn() },
    order: { create: jest.fn() },
    promoCode: { findUnique: jest.fn(), update: jest.fn() },
  },
}));

jest.mock('@/lib/store-settings', () => ({
  getStoreSettings: jest.fn(),
}));

jest.mock('@/lib/send-order-email', () => ({
  sendOrderEmail: jest.fn(),
}));

jest.mock('@/lib/firebase-admin', () => ({
  isFirebaseAdminConfigured: jest.fn(() => true),
  verifyFirebaseIdToken: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedGetStoreSettings = getStoreSettings as jest.MockedFunction<typeof getStoreSettings>;
const mockedSendOrderEmail = sendOrderEmail as jest.MockedFunction<typeof sendOrderEmail>;
const mockedVerifyFirebaseIdToken = verifyFirebaseIdToken as jest.MockedFunction<
  typeof verifyFirebaseIdToken
>;

const shippingDetails = {
  firstName: 'Juan',
  lastName: 'Pérez',
  whatsApp: '3311493852',
  email: 'juan@example.com',
  street: 'Av. Revolución 123',
  neighborhood: 'Centro',
  postalCode: '44100',
  city: 'Guadalajara',
  state: 'Jalisco',
  recipientName: 'María Pérez',
  hasValidIne: true,
};

const cartItem = {
  id: 'ip15-123',
  modelName: 'iPhone 15',
  modelId: 'ip15',
  quantity: 1,
  price: 599,
  colorURL: '/downloaded_images/ip15_c002_color.png',
  maskURL: '/downloaded_images/ip15_c002_mask.png',
  customImage: null,
};

const tinyPngReceipt =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function buildRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new NextRequest('http://localhost/api/checkout/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/checkout/transfer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetStoreSettings.mockResolvedValue({
      basePriceMxn: 599,
      promoActive: false,
      promoTitle: null,
      promoDiscountType: 'percent',
      promoDiscountValue: 0,
    });
    mockedVerifyFirebaseIdToken.mockResolvedValue({
      uid: 'user-123',
      email: 'juan@example.com',
      email_verified: true,
    });
    mockedPrisma.cart.create.mockResolvedValue({ id: 'cart-1' } as never);
    mockedPrisma.order.create.mockResolvedValue({
      orderId: 'TRF-AB12CD34',
      id: 'order-1',
    } as never);
    mockedSendOrderEmail.mockResolvedValue({ id: 'email-1' } as never);
  });

  it('returns 400 when items are missing', async () => {
    const response = await POST(
      buildRequest({
        userId: 'user-123',
        userEmail: 'juan@example.com',
        shippingDetails,
        transferReceipt: tinyPngReceipt,
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: 'No items provided' });
  });

  it('returns 401 when auth token is missing', async () => {
    const response = await POST(
      new NextRequest('http://localhost/api/checkout/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [cartItem],
          userId: 'user-123',
          userEmail: 'juan@example.com',
          shippingDetails,
          transferReceipt: tinyPngReceipt,
        }),
      })
    );

    expect(response.status).toBe(401);
  });

  it('creates order and sends transfer email on success', async () => {
    const response = await POST(
      buildRequest({
        items: [cartItem],
        userId: 'user-123',
        userEmail: 'juan@example.com',
        shippingDetails,
        transferReceipt: tinyPngReceipt,
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      orderId: 'TRF-AB12CD34',
      amountTotal: 599,
    });

    expect(mockedPrisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentMethod: 'bank_transfer',
          status: 'pending_payment',
          paymentStatus: 'pending_verification',
        }),
      })
    );

    expect(mockedSendOrderEmail).toHaveBeenCalledWith(
      'transfer_pending',
      expect.objectContaining({
        id: 'TRF-AB12CD34',
        customerEmail: 'juan@example.com',
      }),
      'juan@example.com'
    );
  });

  it('returns 502 when email sending fails', async () => {
    mockedSendOrderEmail.mockRejectedValue(new Error('Resend down'));

    const response = await POST(
      buildRequest({
        items: [cartItem],
        userId: 'user-123',
        userEmail: 'juan@example.com',
        shippingDetails,
        transferReceipt: tinyPngReceipt,
      })
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      orderId: 'TRF-AB12CD34',
    });
  });
});
