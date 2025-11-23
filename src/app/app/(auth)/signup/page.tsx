'use client';
import { FormEvent, useState } from 'react';

export default function SignUpPage() {
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/signup', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/app/copropriete';
    } else {
      setMessage(data.error || 'Erreur');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="card w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold text-center">Créer un compte syndic</h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Prénom</label>
            <input name="firstName" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Nom</label>
            <input name="lastName" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600">Email</label>
            <input name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input name="password" type="password" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Confirmation</label>
            <input name="confirmPassword" type="password" required />
          </div>
          {message && <p className="text-sm text-red-600 md:col-span-2">{message}</p>}
          <button type="submit" className="btn-primary md:col-span-2">
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}
