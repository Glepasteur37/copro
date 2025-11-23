'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Doc {
  id: string;
  titre: string;
  type: string;
  url: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const load = async () => {
    const res = await fetch('/api/documents');
    if (res.ok) setDocs(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const upload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/documents', { method: 'POST', body: formData });
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Ajouter un document</h2>
        <form onSubmit={upload} className="grid md:grid-cols-4 gap-3">
          <input name="titre" placeholder="PV AG" required />
          <select name="type">
            <option value="AG_PV">PV AG</option>
            <option value="CONTRAT">Contrat</option>
            <option value="TRAVAUX">Travaux</option>
          </select>
          <input name="url" placeholder="https://..." required />
          <button className="btn-primary" type="submit">Uploader</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Documents</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {docs.map((doc) => (
            <li key={doc.id} className="flex justify-between">
              <span>{doc.titre}</span>
              <a className="text-primary-600" href={doc.url} target="_blank" rel="noreferrer">{doc.type}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
