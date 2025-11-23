const colocCreate = jest.fn(async ({ data }: any) => ({ id: 'c1', ...data }));

jest.mock('@/lib/db', () => ({ prisma: { colocation: { create: colocCreate } } }));
jest.mock('@/lib/auth', () => ({ verifySession: async () => ({ userId: 'u1' }) }));
jest.mock('next/headers', () => ({ cookies: () => ({}) }));

describe('Colocation onboarding API', () => {
  beforeEach(() => colocCreate.mockClear());

  it('crée une colocation', async () => {
    const { POST } = await import('@/app/api/colocations/route');
    const res = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          nom: 'Coloc Demo',
          structure: 'Appartement',
          nbChambres: 2,
          loyerGlobal: 100000,
          chargesGlobales: 20000,
          repartition: 'EGALITAIRE',
          chambres: [
            { nom: 'Ch1', ponderation: 1 },
            { nom: 'Ch2', ponderation: 1 }
          ],
          locataires: [{ name: 'Test', email: 't@example.com', chambre: 'Ch1' }]
        })
      }) as any
    );
    expect(res.status).toBe(200);
    expect(colocCreate).toHaveBeenCalled();
  });
});
