'use client';

import { useState } from 'react';
import { repartirCharges, generateQuittance } from '@/lib/coloc';

export default function ColocationDashboardPage() {
  const [message, setMessage] = useState('');
  const chambres = [
    { id: 'ch1', nom: 'Chambre 1', ponderation: 1 },
    { id: 'ch2', nom: 'Chambre 2', ponderation: 1.2 }
  ];

  const submit = async () => {
    const payload = {
      nom: 'Coloc Étudiante',
      structure: 'Appartement',
      nbChambres: 2,
      loyerGlobal: 120000,
      chargesGlobales: 20000,
      repartition: 'PONDERATION_CHAMBRE',
      chambres: chambres.map((c) => ({ nom: c.nom, ponderation: c.ponderation })),
      locataires: [
        { name: 'Claire', email: 'claire@example.com', chambre: 'Chambre 1' },
        { name: 'Hugo', email: 'hugo@example.com', chambre: 'Chambre 2' }
      ]
    };
    const res = await fetch('/api/colocations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setMessage(res.ok ? 'Colocation créée et charges réparties.' : 'Erreur de création');
  };

  const allocations = repartirCharges({ chambres, totalCharges: 20000, rule: 'PONDERATION_CHAMBRE' });
  const quittance = generateQuittance('Claire', 'Janvier 2024', 60000, 10000);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Colocations étudiantes</h1>
      <p className="text-sm text-gray-600">Pilotage des chambres, quittances automatiques et incidents simplifiés.</p>
      <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={submit}>Créer la coloc démo</button>
      {message && <p className="text-green-700">{message}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Répartition charges</h2>
          <ul className="text-sm text-gray-700 list-disc ml-4">
            {allocations.map((a) => (
              <li key={a.chambreId}>{a.chambreId} : {a.montant / 100}€</li>
            ))}
          </ul>
        </div>
        <div className="border p-4 rounded bg-white shadow-sm">
          <h2 className="font-semibold mb-2">Quittance générée</h2>
          <pre className="whitespace-pre-wrap text-xs text-gray-800">{quittance}</pre>
        </div>
      </div>
    </div>
  );
}
