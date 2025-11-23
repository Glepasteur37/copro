import { NavBar } from '@/components/NavBar';
import Link from 'next/link';

const features = [
  'Dashboard clair avec résumés financiers',
  'Onboarding payant sécurisé avec PayPal Checkout',
  'Invitations copropriétaires et extranet',
  'Assemblées générales, budgets, appels de fonds et relances',
  'Portail documents et suivi des travaux'
];

const pricing = [
  { plan: 'SMALL_COPRO', price: '39€ / mois', desc: 'Jusqu’à 15 lots' },
  { plan: 'MEDIUM_COPRO', price: '59€ / mois', desc: 'Jusqu’à 30 lots' }
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      <NavBar />
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            La solution SaaS pour syndics bénévoles
          </h1>
          <p className="text-lg text-gray-600">
            Centralisez la comptabilité, les assemblées générales, les contrats et la communication copropriétaire
            dans un espace unique.
          </p>
          <div className="space-x-3">
            <Link href="/demo" className="btn-primary">
              Essayer la démo
            </Link>
            <Link href="/app/signup" className="text-primary-600 font-medium">
              Créer un compte
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500 uppercase mb-2">Fonctionnalités clés</p>
            <ul className="grid gap-2">
              {features.map((f) => (
                <li key={f} className="flex items-center space-x-2 text-gray-700">
                  <span className="text-primary-600">●</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card space-y-4">
          <p className="text-sm text-gray-500 uppercase">Pricing</p>
          <div className="grid gap-4">
            {pricing.map((p) => (
              <div key={p.plan} className="border border-gray-200 rounded-lg p-4">
                <p className="text-lg font-semibold">{p.plan}</p>
                <p className="text-2xl font-bold text-primary-600">{p.price}</p>
                <p className="text-sm text-gray-500">{p.desc}</p>
                <Link href="/app/signup" className="btn-primary mt-3 inline-block">
                  Choisir ce plan
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Paiement sécurisé par PayPal. Modifiable à tout moment depuis la page Billing.
          </p>
        </div>
      </section>
    </div>
  );
}
