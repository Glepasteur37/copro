import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-semibold text-primary-600">
        CoproSaaS
      </Link>
      <div className="space-x-4">
        <Link href="/demo" className="text-sm text-gray-700 hover:text-primary-600">
          Démo
        </Link>
        <Link href="/app/signin" className="text-sm text-gray-700 hover:text-primary-600">
          Se connecter
        </Link>
        <Link href="/app/signup" className="btn-primary text-sm">
          Créer un compte
        </Link>
      </div>
    </nav>
  );
}
