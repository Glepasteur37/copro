import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SciFlowType } from '@prisma/client';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await verifySession(cookies());
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await req.json();
  const { sciId, type, montant, description, dateFlux } = body;
  if (!sciId || !type || typeof montant !== 'number') {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }
  const flow = await prisma.sciFlow.create({
    data: {
      sciId,
      type: type as SciFlowType,
      montant,
      description: description ?? '',
      dateFlux: dateFlux ? new Date(dateFlux) : new Date()
    }
  });
  return NextResponse.json({ ok: true, flow });
}
