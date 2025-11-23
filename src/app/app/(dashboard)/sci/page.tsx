'use client';

import { useState } from 'react';

export default function SciDashboardPage() {
  const [created, setCreated] = useState(false);
  const [form, setForm] = useState({ nom: '', forme: '', siege: '', frequenceAG: 'Annuel' });

  const submit = async () => {
    const associes = [
      { name: 'Alice', email: 'alice@example.com', parts: 60 },
      { name: 'Bob', email: 'bob@example.com', parts: 40 }
    ];
    const biens = [{ adresse: '12 rue des Lilas', type: 'Appartement', quotePart: 100 }];
    const res = await fetch('/api/sci', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, associes, biens, depart: { apports: 0, compteCourant: 0, soldeBanque: 0 } })
    });
    if (res.ok) setCreated(true);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">SCI familiales</h1>
      <p className="text-sm text-gray-600">Onboarding rapide : informations de base, associés et biens.</p>
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2" placeholder="Nom de la SCI" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
        <input className="border p-2" placeholder="Forme (SARL de famille, etc.)" value={form.forme} onChange={(e) => setForm({ ...form, forme: e.target.value })} />
        <input className="border p-2" placeholder="Siège" value={form.siege} onChange={(e) => setForm({ ...form, siege: e.target.value })} />
        <input className="border p-2" placeholder="Fréquence AG" value={form.frequenceAG} onChange={(e) => setForm({ ...form, frequenceAG: e.target.value })} />
      </div>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={submit}>Créer la SCI</button>
      {created && <p className="text-green-700">SCI enregistrée. Vous pouvez suivre vos flux et générer les rapports associés.</p>}
      <div className="border p-4 rounded bg-white shadow-sm">
        <h2 className="font-semibold">Flux récents</h2>
        <ul className="list-disc ml-4 text-sm text-gray-700">
          <li>Loyer appartement A : +1200€</li>
          <li>Charges copro : -300€</li>
        </ul>
      </div>
    </div>
  );
}
