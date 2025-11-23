import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { randomBytes } from 'crypto';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 200 });
  const invitations = await prisma.invitationCoproprietaire.findMany({
    where: { copropriete: { ownerUserId: user.id } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(invitations);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const email = String(formData.get('email'));
  const firstName = String(formData.get('firstName'));
  const lastName = String(formData.get('lastName'));
  const token = randomBytes(20).toString('hex');
  const invitation = await prisma.invitationCoproprietaire.create({
    data: {
      coproprieteId: copro.id,
      email,
      token,
      status: 'ENVOYEE',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
  });
  await prisma.coproprietaire.create({
    data: {
      coproprieteId: copro.id,
      email,
      firstName,
      lastName,
      telephone: '',
      estOccupant: true
    }
  });
  return NextResponse.json(invitation);
}
