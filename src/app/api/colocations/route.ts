import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { colocOnboardingSchema } from '@/lib/validation';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { ColocChargeRuleType } from '@prisma/client';

export async function POST(req: Request) {
  const session = await verifySession(cookies());
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const json = await req.json();
  const parsed = colocOnboardingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const coloc = await prisma.colocation.create({
    data: {
      nom: data.nom,
      structure: data.structure,
      nbChambres: data.nbChambres,
      loyerGlobal: data.loyerGlobal,
      chargesGlobales: data.chargesGlobales,
      repartition: data.repartition as ColocChargeRuleType,
      ownerUserId: session.userId,
      chambres: { create: data.chambres.map((c) => ({ nom: c.nom, loyerTheorique: data.loyerGlobal / data.nbChambres, statut: 'occupée', })) },
      locataires: { create: data.locataires.map((l) => ({ name: l.name, email: l.email })) }
    },
    include: { chambres: true, locataires: true }
  });
  return NextResponse.json({ ok: true, coloc });
}
