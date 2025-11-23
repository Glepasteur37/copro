import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json([], { status: 200 });
  const copro = await prisma.copropriete.findFirst({ where: { ownerUserId: user.id } });
  if (!copro) return NextResponse.json([]);
  const ops = await prisma.operationComptable.findMany({ where: { coproprieteId: copro.id }, orderBy: { dateOperation: 'desc' } });
  return NextResponse.json(ops);
}
