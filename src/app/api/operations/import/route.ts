import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const csv = await req.text();
  const lines = csv
    .trim()
    .split(/\n/)
    .map((line) => line.split(';'))
    .filter((l) => l.length >= 3)
    .map(([date, libelle, montant]) => ({ date, libelle, montant: Math.round(parseFloat(montant) * 100) }));
  return NextResponse.json(lines);
}
