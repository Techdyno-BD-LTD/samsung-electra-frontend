'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderTimeline from '../_components/OrderTimeline';
import OrderDetails from '../_components/OrderDetails';
import Link from 'next/link';

type TimelineStep = {
  label: string;
  status: 'completed' | 'current' | 'pending';
  date: string | null;
};

type OrderItem = {
  id: number;
  name: string;
  thumbnail: string;
  variation: string | null;
  price: number;
  quantity: number;
  model: string;
};

type OrderSummary = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

interface Order {
  code: string;
  timeline: TimelineStep[];
  items: OrderItem[];
  summary: OrderSummary;
}

function OrderTrackDetailsContent({ params }: { params: { code: string } }) {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/v2/order/track?code=${params.code}&phone=${phone || ''}`);
        const json = await res.json();
        
        if (json.success && json.data && json.data.length > 0) {
          setOrder(json.data[0]);
        } else {
          setError(json.message || 'Order not found');
        }
      } catch {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.code, phone]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Fetching order status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block mb-6">
          <p className="text-lg font-bold">{error || 'Something went wrong'}</p>
        </div>
        <br />
        <Link 
          href="/track-order" 
          className="inline-flex items-center text-blue-600 font-bold hover:underline"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tracking
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Status</h1>
        <p className="text-slate-500 font-medium">Order Id : <span className="text-slate-900">#{order.code}</span></p>
      </header>

      <OrderTimeline timeline={order.timeline} />
      
      <OrderDetails items={order.items} summary={order.summary} />
      
      <div className="mt-12 text-center">
        <Link 
          href="/track-order" 
          className="inline-flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3 rounded-full transition-all"
        >
          Track Another Order
        </Link>
      </div>
    </div>
  );
}

export default function OrderTrackDetailsPage({ params }: { params: { code: string } }) {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-40">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
        }>
            <OrderTrackDetailsContent params={params} />
        </Suspense>
    );
}
