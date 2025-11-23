'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Lot {
  id: string;
  label: string;
  type: string;
  tantiemes: number;
}

export default function LotsPage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const load = async () => {
    const res = await fetch('/api/coproprietaires/lots');
    if (res.ok) setLots(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/coproprietaires/lots', { method: 'POST', body: formData });
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Ajouter un lot</h2>
        <form onSubmit={create} className="grid md:grid-cols-4 gap-3">
          <input name="label" placeholder="Lot A1" required />
          <input name="tantiemes" type="number" placeholder="100" required />
          <select name="type" required>
            <option value="APPARTEMENT">Appartement</option>
            <option value="PARKING">Parking</option>
            <option value="LOCAL">Local</option>
          </select>
          <button className="btn-primary" type="submit">Créer</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Lots existants</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {lots.map((lot) => (
            <li key={lot.id} className="flex justify-between">
              <span>{lot.label} - {lot.type}</span>
              <span>{lot.tantiemes} tantièmes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
