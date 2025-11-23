import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe doivent correspondre',
    path: ['confirmPassword']
  });

export const coproSchema = z.object({
  nom: z.string().min(1),
  adresse: z.string().min(1),
  nbLotsMax: z.number().min(1),
  settings: z.any()
});

export const invitationSchema = z.object({
  coproprieteId: z.string().uuid(),
  invitations: z.array(
    z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
      lastName: z.string().min(1)
    })
  )
});

export const appelSchema = z.object({
  coproprieteId: z.string().uuid(),
  dateEmission: z.string(),
  dateEcheance: z.string(),
  montantTotal: z.number().int().min(0)
});

export const agSchema = z.object({
  coproprieteId: z.string().uuid(),
  date: z.string(),
  type: z.string(),
  statut: z.string(),
  resolutions: z.array(
    z.object({
      titre: z.string(),
      description: z.string(),
      articleMajorite: z.string()
    })
  )
});

export const paypalOrderSchema = z.object({
  plan: z.enum(['SMALL_COPRO', 'MEDIUM_COPRO']),
  userId: z.string().uuid()
});

export const consultationRequestSchema = z.object({
  topic: z.string().min(3),
  details: z.string().optional(),
  amount: z.number().positive().max(500)
});

export const consultationCaptureSchema = z.object({
  ticketId: z.string().uuid(),
  orderId: z.string().min(3)
});

export const sciOnboardingSchema = z.object({
  nom: z.string().min(1),
  forme: z.string().min(1),
  siege: z.string().min(1),
  frequenceAG: z.string().min(1),
  associes: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      parts: z.number().positive()
    })
  ),
  biens: z.array(
    z.object({
      adresse: z.string().min(1),
      type: z.string().min(1),
      quotePart: z.number().positive()
    })
  ),
  depart: z.object({
    apports: z.number().nonnegative(),
    compteCourant: z.number().nonnegative(),
    soldeBanque: z.number().nonnegative()
  })
});

export const colocOnboardingSchema = z.object({
  nom: z.string().min(1),
  structure: z.string().min(1),
  nbChambres: z.number().int().min(1),
  loyerGlobal: z.number().int().nonnegative(),
  chargesGlobales: z.number().int().nonnegative(),
  repartition: z.enum(['EGALITAIRE', 'PONDERATION_CHAMBRE']),
  chambres: z.array(
    z.object({
      nom: z.string().min(1),
      ponderation: z.number().positive()
    })
  ),
  locataires: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      chambre: z.string().min(1)
    })
  )
});
