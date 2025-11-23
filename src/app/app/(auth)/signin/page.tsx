'use client';
import { FormEvent, useState } from 'react';

export default function SignInPage() {
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch('/api/auth/signin', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) {
      window.location.href = '/app/dashboard';
    } else {
      setMessage(data.error || 'Erreur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input name="email" type="email" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Mot de passe</label>
            <input name="password" type="password" required />
          </div>
          {message && <p className="text-sm text-red-600">{message}</p>}
          <button type="submit" className="btn-primary w-full">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
