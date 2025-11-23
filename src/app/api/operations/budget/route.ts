import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const budget = await prisma.budgetPrevisionnel.create({
    data: {
      coproprieteId: copro.id,
      exerciceDebut: new Date(String(formData.get('exerciceDebut'))),
      exerciceFin: new Date(String(formData.get('exerciceFin'))),
      totalBudget: Number(formData.get('totalBudget')),
      repartitionCategories: { charges: 'générales' }
    }
  });
  return NextResponse.json(budget);
}
