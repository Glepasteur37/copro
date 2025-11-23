import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = String(formData.get('token'));
  const invitation = await prisma.invitationCoproprietaire.findUnique({ where: { token } });
  if (!invitation || invitation.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invitation expirée' }, { status: 400 });
  }
  const password = String(formData.get('password'));
  const firstName = String(formData.get('firstName'));
  const lastName = String(formData.get('lastName'));
  const coproprietaire = await prisma.coproprietaire.findFirst({
    where: { email: invitation.email, coproprieteId: invitation.coproprieteId }
  });
  const user = await prisma.user.create({
    data: {
      email: invitation.email,
      passwordHash: await hashPassword(password),
      firstName,
      lastName,
      role: Role.COPROPRIETAIRE
    }
  });
  if (coproprietaire) {
    await prisma.coproprietaire.update({ where: { id: coproprietaire.id }, data: { userId: user.id } });
  }
  await prisma.invitationCoproprietaire.update({ where: { id: invitation.id }, data: { status: 'ACCEPTEE' } });
  return NextResponse.json({ ok: true });
}
