'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Operation {
  id: string;
  libelle: string;
  montant: number;
  type: string;
}

export default function ComptabilitePage() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [message, setMessage] = useState('');
  const load = async () => {
    const res = await fetch('/api/operations/list');
    if (res.ok) setOperations(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const createOperation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/operations/create', { method: 'POST', body: formData });
    const data = await res.json();
    setMessage(res.ok ? 'Opération enregistrée' : data.error || 'Erreur');
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Budget prévisionnel</h2>
        <p className="text-sm text-gray-600 mb-2">Renseignez un total et une période pour débloquer les appels de fonds.</p>
        <form action="/api/operations/budget" method="post" className="grid md:grid-cols-4 gap-3">
          <input name="exerciceDebut" type="date" required />
          <input name="exerciceFin" type="date" required />
          <input name="totalBudget" type="number" placeholder="50000" required />
          <button className="btn-primary" type="submit">Sauvegarder</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Créer une opération comptable</h2>
        <form onSubmit={createOperation} className="grid md:grid-cols-5 gap-3">
          <input name="libelle" placeholder="Facture nettoyage" required />
          <input name="montant" type="number" placeholder="20000" required />
          <select name="type">
            <option value="DEPENSE">Dépense</option>
            <option value="APPEL_FONDS">Appel de fonds</option>
            <option value="REGLEMENT_COPRO">Règlement</option>
          </select>
          <input name="dateOperation" type="date" required />
          <button className="btn-primary" type="submit">Ajouter</button>
        </form>
        {message && <p className="text-sm text-primary-600 mt-2">{message}</p>}
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Historique</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {operations.map((op) => (
            <li key={op.id} className="flex justify-between">
              <span>{op.libelle}</span>
              <span className="text-primary-600">{op.type} - {(op.montant / 100).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
