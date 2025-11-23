import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { TravauxStatut } from '@prisma/client';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([]);
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const travaux = await prisma.travaux.findMany({ where: { coproprieteId: copro.id }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(travaux);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const travaux = await prisma.travaux.create({
    data: {
      coproprieteId: copro.id,
      nom: String(formData.get('nom')),
      description: 'Projet',
      budgetEstime: Number(formData.get('budgetEstime')),
      fournisseur: String(formData.get('fournisseur')),
      statut: (formData.get('statut') as TravauxStatut) || TravauxStatut.A_ETUDIER
    }
  });
  return NextResponse.json(travaux);
}
