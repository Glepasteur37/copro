import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { consultationCaptureSchema } from '@/lib/validation';
import { capturePaypalOrder, paypalErrorResponse } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const body = await req.json();
    const parsed = consultationCaptureSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Entrée invalide' }, { status: 400 });
    const { orderId, ticketId } = parsed.data;
    const ticket = await prisma.consultationTicket.findFirst({ where: { id: ticketId, userId: user.id } });
    if (!ticket) return NextResponse.json({ error: 'Ticket introuvable' }, { status: 404 });
    const result = await capturePaypalOrder(orderId);
    await prisma.consultationTicket.update({
      where: { id: ticketId },
      data: { status: 'PAID', paypalOrderId: orderId }
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return paypalErrorResponse(error);
  }
}
