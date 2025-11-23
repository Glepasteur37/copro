import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { DocumentType } from '@prisma/client';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([]);
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const docs = await prisma.document.findMany({ where: { coproprieteId: copro.id }, orderBy: { dateUpload: 'desc' } });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json({ error: 'Copropriété manquante' }, { status: 400 });
  const formData = await req.formData();
  const doc = await prisma.document.create({
    data: {
      coproprieteId: copro.id,
      titre: String(formData.get('titre')),
      type: (formData.get('type') as DocumentType) || DocumentType.AUTRE,
      url: String(formData.get('url')),
      dateUpload: new Date()
    }
  });
  return NextResponse.json(doc);
}
