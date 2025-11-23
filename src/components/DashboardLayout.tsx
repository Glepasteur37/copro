import Link from 'next/link';
import { ReactNode } from 'react';

const navItems = [
  { href: '/app/dashboard', label: 'Dashboard' },
  { href: '/app/copropriete', label: 'Copropriété' },
  { href: '/app/lots', label: 'Lots & copropriétaires' },
  { href: '/app/comptabilite', label: 'Comptabilité' },
  { href: '/app/ag', label: 'Assemblées générales' },
  { href: '/app/travaux', label: 'Travaux & contrats' },
  { href: '/app/documents', label: 'Documents' },
  { href: '/app/rappels', label: 'Rappels' },
  { href: '/app/consultations', label: 'Consultations' },
  { href: '/app/sci', label: 'SCI familiales' },
  { href: '/app/colocations', label: 'Colocations' },
  { href: '/app/settings/billing', label: 'Billing' }
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 space-y-3">
          <div className="text-xl font-bold text-primary-600">CoproSaaS</div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-gray-700 hover:text-primary-600">
                {item.label}
              </Link>
            ))}
            <Link href="/app/invitations" className="text-sm text-gray-700 hover:text-primary-600">
              Invitations
            </Link>
            <Link href="/app/operations" className="text-sm text-gray-700 hover:text-primary-600">
              Import bancaire
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 space-y-4">
          <header className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Espace connecté</p>
              <h1 className="text-2xl font-semibold">Administration</h1>
            </div>
            <form action="/app/api/auth/logout" method="post">
              <button className="text-sm text-gray-600 hover:text-primary-600" type="submit">
                Déconnexion
              </button>
            </form>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
