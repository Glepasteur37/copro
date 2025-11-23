import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { consultationRequestSchema } from '@/lib/validation';
import { createPaypalOrder, paypalErrorResponse } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const body = await req.json();
    const parsed = consultationRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Entrée invalide' }, { status: 400 });
    const { topic, details, amount } = parsed.data;
    const ticket = await prisma.consultationTicket.create({
      data: {
        topic,
        details,
        userId: user.id,
        amountCents: Math.round(amount * 100),
        status: 'PENDING_PAYMENT'
      }
    });
    const order = await createPaypalOrder(amount.toFixed(2));
    await prisma.consultationTicket.update({
      where: { id: ticket.id },
      data: { paypalOrderId: order.id }
    });
    return NextResponse.json({ orderId: order.id, ticketId: ticket.id });
  } catch (error) {
    return paypalErrorResponse(error);
  }
}
