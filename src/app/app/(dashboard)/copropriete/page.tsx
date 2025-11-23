'use client';
import { FormEvent, useState } from 'react';

export default function CoproprietePage() {
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/onboarding/copropriete', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(res.ok ? 'Copropriété enregistrée' : data.error || 'Erreur');
  };
  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-semibold">Configurer votre copropriété</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Nom</label>
          <input name="nom" required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Adresse</label>
          <input name="adresse" required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Nombre de lots</label>
          <input name="nbLotsMax" type="number" min={1} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Répartition charges (JSON)</label>
          <textarea name="settings" defaultValue="{}" />
        </div>
        <button type="submit" className="btn-primary md:col-span-2">
          Enregistrer
        </button>
      </form>
      {message && <p className="text-sm text-primary-600">{message}</p>}
      <p className="text-sm text-gray-600">
        Une fois la copropriété sauvegardée, choisissez votre plan depuis la page Billing pour activer l’abonnement.
      </p>
    </div>
  );
}
