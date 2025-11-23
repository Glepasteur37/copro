import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sciOnboardingSchema } from '@/lib/validation';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await verifySession(cookies());
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await req.json();
  const parsed = sciOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const sci = await prisma.sci.create({
    data: {
      nom: data.nom,
      forme: data.forme,
      siege: data.siege,
      frequenceAG: data.frequenceAG,
      ownerUserId: session.userId,
      associates: { create: data.associes.map((a) => ({ name: a.name, email: a.email, parts: a.parts })) },
      assets: { create: data.biens.map((b) => ({ adresse: b.adresse, type: b.type, quotePart: b.quotePart })) }
    },
    include: { associates: true, assets: true }
  });
  return NextResponse.json({ ok: true, sci });
}
