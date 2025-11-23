import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const tickets = await prisma.consultationTicket.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ tickets });
}
