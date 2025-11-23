import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { OperationType } from '@prisma/client';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const op = await prisma.operationComptable.create({
    data: {
      coproprieteId: copro.id,
      libelle: String(formData.get('libelle')),
      montant: Number(formData.get('montant')),
      type: (formData.get('type') as OperationType) || OperationType.AUTRE,
      dateOperation: new Date(String(formData.get('dateOperation'))),
      categorie: 'Général'
    }
  });
  return NextResponse.json(op);
}
