export type TantiemeResult = { lot: string; tantieme: number; pourcentage: number };

export function computeTantiemes(surfaces: number[]): TantiemeResult[] {
  const validSurfaces = surfaces.filter((s) => s > 0);
  const total = validSurfaces.reduce((acc, v) => acc + v, 0);
  if (total === 0) return [];
  return validSurfaces.map((surface, index) => {
    const fraction = surface / total;
    return {
      lot: `Lot ${index + 1}`,
      tantieme: Math.round(fraction * 1000),
      pourcentage: Math.round(fraction * 10000) / 100
    };
  });
}

export function generateBudgetPrevisionnel(categories: { nom: string; montant: number }[]) {
  const lignes = categories.filter((c) => c.montant > 0);
  const total = lignes.reduce((acc, v) => acc + v.montant, 0);
  return { total, lignes };
}

export function buildAppelDeFonds(lots: { nom: string; tantieme: number }[], montantTotal: number) {
  const totalTantiemes = lots.reduce((acc, l) => acc + l.tantieme, 0) || 1;
  return lots.map((lot) => ({
    lot: lot.nom,
    montant: Math.round((lot.tantieme / totalTantiemes) * montantTotal)
  }));
}

export function buildAgChecklist(inputs: {
  convocationEnvoyee: boolean;
  quorumAtteint: boolean;
  feuillePresenceSignee: boolean;
  pvRedige: boolean;
}) {
  const items = [
    { label: 'Convocation envoyée dans les délais', ok: inputs.convocationEnvoyee },
    { label: 'Quorum atteint', ok: inputs.quorumAtteint },
    { label: 'Feuille de présence signée', ok: inputs.feuillePresenceSignee },
    { label: 'Procès-verbal rédigé et partagé', ok: inputs.pvRedige }
  ];
  const score = items.filter((i) => i.ok).length / items.length;
  return { items, score };
}

export function sciFlowDistribution(
  associes: { name: string; parts: number }[],
  revenus: number,
  charges: number
) {
  const totalParts = associes.reduce((acc, a) => acc + a.parts, 0) || 1;
  return associes.map((associe) => {
    const ratio = associe.parts / totalParts;
    const revenusAssocie = Math.round(revenus * ratio);
    const chargesAssocie = Math.round(charges * ratio);
    return {
      name: associe.name,
      revenus: revenusAssocie,
      charges: chargesAssocie,
      net: revenusAssocie - chargesAssocie
    };
  });
}

export function sciCompteCourant(initial: number, mouvements: { type: 'APPORT' | 'RETRAIT'; montant: number }[]) {
  const solde = mouvements.reduce((acc, m) => acc + (m.type === 'APPORT' ? m.montant : -m.montant), initial);
  return { solde };
}

export function sciCalendarObligations(baseYear: number) {
  const ref = baseYear || new Date().getFullYear();
  return [
    { titre: 'Assemblée générale annuelle', date: `${ref}-06-30` },
    { titre: 'Déclaration fiscale (SCIMF)', date: `${ref}-05-30` },
    { titre: 'Mise à jour registre des décisions', date: `${ref}-12-15` }
  ];
}

export function colocationCharges(
  charges: number,
  repartition: 'EGALITAIRE' | 'PONDERATION_CHAMBRE',
  chambres: { nom: string; ponderation: number }[]
) {
  if (chambres.length === 0) return [];
  if (repartition === 'EGALITAIRE') {
    const part = Math.round(charges / chambres.length);
    return chambres.map((chambre) => ({ chambre: chambre.nom, montant: part }));
  }
  const totalPondere = chambres.reduce((acc, c) => acc + c.ponderation, 0) || 1;
  return chambres.map((chambre) => ({
    chambre: chambre.nom,
    montant: Math.round((chambre.ponderation / totalPondere) * charges)
  }));
}

export function generateQuittance(loyer: number, charges: number, locataire: string, mois: string) {
  const total = loyer + charges;
  return { locataire, mois, loyer, charges, total };
}

export function etatDesLieuxSynthese(pieces: { nom: string; etat: string }[]) {
  const synthese = pieces.map((piece) => `${piece.nom}: ${piece.etat}`);
  const alertes = pieces.filter((p) => p.etat.toLowerCase().includes('dégrad'));
  return { synthese, alertes };
}

export function reglementInterieur(rules: string[]) {
  const utiles = rules.filter((r) => r.trim().length > 0);
  return { sections: utiles, total: utiles.length };
}

export function tauxOccupation(chambres: { statut: 'LIBRE' | 'OCCUPEE' | 'RESERVEE' }[]) {
  const total = chambres.length || 1;
  const occupees = chambres.filter((c) => c.statut !== 'LIBRE').length;
  const taux = Math.round((occupees / total) * 10000) / 100;
  return { taux, libres: total - occupees };
}

export function estimationChargesAnnuelles(chargesMensuelles: number[], nbColocataires: number) {
  const annuel = chargesMensuelles.reduce((acc, c) => acc + c, 0) * 12;
  const parColoc = nbColocataires > 0 ? Math.round(annuel / nbColocataires) : 0;
  return { annuel, parColoc }; 
}

export function obligationsGenerales(type: 'COPRO' | 'SCI' | 'COLOC', annee: number) {
  const base = annee || new Date().getFullYear();
  const commun = [{ titre: 'Mise à jour des informations légales', date: `${base}-01-31` }];
  if (type === 'COPRO') {
    return [...commun, { titre: 'AG annuelle copropriété', date: `${base}-06-15` }];
  }
  if (type === 'SCI') {
    return [...commun, { titre: 'AG annuelle SCI', date: `${base}-05-20` }];
  }
  return [...commun, { titre: 'État des lieux annuel des chambres', date: `${base}-08-31` }];
}

export function generateContract(data: { titre: string; parties: string; objet: string; duree: string }) {
  return `${data.titre} entre ${data.parties} pour ${data.objet} sur ${data.duree}`;
}

export function quizScore(answers: ('OUI' | 'NON')[]) {
  const score = answers.filter((a) => a === 'OUI').length;
  const niveau = score >= Math.ceil(answers.length * 0.7) ? 'Prêt' : 'En cours';
  return { score, niveau };
}
