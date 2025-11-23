# Copro SaaS

SaaS Next.js complet pour syndics bénévoles : onboarding payant via PayPal, gestion de copropriété, invitations copropriétaires, AG, comptabilité, documents et rappels.

## Prérequis
- Node.js 18+
- PostgreSQL
- npm

## Installation
```bash
npm install
```

## Configuration
Copiez `.env.example` en `.env` et renseignez vos valeurs :
- `DATABASE_URL`
- `AUTH_SECRET`
- `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

## Base de données
```bash
npx prisma generate
npx prisma migrate dev
```

## Lancer le projet
```bash
npm run dev
```
Application disponible sur http://localhost:3000

## Tests
- Unitaires : `npm run test:unit`
- Intégration : `npm run test:integration`
- E2E (Playwright) : `npm run test:e2e`
- Tous : `npm test`

## Scénario QA manuel
1. Page d’accueil `/` : vérifier contenu marketing, CTA vers `/demo` et `/app/signup`.
2. Démo `/demo` : vérifier sections dashboard, AG, lots.
3. Signup `/app/signup` : créer un compte (mot de passe >=6). Redirection vers configuration copro.
4. Config copro `/app/copropriete` : saisir nom/adresse/lots, sauvegarder.
5. Billing `/app/settings/billing` : déclencher un paiement PayPal (sandbox) puis vérifier message d’activation.
6. Dashboard `/app/dashboard` : voir stats et CTA invitations.
7. Lots `/app/lots` : créer quelques lots, vérifier liste.
8. Comptabilité `/app/comptabilite` : créer budget et opérations, vérifier historique.
9. Invitations `/app/invitations` : envoyer une invitation, récupérer le lien `/invite?token=...`.
10. Page d’acceptation `/invite?token=...` : créer mot de passe copropriétaire, vérifier succès.
11. AG `/app/ag` : créer une AG, vérifier affichage.
12. Documents `/app/documents` : ajouter un document et ouvrir le lien.
13. Travaux `/app/travaux` : créer un contrat/travaux, vérifier statut.
14. Rappels `/app/rappels` : créer un rappel, vérifier la liste.
15. Import bancaire `/app/operations` : charger un CSV `date;libellé;montant`, prévisualiser puis créer les opérations.

## Arborescence
- `src/app` : pages (landing, démo, app connectée)
- `src/components` : composants UI
- `src/lib` : prisma, auth, validations, calculs
- `prisma/schema.prisma` : modèles
- `tests` : unitaires & intégration
- `e2e` : tests Playwright
