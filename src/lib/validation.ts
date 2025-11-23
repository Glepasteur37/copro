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
