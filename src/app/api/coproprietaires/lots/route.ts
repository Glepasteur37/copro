import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LotType } from '@prisma/client';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([]);
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const lots = await prisma.lot.findMany({ where: { coproprieteId: copro.id }, orderBy: { label: 'asc' } });
  return NextResponse.json(lots);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const lot = await prisma.lot.create({
    data: {
      coproprieteId: copro.id,
      label: String(formData.get('label')),
      tantiemes: Number(formData.get('tantiemes')),
      type: (formData.get('type') as LotType) || LotType.APPARTEMENT
    }
  });
  return NextResponse.json(lot);
}
