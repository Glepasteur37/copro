'use client';
import { FormEvent, useEffect, useState } from 'react';

interface AG {
  id: string;
  date: string;
  statut: string;
  type: string;
}

export default function AgPage() {
  const [ags, setAgs] = useState<AG[]>([]);
  const [message, setMessage] = useState('');
  const load = async () => {
    const res = await fetch('/api/ag');
    if (res.ok) setAgs(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/ag', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(res.ok ? 'AG créée' : data.error || 'Erreur');
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Planifier une AG</h2>
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3">
          <input name="date" type="date" required />
          <select name="type">
            <option value="ORDINAIRE">Ordinaire</option>
            <option value="EXTRAORDINAIRE">Extraordinaire</option>
          </select>
          <select name="statut">
            <option value="PLANIFIEE">Planifiée</option>
            <option value="TENUE">Tenue</option>
          </select>
          <button className="btn-primary" type="submit">Ajouter</button>
        </form>
        {message && <p className="text-sm text-primary-600 mt-2">{message}</p>}
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Assemblées</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {ags.map((ag) => (
            <li key={ag.id} className="flex justify-between">
              <span>{ag.date} - {ag.type}</span>
              <span className="text-primary-600">{ag.statut}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
