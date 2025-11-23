import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signSession, setSessionCookie, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  const token = signSession({ userId: user.id, role: user.role });
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
