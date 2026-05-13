"use client";

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

const FailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('order_code');

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-500 text-4xl">✕</span>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Failed</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Unfortunately, your payment could not be processed. 
                {orderCode && <span> (Order: {orderCode})</span>}
                Please try again or contact support if the problem persists.
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => router.push('/checkout')}
                    className="bg-[#1877f2] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="border border-gray-300 text-gray-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
}

const Fail = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailContent />
        </Suspense>
    );
}

export default Fail;
