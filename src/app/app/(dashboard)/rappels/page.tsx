'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Rappel {
  id: string;
  description: string;
  dateEcheance: string;
  statut: string;
}

export default function RappelsPage() {
  const [items, setItems] = useState<Rappel[]>([]);
  const load = async () => {
    const res = await fetch('/api/rappels');
    if (res.ok) setItems(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/rappels', { method: 'POST', body: formData });
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Créer un rappel</h2>
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3">
          <input name="description" placeholder="AG annuelle" required />
          <input name="dateEcheance" type="date" required />
          <select name="type">
            <option value="AG_ANNUELLE">AG annuelle</option>
            <option value="ECHEANCE_CONTRAT">Échéance contrat</option>
            <option value="AUTRE">Autre</option>
          </select>
          <button className="btn-primary" type="submit">Ajouter</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Rappels</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((rappel) => (
            <li key={rappel.id} className="flex justify-between">
              <span>{rappel.description}</span>
              <span className="text-primary-600">{rappel.statut} - {rappel.dateEcheance}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
