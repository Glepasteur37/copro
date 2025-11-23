import { NextResponse } from 'next/server';
import { paypalOrderSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';

async function createPaypalOrder(amount: string) {
  const auth = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
    },
    body: 'grant_type=client_credentials'
  }).then((r) => r.json());

  const order = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.access_token}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: amount
          }
        }
      ]
    })
  }).then((r) => r.json());
  return order;
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const body = await req.json();
  const parse = paypalOrderSchema.safeParse({ plan: body.plan, userId: user.id });
  if (!parse.success) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
  const price = parse.data.plan === 'SMALL_COPRO' ? '39.00' : '59.00';
  const order = await createPaypalOrder(price);
  return NextResponse.json({ id: order.id });
}
