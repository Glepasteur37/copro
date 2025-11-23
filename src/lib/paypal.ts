import { NextResponse } from 'next/server';

async function getAccessToken() {
  const creds = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`;
  const auth = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(creds).toString('base64')
    },
    body: 'grant_type=client_credentials'
  }).then((r) => r.json());
  if (!auth.access_token) {
    throw new Error('PayPal auth failed');
  }
  return auth.access_token as string;
}

export async function createPaypalOrder(amount: string) {
  const token = await getAccessToken();
  const order = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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
  if (!order.id) {
    throw new Error('PayPal order creation failed');
  }
  return order as { id: string };
}

export async function capturePaypalOrder(orderId: string) {
  const token = await getAccessToken();
  const result = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }).then((r) => r.json());
  if (!result) throw new Error('PayPal capture failed');
  return result;
}

export function paypalErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'PayPal error';
  return NextResponse.json({ error: message }, { status: 500 });
}
