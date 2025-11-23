import { SciFlowType } from '@prisma/client';

export type SciAssociateShare = {
  associateId: string;
  parts: number;
};

export type SciFlow = {
  type: SciFlowType;
  montant: number;
};

export function computeAssociateShares(
  flows: SciFlow[],
  associates: SciAssociateShare[]
): Record<string, number> {
  const totalParts = associates.reduce((acc, a) => acc + a.parts, 0);
  if (totalParts <= 0) throw new Error('Parts associées invalides');
  const result: Record<string, number> = {};
  associates.forEach((a) => (result[a.associateId] = 0));
  flows.forEach((flow) => {
    associates.forEach((associate) => {
      const quotePart = (associate.parts / totalParts) * flow.montant;
      result[associate.associateId] += Math.round(quotePart);
    });
  });
  return result;
}

export function buildAnnualReport(
  flows: SciFlow[],
  associates: SciAssociateShare[],
  annee: number
) {
  const shares = computeAssociateShares(flows, associates);
  return Object.entries(shares).map(([associateId, montant]) => ({
    associateId,
    annee,
    quotePart: montant
  }));
}
