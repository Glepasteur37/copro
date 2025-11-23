import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { capturePaypalOrder, paypalErrorResponse } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const body = await req.json();
    const { orderId, plan } = body;
    const result = await capturePaypalOrder(orderId);
    await prisma.subscription.updateMany({
      where: { userId: user.id },
      data: {
        plan,
        status: 'ACTIVE',
        paypalSubscriptionId: orderId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
      }
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return paypalErrorResponse(error);
  }
}
