import { Role } from '@prisma/client';

const cookieStore = { set: jest.fn(), get: jest.fn() };
const users: any[] = [];
const findUnique = jest.fn(async ({ where }: any) => users.find((u) => u.email === where.email) || null);
const create = jest.fn(async ({ data }: any) => {
  const user = { ...data, id: `user-${users.length + 1}`, role: data.role ?? Role.SINDIC_ADMIN, createdAt: new Date(), updatedAt: new Date() };
  users.push(user);
  return user;
});

jest.mock('next/headers', () => ({ cookies: () => cookieStore }));
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique,
      create
    }
  }
}));

describe('auth integration', () => {
  const loadRoute = async () => (await import('@/app/api/auth/signup/route')).POST;

  beforeEach(() => {
    jest.resetModules();
    users.length = 0;
    findUnique.mockClear();
    create.mockClear();
    cookieStore.set.mockClear();
    process.env.AUTH_SECRET = 'test-secret';
  });

  const formRequest = async (data: Record<string, string>) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, v));
    return new Request('http://localhost/api', { method: 'POST', body: form });
  };

  it('creates a syndic user and sets cookie', async () => {
    const signup = await loadRoute();
    const req = await formRequest({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@example.com',
      password: 'secret123',
      confirmPassword: 'secret123'
    });
    const res = await signup(req as any);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(create).toHaveBeenCalled();
    expect(cookieStore.set).toHaveBeenCalled();
  });

  it('rejects duplicate emails', async () => {
    const signup = await loadRoute();
    users.push({ id: 'existing', email: 'dup@example.com', role: Role.SINDIC_ADMIN });
    const req = await formRequest({
      firstName: 'Dup',
      lastName: 'Li',
      email: 'dup@example.com',
      password: 'secret123',
      confirmPassword: 'secret123'
    });
    const res = await signup(req as any);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Email déjà utilisé');
  });

  it('returns validation error for mismatched passwords', async () => {
    const signup = await loadRoute();
    const req = await formRequest({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'secret123',
      confirmPassword: 'secret12'
    });
    const res = await signup(req as any);
    expect(res.status).toBe(400);
  });
});
