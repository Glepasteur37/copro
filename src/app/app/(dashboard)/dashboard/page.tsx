import { StatsCards } from '@/components/StatsCards';
import Link from 'next/link';

const reminders = [
  { title: 'AG annuelle', date: '15/06/2024' },
  { title: 'Relance impayés', date: '25/05/2024' }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards
        items={[
          { title: 'Solde comptes', value: '12 500 €', hint: 'Inclut appels de fonds' },
          { title: 'Lots actifs', value: '12', hint: '2 parkings, 10 appartements' },
          { title: 'Prochaines échéances', value: '2', hint: 'Contrat chauffage, AG' }
        ]}
      />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Onboarding copropriétaires</h2>
            <Link href="/app/invitations" className="text-primary-600 text-sm">
              Gérer
            </Link>
          </div>
          <p className="text-sm text-gray-600 mb-2">Invitez vos copropriétaires pour partager les documents et recueillir les votes.</p>
          <Link href="/app/invitations" className="btn-primary">
            Inviter
          </Link>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-3">Rappels à venir</h2>
          <ul className="space-y-2">
            {reminders.map((r) => (
              <li key={r.title} className="flex justify-between text-sm text-gray-700">
                <span>{r.title}</span>
                <span>{r.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
