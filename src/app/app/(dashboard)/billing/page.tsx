'use client';
import { useState } from 'react';

const plans = [
  { id: 'SMALL_COPRO', label: 'Small copro', price: '39€' },
  { id: 'MEDIUM_COPRO', label: 'Medium copro', price: '59€' }
];

export default function BillingPage() {
  const [message, setMessage] = useState('');

  const loadPaypal = async () => {
    if (typeof window === 'undefined') return null;
    const existing = (window as any).paypal;
    if (existing) return existing;
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID manquant');
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Impossible de charger PayPal'));
      document.body.appendChild(script);
    });
    return (window as any).paypal || null;
  };

  const pay = async (plan: string) => {
    try {
      setMessage('Initialisation du paiement...');
      const paypal = await loadPaypal();
      if (!paypal) return setMessage('PayPal non chargé');
      const orderRes = await fetch('/api/payments/paypal/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const { id, error } = await orderRes.json();
      if (error) throw new Error(error);
      paypal
        .Buttons({
          createOrder: () => id,
          onApprove: async (data: any) => {
            await fetch('/api/payments/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, plan })
            });
            setMessage('Paiement validé, abonnement actif');
          }
        })
        .render('#paypal-buttons');
    } catch (err: any) {
      setMessage(err?.message || 'Erreur de paiement');
    }
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
