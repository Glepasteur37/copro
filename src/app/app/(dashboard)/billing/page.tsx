'use client';
import { useState } from 'react';
import { loadScript } from '@paypal/paypal-js';

const plans = [
  { id: 'SMALL_COPRO', label: 'Small copro', price: '39€' },
  { id: 'MEDIUM_COPRO', label: 'Medium copro', price: '59€' }
];

export default function BillingPage() {
  const [message, setMessage] = useState('');

  const pay = async (plan: string) => {
    setMessage('Initialisation du paiement...');
    const paypal = await loadScript({ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' });
    if (!paypal) return setMessage('PayPal non chargé');
    const orderRes = await fetch('/api/payments/paypal/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });
    const { id } = await orderRes.json();
    paypal.Buttons({
      createOrder: () => id,
      onApprove: async (data) => {
        await fetch('/api/payments/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID, plan })
        });
        setMessage('Paiement validé, abonnement actif');
      }
    }).render('#paypal-buttons');
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Abonnement</h2>
        <p className="text-sm text-gray-600 mb-4">Choisissez ou mettez à jour votre plan. PayPal Checkout sécurisé.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div key={plan.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
              <p className="font-semibold">{plan.label}</p>
              <p className="text-2xl font-bold text-primary-600">{plan.price}</p>
              <button className="btn-primary" onClick={() => pay(plan.id)}>Payer avec PayPal</button>
            </div>
          ))}
        </div>
        <div id="paypal-buttons" className="mt-4" />
        {message && <p className="text-sm text-primary-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}
