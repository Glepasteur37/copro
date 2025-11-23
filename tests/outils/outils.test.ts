import {
  buildAgChecklist,
  buildAppelDeFonds,
  colocationCharges,
  computeTantiemes,
  estimationChargesAnnuelles,
  generateBudgetPrevisionnel,
  obligationsGenerales,
  quizScore,
  reglementInterieur,
  sciFlowDistribution
} from '@/lib/outils';

describe('outils calculs', () => {
  it('calcule les tantièmes', () => {
    const result = computeTantiemes([50, 50]);
    expect(result[0].tantieme).toBe(500);
    expect(result[1].pourcentage).toBe(50);
  });

  it('ventile un budget', () => {
    const budget = generateBudgetPrevisionnel([
      { nom: 'Assurance', montant: 100 },
      { nom: 'Energie', montant: 200 }
    ]);
    expect(budget.total).toBe(300);
    expect(budget.lignes).toHaveLength(2);
  });

  it('répartit un appel de fonds', () => {
    const repartition = buildAppelDeFonds(
      [
        { nom: 'Lot A', tantieme: 600 },
        { nom: 'Lot B', tantieme: 400 }
      ],
      1000
    );
    expect(repartition[0].montant).toBe(600);
    expect(repartition[1].montant).toBe(400);
  });

  it('calcule la répartition SCI', () => {
    const repartition = sciFlowDistribution(
      [
        { name: 'Alice', parts: 60 },
        { name: 'Bruno', parts: 40 }
      ],
      1000,
      500
    );
    expect(repartition[0].net).toBe(100);
    expect(repartition[1].charges).toBe(200);
  });

  it('produit une checklist ag', () => {
    const checklist = buildAgChecklist({ convocationEnvoyee: true, quorumAtteint: false, feuillePresenceSignee: true, pvRedige: false });
    expect(checklist.items).toHaveLength(4);
    expect(checklist.score).toBeLessThan(1);
  });

  it('répartit les charges colocation', () => {
    const repartition = colocationCharges(300, 'EGALITAIRE', [
      { nom: 'Ch1', ponderation: 1 },
      { nom: 'Ch2', ponderation: 1 },
      { nom: 'Ch3', ponderation: 1 }
    ]);
    expect(repartition[0].montant).toBe(100);
  });

  it('calcule les charges annuelles', () => {
    const estimation = estimationChargesAnnuelles([100, 50], 5);
    expect(estimation.annuel).toBe(1800);
    expect(estimation.parColoc).toBe(360);
  });

  it('retourne un calendrier', () => {
    const calendar = obligationsGenerales('COPRO', 2024);
    expect(calendar[0].date).toContain('2024');
  });

  it('scanne un règlement', () => {
    const reglement = reglementInterieur(['Règle 1', '']);
    expect(reglement.total).toBe(1);
  });

  it('score le quiz', () => {
    const result = quizScore(['OUI', 'NON', 'OUI']);
    expect(result.score).toBe(2);
    expect(result.niveau).toBe('Prêt');
  });
});
