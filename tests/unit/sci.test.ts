import { SciFlowType } from '@prisma/client';
import { buildAnnualReport, computeAssociateShares } from '@/lib/sci';

describe('SCI calculations', () => {
  const associates = [
    { associateId: 'a1', parts: 60 },
    { associateId: 'a2', parts: 40 }
  ];
  const flows = [
    { type: SciFlowType.LOYER, montant: 10000 },
    { type: SciFlowType.CHARGE, montant: -2000 }
  ];

  it('repartit les flux selon les parts', () => {
    const shares = computeAssociateShares(flows, associates);
    expect(shares.a1).toBe(4800);
    expect(shares.a2).toBe(3200);
  });

  it('génère un rapport annuel', () => {
    const report = buildAnnualReport(flows, associates, 2024);
    expect(report).toHaveLength(2);
    expect(report.find((r) => r.associateId === 'a1')?.quotePart).toBe(4800);
  });

  it('rejette des parts invalides', () => {
    expect(() => computeAssociateShares(flows, [])).toThrow('Parts associées invalides');
  });
});
