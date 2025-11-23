import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { RappelType, RappelStatut } from '@prisma/client';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([]);
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const rappels = await prisma.tacheRappel.findMany({ where: { coproprieteId: copro.id }, orderBy: { dateEcheance: 'asc' } });
  return NextResponse.json(rappels);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const rappel = await prisma.tacheRappel.create({
    data: {
      coproprieteId: copro.id,
      description: String(formData.get('description')),
      dateEcheance: new Date(String(formData.get('dateEcheance'))),
      type: (formData.get('type') as RappelType) || RappelType.AUTRE,
      statut: RappelStatut.A_FAIRE
    }
  });
  return NextResponse.json(rappel);
}
