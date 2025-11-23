import { classifyAppelStatus, computeQuotePart } from '@/lib/charges';

describe('computeQuotePart', () => {
  it('calculates proportional share', () => {
    expect(computeQuotePart(10000, 100, 1000)).toBe(1000);
  });

  it('returns 0 when tantiemesTotal is zero to avoid division by zero', () => {
    expect(computeQuotePart(5000, 100, 0)).toBe(0);
  });

  it('rounds to nearest integer', () => {
    expect(computeQuotePart(1000, 333, 1000)).toBe(333);
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

  it('treats overpayment as PAYE', () => {
    expect(classifyAppelStatus(200, 50)).toBe('PAYE');
  });
});
