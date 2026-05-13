'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !code) {
      alert('Please enter both phone number and order ID');
      return;
    }

    setLoading(true);
    router.push(`/track-order/${code}?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Track Your Order</h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter order number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#007BFF] hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors text-lg shadow-lg disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Track Order'}
        </button>
      </form>

      <p className="mt-8 text-center text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
        To track your order please enter your Order ID in the box below and press the &apos;Track Order&apos; button. 
        This was given to you on your receipt and in the confirmation email you should have received.
      </p>
    </div>
  );
}
