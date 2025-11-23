'use client';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function InvitePage() {
  const params = useSearchParams();
  const token = params.get('token');
  const [message, setMessage] = useState('');
  const accept = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('token', token || '');
    const res = await fetch('/api/onboarding/accept', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(res.ok ? 'Invitation acceptée, compte créé' : data.error || 'Erreur');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="card w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Rejoindre votre copropriété</h1>
        <p className="text-sm text-gray-600">Complétez votre profil pour accéder à l’extranet copropriétaire.</p>
        <form onSubmit={accept} className="space-y-3">
          <input name="firstName" placeholder="Prénom" required />
          <input name="lastName" placeholder="Nom" required />
          <input name="password" type="password" placeholder="Mot de passe" required />
          <button className="btn-primary w-full" type="submit">Accepter l’invitation</button>
        </form>
        {message && <p className="text-sm text-primary-600">{message}</p>}
      </div>
    </div>
  );
}
