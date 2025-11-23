'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Item {
  id: string;
  nom: string;
  statut: string;
  budgetEstime: number;
}

export default function TravauxPage() {
  const [items, setItems] = useState<Item[]>([]);
  const load = async () => {
    const res = await fetch('/api/contracts/travaux');
    if (res.ok) setItems(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/contracts/travaux', { method: 'POST', body: formData });
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Déclarer un contrat ou travaux</h2>
        <form onSubmit={submit} className="grid md:grid-cols-5 gap-3">
          <input name="nom" placeholder="Contrat nettoyage" required />
          <input name="budgetEstime" type="number" placeholder="100000" required />
          <select name="statut">
            <option value="EN_COURS">En cours</option>
            <option value="A_ETUDIER">À étudier</option>
            <option value="TERMINE">Terminé</option>
          </select>
          <input name="fournisseur" placeholder="Fournisseur" required />
          <button className="btn-primary" type="submit">Enregistrer</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Suivi</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.nom}</span>
              <span className="text-primary-600">{item.statut} - {(item.budgetEstime / 100).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
