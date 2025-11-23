import { cookies } from 'next/headers';

const cookieStore = { get: jest.fn(), set: jest.fn() } as any;
jest.mock('next/headers', () => ({ cookies: () => cookieStore }));

const sciCreate = jest.fn(async ({ data }: any) => ({ id: 's1', ...data }));
jest.mock('@/lib/db', () => ({ prisma: { sci: { create: sciCreate } } }));

jest.mock('@/lib/auth', () => ({ verifySession: async () => ({ userId: 'u1' }) }));

describe('SCI onboarding API', () => {
  beforeEach(() => {
    sciCreate.mockClear();
  });

  it('crée une SCI avec associés et biens', async () => {
    const { POST } = await import('@/app/api/sci/route');
    const res = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({
          nom: 'SCI Demo',
          forme: 'SARL de famille',
          siege: 'Paris',
          frequenceAG: 'Annuel',
          associes: [{ name: 'A', email: 'a@example.com', parts: 60 }],
          biens: [{ adresse: '1 rue', type: 'Appartement', quotePart: 100 }],
          depart: { apports: 0, compteCourant: 0, soldeBanque: 0 }
        })
      }) as any
    );
    expect(res.status).toBe(200);
    expect(sciCreate).toHaveBeenCalled();
  });
});
