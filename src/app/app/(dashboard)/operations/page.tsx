'use client';
import { useState } from 'react';

interface ParsedLine {
  date: string;
  libelle: string;
  montant: number;
}

export default function OperationsImportPage() {
  const [lines, setLines] = useState<ParsedLine[]>([]);
  const parse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    const res = await fetch('/api/operations/import', {
      method: 'POST',
      headers: { 'Content-Type': 'text/csv' },
      body: content
    });
    if (res.ok) setLines(await res.json());
  };
  const create = async () => {
    await fetch('/api/operations/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines })
    });
    alert('Importé');
  };
  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Importer un relevé bancaire (CSV)</h2>
        <input type="file" accept=".csv" onChange={parse} />
        <p className="text-sm text-gray-600">Format : date;libellé;montant</p>
      </div>
      {lines.length > 0 && (
        <div className="card">
          <h3 className="text-md font-semibold mb-2">Prévisualisation</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {lines.map((line, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{line.date} - {line.libelle}</span>
                <span>{(line.montant / 100).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-3" onClick={create}>Créer les opérations</button>
        </div>
      )}
    </div>
  );
}
