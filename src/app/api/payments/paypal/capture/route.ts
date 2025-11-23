import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

async function capture(orderId: string) {
  const auth = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  }).then((r) => r.json());
  const result = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`
    }
  }).then((r) => r.json());
  return result;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const body = await req.json();
  const { orderId, plan } = body;
  const result = await capture(orderId);
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
}
