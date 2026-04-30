"use client";

import React from 'react'
import Image from 'next/image'
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

const Success = () => {
    const router = useRouter();
    const lastOrder = useAppSelector((state) => state.order.lastOrder);

    if (!lastOrder) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold mb-4">No order found</h1>
                <button
                    onClick={() => router.push('/')}
                    className="bg-[#1877f2] text-white px-6 py-2 rounded-lg"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mb-12 mt-10 ">
            {/* Success Header */}
            <div className="text-center mb-8 flex flex-col items-center">
                <div className="mb-4">
                    <Image
                        src="/images/approve.png" // User will replace this top icon
                        alt="Success"
                        width={80}
                        height={80}
                        priority
                        className="object-contain"
                    />
                </div>
                <h1 className="text-[24px] font-semibold text-gray-900 mb-2 tracking-tight">Thank You! Your Payment Was Successful</h1>
                <p className="text-gray-500 text-[14px] font-normal max-w-xl px-4">Your payment has been completed successfully. Thank you for choosing Samsung Electra.</p>
            </div>

            {/* Order Info Bar */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 mb-6 shadow-sm">
                <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-0 w-full group">
                    <div className="flex-1 md:pr-4">
                        <p className="text-gray-400 text-[12px] mb-1 font-normal">Order Id</p>
                        <p className="font-normal text-[16px] text-gray-900 tracking-tight">{lastOrder.orderId}</p>
                    </div>
                    <div className="hidden md:block w-[1px] bg-gray-200 h-10 self-center mx-4"></div>
                    <div className="flex-1 md:px-4">
                        <p className="text-gray-400 text-[12px] mb-1 font-normal">Payment method</p>
                        <p className="font-normal text-[16px] text-gray-900 tracking-tight">{lastOrder.paymentMethod}</p>
                    </div>
                    <div className="hidden md:block w-[1px] bg-gray-200 h-10 self-center mx-4"></div>
                    <div className="flex-1 md:pl-4">
                        <p className="text-gray-400 text-[12px] mb-1 font-normal">Delivery date</p>
                        <p className="font-normal text-[16px] text-gray-900 tracking-tight">{lastOrder.deliveryDate}</p>
                    </div>
                </div>
                <div className="flex  flex-col gap-2 w-full md:w-auto">
                    <button className="border border-[#1877f2] text-[#1877f2] font-semibold px-4 py-2 rounded-lg text-[11px] hover:bg-blue-50 transition-colors uppercase tracking-wider whitespace-nowrap">
                        Track your order
                    </button>
                    <button className="bg-[#1877f2] text-white font-semibold px-4 py-2 rounded-lg text-[11px] hover:bg-blue-600 transition-colors uppercase tracking-wider shadow-sm whitespace-nowrap">
                        Download Invoice
                    </button>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-[#eff1f3] rounded-2xl p-4 md:p-6">
                <div className="mb-4">
                    <h2 className="text-[18px] font-semibold text-gray-900">Product Details</h2>
                    <div className="h-[1px] bg-gray-300 w-full mt-2"></div>
                </div>

                <div className="space-y-3">
                    {lastOrder.items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-6 items-center border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative flex items-center justify-center p-2 border border-gray-100">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row justify-between gap-4 w-full group">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900 text-[11px] tracking-tight">{item.brand}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="text-gray-400 text-[11px] font-normal uppercase">Washing Machine</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-[16px] leading-[1.3] group-hover:text-[#1877f2] transition-colors cursor-pointer capitalize">
                                        {item.title}
                                    </h3>
                                    <div className="text-[11px] text-gray-400 font-normal uppercase tracking-wide mt-1 space-y-0.5">
                                        <p>Quantity : <span className="text-gray-900 ml-1">{item.quantity}</span> | Color : <span className="text-gray-900 ml-1">{item.color || 'N/A'}</span></p>
                                        <p>Original Price : <span className="text-gray-800 ml-1">{item.originalPrice}</span></p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col justify-center">
                                    <span className="font-semibold text-[18px] text-[#1877f2] tracking-tight whitespace-nowrap">{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Billing Summary */}
                <div className="mt-6 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                    <div className="space-y-3 text-[14px]">
                        <div className="flex justify-between items-center text-gray-600 font-normal">
                            <span className="font-normal">Save</span>
                            <span className="font-normal text-gray-900 text-[16px]">৳{lastOrder.savings.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center text-gray-600 font-normal">
                            <span className="font-normal">Delivery</span>
                            <span className="font-normal text-gray-900 text-[16px]">৳{lastOrder.delivery.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600 font-normal">
                            <span className="font-normal">Coupon Code</span>
                            <span className="font-normal text-gray-900 text-[16px]">0</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-gray-900">
                            <span className="text-[16px] font-semibold">Total Amount :</span>
                            <span className="text-[22px] font-semibold tracking-tight text-[#1877f2]">৳{lastOrder.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Success
