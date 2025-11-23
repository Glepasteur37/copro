'use client';
import { FormEvent, useEffect, useState } from 'react';

interface Invitation {
  id: string;
  email: string;
  status: string;
  token: string;
}

export default function InvitationsPage() {
  const [items, setItems] = useState<Invitation[]>([]);
  const load = async () => {
    const res = await fetch('/api/onboarding/invitations');
    if (res.ok) setItems(await res.json());
  };
  useEffect(() => {
    load();
  }, []);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch('/api/onboarding/invitations', { method: 'POST', body: formData });
    e.currentTarget.reset();
    load();
  };
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Inviter des copropriétaires</h2>
        <form onSubmit={submit} className="grid md:grid-cols-4 gap-3">
          <input name="email" type="email" placeholder="email@exemple.fr" required />
          <input name="firstName" placeholder="Prénom" required />
          <input name="lastName" placeholder="Nom" required />
          <button className="btn-primary" type="submit">Envoyer</button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold mb-3">Invitations envoyées</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((inv) => (
            <li key={inv.id} className="flex justify-between">
              <span>{inv.email}</span>
              <span className="text-primary-600">{inv.status}</span>
              <span className="text-xs text-gray-400">/invite?token={inv.token}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
