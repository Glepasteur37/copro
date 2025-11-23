import { appelSchema, coproSchema, invitationSchema, paypalOrderSchema, signupSchema } from '@/lib/validation';

describe('signupSchema', () => {
  it('accepts valid payload', () => {
    const result = signupSchema.safeParse({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      password: 'secret123',
      confirmPassword: 'secret123'
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatching passwords', () => {
    const result = signupSchema.safeParse({
      firstName: 'A',
      lastName: 'B',
      email: 'bad@example.com',
      password: 'secret123',
      confirmPassword: 'nope123'
    });
    expect(result.success).toBe(false);
  });
});

describe('coproSchema', () => {
  it('requires nbLotsMax >= 1', () => {
    const result = coproSchema.safeParse({ nom: 'Test', adresse: '1 rue', nbLotsMax: 0, settings: {} });
    expect(result.success).toBe(false);
  });
});

describe('invitationSchema', () => {
  it('validates list of invitations', () => {
    const result = invitationSchema.safeParse({
      coproprieteId: '00000000-0000-0000-0000-000000000000',
      invitations: [
        { email: 'a@example.com', firstName: 'A', lastName: 'AA' },
        { email: 'b@example.com', firstName: 'B', lastName: 'BB' }
      ]
    });
    expect(result.success).toBe(true);
  });
});

describe('appelSchema', () => {
  it('fails when montantTotal negative', () => {
    const result = appelSchema.safeParse({
      coproprieteId: '00000000-0000-0000-0000-000000000000',
      dateEmission: '2024-01-01',
      dateEcheance: '2024-02-01',
      montantTotal: -1
    });
    expect(result.success).toBe(false);
  });
});

describe('paypalOrderSchema', () => {
  it('requires supported plan enum', () => {
    const result = paypalOrderSchema.safeParse({ plan: 'SMALL_COPRO', userId: '00000000-0000-0000-0000-000000000000' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid enum value', () => {
    const result = paypalOrderSchema.safeParse({ plan: 'INVALID', userId: '00000000-0000-0000-0000-000000000000' } as any);
    expect(result.success).toBe(false);
  });
});
