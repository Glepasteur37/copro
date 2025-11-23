import { generateQuittance, repartirCharges } from '@/lib/coloc';

describe('colocation helpers', () => {
  it('répartit les charges pondérées', () => {
    const allocations = repartirCharges({
      chambres: [
        { id: 'ch1', ponderation: 1 },
        { id: 'ch2', ponderation: 2 }
      ],
      totalCharges: 30000,
      rule: 'PONDERATION_CHAMBRE'
    });
    expect(allocations.find((a) => a.chambreId === 'ch1')?.montant).toBe(10000);
    expect(allocations.find((a) => a.chambreId === 'ch2')?.montant).toBe(20000);
  });

  it('refuse les montants négatifs', () => {
    expect(() => repartirCharges({ chambres: [{ id: 'ch1', ponderation: 1 }], totalCharges: -1, rule: 'EGALITAIRE' })).toThrow(
      'Montant invalide'
    );
  });

  it('génère une quittance', () => {
    const q = generateQuittance('Alice', 'Mars 2024', 50000, 5000);
    expect(q).toContain('Alice');
    expect(q).toContain('Mars 2024');
  });
});
