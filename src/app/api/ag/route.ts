import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { AGType, AGStatut, AGMajorite, AGResultat } from '@prisma/client';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([]);
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const ags = await prisma.assembleeGenerale.findMany({ where: { coproprieteId: copro.id }, orderBy: { date: 'desc' } });
  return NextResponse.json(ags);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const ag = await prisma.assembleeGenerale.create({
    data: {
      coproprieteId: copro.id,
      date: new Date(String(formData.get('date'))),
      type: (formData.get('type') as AGType) || AGType.ORDINAIRE,
      statut: (formData.get('statut') as AGStatut) || AGStatut.PLANIFIEE,
      resolutions: {
        create: [
          {
            titre: 'Budget',
            description: 'Validation budget',
            articleMajorite: AGMajorite.ART25,
            resultat: AGResultat.EN_ATTENTE,
            pourTantiemes: 0,
            contreTantiemes: 0,
            abstentionTantiemes: 0
          }
        ]
      }
    }
  });
  return NextResponse.json(ag);
}
