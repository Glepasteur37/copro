export function computeQuotePart(total: number, tantiemes: number, tantiemesTotal: number) {
  if (tantiemesTotal === 0) return 0;
  return Math.round((total * tantiemes) / tantiemesTotal);
}

export function classifyAppelStatus(paid: number, due: number) {
  if (paid >= due) return 'PAYE';
  if (paid === 0) return 'EMIS';
  return 'PARTIELLEMENT_PAYE';
}
