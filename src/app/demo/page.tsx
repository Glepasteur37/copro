import { StatsCards } from '@/components/StatsCards';
import Link from 'next/link';

const demoLots = [
  { lot: 'A12', copro: 'Durand', tantiemes: 120 },
  { lot: 'B05', copro: 'Martin', tantiemes: 95 }
];

const demoAg = [
  { date: '15/06/2024', statut: 'PLANIFIÉE', sujet: 'Budget 2024' },
  { date: '02/02/2024', statut: 'TENUE', sujet: 'Travaux toiture' }
];

export default function DemoPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Démo en lecture seule</h1>
        <Link href="/app/signup" className="btn-primary">
          Créer un compte
        </Link>
      </header>
      <StatsCards
        items={[
          { title: 'Solde banque', value: '12 500 €', hint: 'Comptes du 01/01 au 31/12' },
          { title: 'Appels en cours', value: '3', hint: 'Dont 1 en retard' },
          { title: 'Prochaine AG', value: '15/06/2024', hint: 'Salle municipale' }
        ]}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Lots & copropriétaires</h2>
          <ul className="space-y-2">
            {demoLots.map((lot) => (
              <li key={lot.lot} className="flex justify-between text-sm text-gray-700">
                <span>{lot.lot} - {lot.copro}</span>
                <span>{lot.tantiemes} tantièmes</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Assemblées générales</h2>
          <ul className="space-y-2">
            {demoAg.map((ag) => (
              <li key={ag.date} className="flex justify-between text-sm text-gray-700">
                <span>{ag.date} - {ag.sujet}</span>
                <span className="text-primary-600">{ag.statut}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Comptabilité & documents</h2>
        <p className="text-sm text-gray-600">
          Visualisez l’exemple d’un budget prévisionnel et des appels de fonds. Toutes les actions sont désactivées
          dans ce mode mais l’UX reflète fidèlement l’application connectée.
        </p>
        <div className="mt-3 flex space-x-3">
          <button className="btn-primary" disabled>Créer un appel</button>
          <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-600" disabled>
            Générer PV AG
          </button>
        </div>
      </div>
    </div>
  );
}
