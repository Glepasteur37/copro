'use client';

import Link from 'next/link';

export function OutilCTA() {
  return (
    <div className="bg-primary-50 border border-primary-100 rounded-md p-4 flex items-center justify-between">
      <p className="text-sm font-medium text-primary-900">
        Gagnez du temps et automatisez tout ça pour votre copro / SCI / colocation → Essayez gratuitement le logiciel.
      </p>
      <Link href="/app/signup" className="btn-primary text-sm">
        Essayer gratuitement
      </Link>
    </div>
  );
}
