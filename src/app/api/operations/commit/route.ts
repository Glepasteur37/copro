import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const body = await req.json();
  const lines: { date: string; libelle: string; montant: number }[] = body.lines || [];
  await prisma.$transaction(
    lines.map((line) =>
      prisma.operationComptable.create({
        data: {
          coproprieteId: copro.id,
          libelle: line.libelle,
          montant: line.montant,
          type: 'AUTRE',
          dateOperation: new Date(line.date),
          categorie: 'Import bancaire'
        }
      })
    )
  );
  return NextResponse.json({ ok: true });
}
