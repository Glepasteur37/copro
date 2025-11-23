'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';

type Ticket = {
  id: string;
  topic: string;
  status: string;
  amountCents: number;
  paypalOrderId?: string;
  createdAt: string;
};

export default function ConsultationsPage() {
  const [topic, setTopic] = useState('Conseil comptable rapide');
  const [amount, setAmount] = useState(120);
  const [details, setDetails] = useState('Aide ponctuelle sur la répartition des charges.');
  const [orderState, setOrderState] = useState<{ orderId?: string; ticketId?: string; message?: string }>({});
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const res = await fetch('/api/consultations');
    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const createOrder = async () => {
    setLoading(true);
    setOrderState({});
    const res = await fetch('/api/payments/consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, amount, details })
    });
    const data = await res.json();
    if (!res.ok) {
      setOrderState({ message: data.error || 'Erreur lors de la création' });
    } else {
      setOrderState({ orderId: data.orderId, ticketId: data.ticketId, message: 'Commande PayPal créée, capture simulée dispo.' });
    }
    setLoading(false);
    refresh();
  };

  const captureOrder = async () => {
    if (!orderState.orderId || !orderState.ticketId) return;
    setLoading(true);
    const res = await fetch('/api/payments/consultation/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderState.orderId, ticketId: orderState.ticketId })
    });
    const data = await res.json();
    setOrderState({ ...orderState, message: data.error || 'Paiement simulé validé (sandbox).' });
    setLoading(false);
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="bg-white border p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold">Consultation ponctuelle</h2>
          <p className="text-sm text-gray-600 mt-1">
            Achetez une séance d’accompagnement humain (comptabilité ou juridique). Paiement unique via PayPal.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Sujet
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Montant (€)
              <input
                type="number"
                min={50}
                className="mt-1 w-full border rounded px-3 py-2"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-gray-700 mt-3">
            Détails
            <textarea
              className="mt-1 w-full border rounded px-3 py-2"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </label>
          <div className="flex gap-2 mt-4">
            <button
              onClick={createOrder}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50"
              disabled={loading}
            >
              Générer le paiement PayPal
            </button>
            {orderState.orderId && (
              <button
                onClick={captureOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                Confirmer la capture (sandbox)
              </button>
            )}
          </div>
          {orderState.message && <p className="text-sm text-gray-700 mt-2">{orderState.message}</p>}
        </div>

        <div className="bg-white border p-6 rounded shadow-sm">
          <h3 className="text-lg font-semibold">Historique des tickets</h3>
          <p className="text-sm text-gray-600">Suivez vos demandes de consultation réglées ou en attente.</p>
          <div className="mt-3 space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{ticket.topic}</p>
                  <p className="text-xs text-gray-500">Ticket {ticket.id.slice(0, 8)} · {new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{(ticket.amountCents / 100).toFixed(2)} €</p>
                  <p className="text-xs uppercase tracking-wide text-gray-600">{ticket.status}</p>
                  {ticket.paypalOrderId && <p className="text-[11px] text-gray-500">Ordre {ticket.paypalOrderId}</p>}
                </div>
              </div>
            ))}
            {tickets.length === 0 && <p className="text-sm text-gray-600">Aucune demande encore.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
