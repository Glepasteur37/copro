import { classifyAppelStatus, computeQuotePart } from '@/lib/charges';

describe('computeQuotePart', () => {
  it('calculates proportional share', () => {
    expect(computeQuotePart(10000, 100, 1000)).toBe(1000);
  });
});

describe('classifyAppelStatus', () => {
  it('returns PAYE when fully paid', () => {
    expect(classifyAppelStatus(100, 50)).toBe('PAYE');
  });
  it('returns EMIS when nothing paid', () => {
    expect(classifyAppelStatus(0, 50)).toBe('EMIS');
  });
  it('returns PARTIELLEMENT_PAYE otherwise', () => {
    expect(classifyAppelStatus(20, 50)).toBe('PARTIELLEMENT_PAYE');
  });
});
