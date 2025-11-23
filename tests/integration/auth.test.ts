import { POST as signup } from '@/app/api/auth/signup/route';
import { prisma } from '@/lib/db';

async function formRequest(data: Record<string, string>) {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  return new Request('http://localhost/api', { method: 'POST', body: form });
}

describe('auth integration', () => {
  it('creates a syndic user', async () => {
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
    const user = await prisma.user.findUnique({ where: { email: 'jean@example.com' } });
    expect(user?.role).toBe('SINDIC_ADMIN');
  });
});
