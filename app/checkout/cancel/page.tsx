"use client";

import React from 'react'
import { useRouter } from 'next/navigation';

const Cancel = () => {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-4xl">!</span>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Payment Cancelled</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You have cancelled the payment process. Your order has been saved but remains unpaid.
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => router.push('/checkout')}
                    className="bg-[#1877f2] text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-colors"
                >
                    Continue Checkout
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

export default Cancel;
