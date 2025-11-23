import './globals.css';
import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Copro SaaS',
  description: 'Pilotage de copropriétés simplifié'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
