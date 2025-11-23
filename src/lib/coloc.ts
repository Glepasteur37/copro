export type ChargeRule = 'EGALITAIRE' | 'PONDERATION_CHAMBRE';

export type Chambre = { id: string; ponderation: number };
export type AllocationInput = {
  chambres: Chambre[];
  totalCharges: number;
  rule: ChargeRule;
};

export function repartirCharges({ chambres, totalCharges, rule }: AllocationInput) {
  if (chambres.length === 0) throw new Error('Aucune chambre configurée');
  if (totalCharges < 0) throw new Error('Montant invalide');
  const base = rule === 'EGALITAIRE' ? 1 : undefined;
  const totalPonderation =
    rule === 'PONDERATION_CHAMBRE'
      ? chambres.reduce((acc, c) => acc + c.ponderation, 0)
      : chambres.length;
  return chambres.map((c) => {
    const poids = rule === 'EGALITAIRE' ? base! : c.ponderation;
    const fraction = poids / totalPonderation;
    return { chambreId: c.id, montant: Math.round(totalCharges * fraction) };
  });
}

export function generateQuittance(
  tenantName: string,
  mois: string,
  loyer: number,
  charges: number
) {
  if (!tenantName || !mois) throw new Error('Données quittance manquantes');
  if (loyer < 0 || charges < 0) throw new Error('Montant négatif non autorisé');
  return `Quittance pour ${tenantName} - ${mois}\nLoyer: ${loyer / 100}€\nCharges: ${charges / 100}€\nTotal payé: ${(loyer + charges) / 100}€`;
}
