import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { coproSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const formData = await req.formData();
  const data = {
    nom: String(formData.get('nom')),
    adresse: String(formData.get('adresse')),
    nbLotsMax: Number(formData.get('nbLotsMax')),
    settings: formData.get('settings') ? JSON.parse(String(formData.get('settings'))) : {}
  };
  const parse = coproSchema.safeParse(data);
  if (!parse.success) return NextResponse.json({ error: 'Validation invalide' }, { status: 400 });
  const existing = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (existing) {
    await prisma.copropriete.update({ where: { id: existing.id }, data: parse.data });
    return NextResponse.json(existing);
  }
  const copro = await prisma.copropriete.create({
    data: {
      ...parse.data,
      ownerUserId: user.id
    }
  });
  return NextResponse.json(copro);
}
