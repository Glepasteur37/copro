import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';
import { signupSchema } from '@/lib/validation';
import { Role, SubscriptionStatus } from '@prisma/client';

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());
  const parse = signupSchema.safeParse({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  });
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten().formErrors.join(', ') }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email: parse.data.email } });
  if (existing) return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
  const passwordHash = await hashPassword(parse.data.password);
  const user = await prisma.user.create({
    data: {
      email: parse.data.email,
      passwordHash,
      firstName: parse.data.firstName,
      lastName: parse.data.lastName,
      role: Role.SINDIC_ADMIN,
      subscriptions: {
        create: {
          plan: 'SMALL_COPRO',
          status: SubscriptionStatus.TRIALING
        }
      }
    }
  });
  const token = signSession({ userId: user.id, role: user.role });
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
