import { NextResponse } from 'next/server';

const create = jest.fn();
const update = jest.fn();
const findFirst = jest.fn();
const findMany = jest.fn(async () => []);

jest.mock('@/lib/db', () => ({
  prisma: {
    consultationTicket: { create, update, findFirst, findMany }
  }
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUser: jest.fn(async () => ({ id: 'user-1' }))
}));

jest.mock('@/lib/paypal', () => ({
  createPaypalOrder: jest.fn(async () => ({ id: 'ORDER123' })),
  capturePaypalOrder: jest.fn(async () => ({ status: 'COMPLETED' })),
  paypalErrorResponse: () => NextResponse.json({ error: 'paypal' }, { status: 500 })
}));

describe('consultation payment flow', () => {
  beforeEach(() => {
    jest.resetModules();
    create.mockResolvedValue({
      id: 'ticket-1',
      userId: 'user-1',
      topic: 'Aide',
      amountCents: 12000,
      status: 'PENDING_PAYMENT',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    update.mockResolvedValue({});
    findFirst.mockResolvedValue({ id: 'ticket-1', userId: 'user-1', status: 'PENDING_PAYMENT' });
  });

  it('creates an order for a consultation ticket', async () => {
    const handler = (await import('@/app/api/payments/consultation/route')).POST;
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ topic: 'Aide comptable', amount: 120 })
    });
    const res = await handler(req as any);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.orderId).toBe('ORDER123');
    expect(create).toHaveBeenCalled();
    expect(update).toHaveBeenCalled();
  });

  it('captures and closes a consultation payment', async () => {
    const handler = (await import('@/app/api/payments/consultation/capture/route')).POST;
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'ORDER123', ticketId: 'ticket-1' })
    });
    const res = await handler(req as any);
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ where: { id: 'ticket-1' }, data: { status: 'PAID', paypalOrderId: 'ORDER123' } });
  });
});
