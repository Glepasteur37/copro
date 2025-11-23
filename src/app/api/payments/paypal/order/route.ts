import { NextResponse } from 'next/server';
import { paypalOrderSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';
import { createPaypalOrder, paypalErrorResponse } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    const body = await req.json();
    const parse = paypalOrderSchema.safeParse({ plan: body.plan, userId: user.id });
    if (!parse.success) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    const price = parse.data.plan === 'SMALL_COPRO' ? '39.00' : '59.00';
    const order = await createPaypalOrder(price);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    return paypalErrorResponse(error);
  }
}
