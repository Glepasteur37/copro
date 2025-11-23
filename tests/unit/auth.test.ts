import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword, signSession } from '@/lib/auth';
import { Role } from '@prisma/client';

describe('hashPassword / verifyPassword', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('secret123');
    await expect(verifyPassword('secret123', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong', hash)).resolves.toBe(false);
  });
});

describe('signSession', () => {
  const original = process.env.AUTH_SECRET;

  afterEach(() => {
    process.env.AUTH_SECRET = original;
  });

  it('throws when secret missing', () => {
    delete process.env.AUTH_SECRET;
    expect(() => signSession({ userId: '1', role: Role.SINDIC_ADMIN })).toThrow('AUTH_SECRET');
  });

  it('returns token with payload when secret set', () => {
    process.env.AUTH_SECRET = 'test-secret';
    const token = signSession({ userId: '42', role: Role.COPROPRIETAIRE });
    const decoded = jwt.verify(token, 'test-secret') as { userId: string; role: Role };
    expect(decoded.userId).toBe('42');
    expect(decoded.role).toBe(Role.COPROPRIETAIRE);
  });
});
