"use client"
import React, { useMemo, useState, useEffect } from 'react';
import { FiChevronRight, FiEdit, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { HiOutlineTicket } from "react-icons/hi2";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart, updateItemDetails } from '@/store/features/cart/cartSlice';
import { setLastOrder } from '@/store/features/order/orderSlice';
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Checkout = () => {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cartItems = useAppSelector((state) => state.cart.items);
    const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({ address: '', phone: '', postal_code: '' });

    const [paymentMethod, setPaymentMethod] = useState('Online Payment Gateway');
    const [deliveryNote, setDeliveryNote] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchAddresses = async () => {
        if (!token) return;
        try {
            const response = await fetch("/api/v2/user/shipping/address", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const payload = await response.json();
            if (payload.success) {
                setAddresses(payload.data);
                const defaultAddr = payload.data.find((a: any) => a.set_default === 1);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (payload.data.length > 0) setSelectedAddressId(payload.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };

    useEffect(() => {
        if (mounted && token) fetchAddresses();
    }, [mounted, token]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/v2/user/shipping/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });
            const payload = await response.json();
            if (payload.success) {
                fetchAddresses();
                setIsAddressModalOpen(false);
                setAddressForm({ address: '', phone: '', postal_code: '' });
            }
        } catch (error) {
            console.error("Failed to create address", error);
        }
    };

    const selectedAddress = useMemo(() => 
        addresses.find(a => a.id === selectedAddressId), 
    [addresses, selectedAddressId]);

    // Sync Cart Images and Variants
    useEffect(() => {
        if (!mounted || cartItems.length === 0) return;

        const syncCartImages = async () => {
            const uniqueSlugs = Array.from(new Set(cartItems.map(item => item.slug).filter(Boolean)));
            
            for (const slug of uniqueSlugs) {
                try {
                    const response = await fetch(`/api/products/${slug}`);
                    if (!response.ok) continue;
                    const data = await response.json();
                    
                    if (data.success && data.data && data.data.length > 0) {
                        const product = data.data[0];
                        const variants = product.variants || [];
                        
                        const itemsToUpdate = cartItems.filter(item => item.slug === slug);
                        
                        for (const item of itemsToUpdate) {
                            const matchedVariant = variants.find((v: any) => 
                                v.variant?.trim().toLowerCase() === item.variant?.trim().toLowerCase() ||
                                v.variant?.trim().toLowerCase() === item.color?.trim().toLowerCase()
                            );
                            
                            if (matchedVariant && matchedVariant.image && matchedVariant.image !== item.image) {
                                dispatch(updateItemDetails({ 
                                    id: item.id, 
                                    updates: { image: matchedVariant.image } 
                                }));
                            }
                        }
                    }
                } catch (err) {
                    console.error(`Failed to sync image for ${slug}:`, err);
                }
            }
        };

        syncCartImages();
    }, [mounted, cartItems.length, dispatch]);

    const totals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.price) * item.quantity), 0);
        const originalSubtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.originalPrice) * item.quantity), 0);
        const savings = originalSubtotal - subtotal;
        const tax = 0; // Assuming tax is free/0 as per UI
        const delivery = 0; // Assuming delivery is free as per UI
        const total = subtotal + tax + delivery;

        return {
            subtotal,
            originalSubtotal,
            savings,
            tax,
            delivery,
            total,
            savePercent: originalSubtotal > 0 ? Math.round((savings / originalSubtotal) * 100) : 0
        };
    }, [cartItems]);

    const handlePlaceOrder = () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const orderId = `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 5);

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        };

        dispatch(setLastOrder({
            orderId,
            paymentMethod: paymentMethod,
            deliveryDate: formatDate(deliveryDate),
            items: cartItems.map(item => ({
                id: item.id,
                title: item.title,
                brand: item.brand,
                image: item.image,
                price: item.price,
                originalPrice: item.originalPrice,
                quantity: item.quantity,
                color: item.color
            })),
            subtotal: totals.subtotal,
            savings: totals.savings,
            tax: totals.tax,
            delivery: totals.delivery,
            total: totals.total
        }));

        dispatch(clearCart());
        router.push('/checkout/success');
    };

    return (
        <>
            <div className="px-2 mt-10 ">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                <span className="cursor-pointer hover:text-gray-900" onClick={() => router.push('/')}>Home</span>
                <FiChevronRight className="w-4 h-4" />
                <span className="text-gray-800 font-medium">Cart</span>
                <FiChevronRight className="w-4 h-4" />
                <span className="cursor-pointer hover:text-gray-900">Checkout</span>

            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-10">
                    <section>
                        <h2 className="lg:text-[24px] text-[18px] font-semibold lg:mb-6 mb-2 text-gray-900 tracking-wide">Shipping Address</h2>

                        {!isAuthenticated ? (
                            <div className="border border-gray-200 rounded-xl p-3 lg:p-4 flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
                                <span className="text-[#a1a1aa] font-medium text-[12px] lg:text-[14px] text-center lg:text-left">Add an address or login to use saved address</span>
                                <div className="flex space-x-3 w-full md:w-auto">
                                    <button onClick={() => router.push('/login')} className="flex-1 md:flex-none border border-[#1877f2] text-[#1877f2] rounded-full lg:px-16 lg:py-1 py-1.5 font-medium hover:bg-blue-50 transition-colors text-[11px] lg:text-[15px]">Login</button>
                                    <button onClick={() => router.push('/login')} className="flex-1 md:flex-none bg-[#1877f2] text-white rounded-full lg:px-10 py-1.5 font-medium hover:bg-blue-600 transition-colors w-max text-[11px] lg:text-[15px]">Add new address</button>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl p-2 lg:p-3">
                                {addresses.length > 0 ? (
                                    <>
                                        <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-3 mb-4 lg:mb-6">
                                            <div className="flex justify-between lg:items-start items-center mb-1">
                                                <h3 className="font-semibold text-gray-900 text-[15px] lg:text-[17px]">{user?.name}</h3>
                                                <button onClick={() => setIsAddressModalOpen(true)} className="text-[#1877f2] flex items-center text-[12px] lg:text-[15px] font-semibold hover:underline">
                                                    Change / Add <FiEdit className="ml-1.5 w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-1 text-[12px] lg:text-[15px] text-gray-700 max-w-3xl leading-relaxed">
                                                {selectedAddress ? (
                                                    <>
                                                        <p>{selectedAddress.address}, {selectedAddress.postal_code}</p>
                                                        <p>Phone: {selectedAddress.phone}</p>
                                                        <p>Email: {user?.email}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-orange-500">Please select or add a shipping address</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Address Selector */}
                                        <div className="flex gap-3 overflow-x-auto pb-2 mb-4 no-scrollbar">
                                            {addresses.map(addr => (
                                                <button
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`flex-shrink-0 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${selectedAddressId === addr.id 
                                                        ? 'bg-blue-50 border-[#1877f2] text-[#1877f2]' 
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                >
                                                    {addr.address.slice(0, 20)}...
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 mb-4 text-sm">No addresses found</p>
                                        <button onClick={() => setIsAddressModalOpen(true)} className="bg-[#1877f2] text-white rounded-full px-8 py-2 font-medium hover:bg-blue-600 transition-colors text-sm">Add new address</button>
                                    </div>
                                )}

                                {/* Checkbox */}
                                <label className="inline-flex items-center space-x-3 cursor-pointer group mb-1">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5 lg:w-5 lg:h-5 cursor-pointer" />
                                    <span className="text-gray-700 text-[12px] lg:text-[15px] font-medium group-hover:text-gray-900 transition-colors">Use a different billing address</span>
                                </label>
                            </div>
                        )}

                    </section>

                    <section>
                        <h2 className="lg:text-[24px] text-[18px] font-semibold mb-2 text-gray-900 tracking-wide">Shipping Method</h2>

                        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                            {/* Express Option */}
                            <div className="p-4 lg:p-6 border-b border-gray-200 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <input type="radio" name="shipping" className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" />
                                        <span className="font-medium text-[16px] lg:text-[19px] text-gray-900 group-hover:text-[#1877f2] transition-colors">Express</span>
                                    </label>
                                    <span className="bg-[#1f519b] text-white text-[11px] lg:text-[13px] px-4 lg:px-6 py-0.5 lg:py-1 rounded-tl-2xl rounded-br-2xl font-semibold">Free</span>
                                </div>
                                <div className="ml-[28px] lg:ml-[34px] text-[13px] lg:text-[15px]">
                                    <p className="text-gray-500">Estimated Shipping Time</p>
                                    <p className="text-gray-800 font-medium mt-0.5 lg:mt-1">14 April 2026 - 17 April 2026</p>
                                </div>
                            </div>

                            {/* In Store Pickup Option */}
                            <div className="p-4 lg:p-6 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <input type="radio" name="shipping" className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" defaultChecked />
                                        <span className="font-medium text-[16px] lg:text-[19px] text-gray-900 group-hover:text-[#1877f2] transition-colors">In Store Pickup</span>
                                    </label>
                                    <span className="bg-[#1f519b] text-white text-[11px] lg:text-[13px] px-4 lg:px-6 py-0.5 lg:py-1 rounded-tl-2xl rounded-br-2xl font-semibold">Free</span>
                                </div>
                                <div className="ml-[28px] lg:ml-[34px] text-[13px] lg:text-[15px]">
                                    <p className="text-gray-500">This item not available in your area</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-gray-500">Pickup location</p>
                                        <button className="text-[#1877f2] text-[13px] lg:text-[15px] font-semibold flex items-center hover:underline">
                                            Select Store <FiArrowRight className="ml-1.5 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Store Box */}
                                <div className="ml-[28px] lg:ml-[34px] mt-4 bg-[#f8f9fa] border border-gray-100 rounded-xl p-3 lg:p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-gray-900 text-[14px] lg:text-[16px]">Electra International Abdullapur, Dhaka</h3>
                                        <button className="text-[#1877f2] flex items-center text-[13px] lg:text-[15px] font-semibold hover:underline">
                                            Change <FiEdit className="ml-1.5 w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-[13px] lg:text-[15px] text-gray-700">
                                        <p>Mojidullah Matbor Market, Abdullapur Bazar, Abdullapur, Keranigonj, Dhaka</p>
                                        <p>Phone: +8801713092219</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Available Offers */}
                    <section>
                        <h2 className="lg:text-[24px] text-[18px] font-semibold lg:mb-6 mb-2 text-gray-900 tracking-wide">Available Offers</h2>
                        <div className="border border-gray-200 rounded-xl p-4 lg:p-6 bg-white">
                            <div className="inline-flex items-center space-x-2 bg-[#f8f9fa] px-4 py-2 rounded-full mb-4 lg:mb-6 text-[12px] lg:text-sm font-medium border border-gray-100">
                                <span className="text-gray-700 flex items-center"><span className="text-gray-500 mr-2 text-[16px] lg:text-[18px]"><HiOutlineTicket /></span>Coupon- <span className="font-bold text-gray-900 ml-1">EL05</span></span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                {/* Coupon */}
                                <div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" placeholder="Enter Coupon Code" className="flex-1 border border-gray-200 rounded-md px-4 py-[8px] text-[13px] lg:text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] placeholder:text-gray-300" />
                                        <button className="bg-[#1f519b] hover:bg-blue-600 text-white font-medium px-6 py-[8px] rounded-md text-[13px] lg:text-[15px] transition-colors whitespace-nowrap">Apply Coupon/Gift Code</button>
                                    </div>
                                </div>
                                {/* Reward Point */}
                                <div>
                                    <div className="flex flex-col sm:flex-row gap-3 mb-2.5">
                                        <input type="text" placeholder="Reward Point" className="flex-1 border border-gray-200 rounded-md px-4 py-[8px] text-[13px] lg:text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] placeholder:text-gray-300" />
                                        <button className="bg-[#1f519b] hover:bg-blue-600 text-white font-medium px-6 py-[8px] rounded-md text-[13px] lg:text-[15px] transition-colors whitespace-nowrap">Apply Reward</button>
                                    </div>
                                    <label className="flex items-center space-x-2 text-[11px] text-gray-400 cursor-pointer ml-1">
                                        <input type="checkbox" className="rounded border-gray-300 w-[14px] h-[14px] text-[#1877f2] focus:ring-[#1877f2]" />
                                        <span>You Have 0 Club Points Available.</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section>
                        <h2 className="lg:text-[24px] text-[18px] font-semibold lg:mb-6 mb-2 text-gray-900 tracking-wide">Payment Method</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            {/* Online Payment Gateway */}
                            <div className="p-4 lg:p-6 pb-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-5">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'Online Payment Gateway'}
                                        onChange={() => setPaymentMethod('Online Payment Gateway')}
                                        className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer"
                                    />
                                    <span className="font-medium text-[16px] lg:text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Online Payment Gateway</span>
                                </label>
                                <div className="ml-[34px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex flex-col justify-center items-center shadow-sm">
                                            <div className="flex -space-x-1.5"><div className="w-5 h-5 bg-red-500 rounded-full opacity-90"></div><div className="w-5 h-5 bg-yellow-500 rounded-full opacity-90"></div></div>
                                        </div>
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-blue-800 font-black text-[17px] italic tracking-tight">VISA</span>
                                        </div>
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-blue-500 font-bold text-[14px] tracking-tight">AMEX</span>
                                        </div>
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-teal-600 font-bold text-[10px] text-center leading-[1.1]">Nexus<br />Pay</span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-gray-400 mt-2 font-medium">Select Your Gateway</p>
                                </div>
                            </div>

                            {/* EMI Payment */}
                            <div className="p-4 lg:p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'EMI Payment'}
                                        onChange={() => setPaymentMethod('EMI Payment')}
                                        className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer"
                                    />
                                    <span className="font-medium text-[16px] lg:text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">EMI Payment (Credit Card only)</span>
                                </label>
                                <div className="ml-[28px] lg:ml-[34px] text-[13px] lg:text-[15px] space-y-1.5">
                                    <p className="text-[#0a3055] font-medium">Only applicable for orders over ৳ 10,000</p>
                                    <button className="text-[#1877f2] font-semibold hover:underline">EMI Plans</button>
                                </div>
                            </div>

                            {/* Mobile Bank Payment */}
                            <div className="p-4 lg:p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-5">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'Mobile Bank Payment'}
                                        onChange={() => setPaymentMethod('Mobile Bank Payment')}
                                        className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer"
                                    />
                                    <span className="font-medium text-[16px] lg:text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Mobile Bank Payment</span>
                                </label>
                                <div className="ml-[34px]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-pink-600 font-bold text-[18px]">bKash</span>
                                        </div>
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-orange-500 font-bold text-[18px]">Nagad</span>
                                        </div>
                                        <div className="w-[72px] h-[45px] border border-gray-100 rounded bg-[#f8f9fa] flex items-center justify-center shadow-sm">
                                            <span className="text-blue-900 font-bold text-[18px]">Upay</span>
                                        </div>
                                    </div>
                                    <p className="text-[12px] text-gray-400 mt-2 font-medium">Select Your Gateway</p>
                                </div>
                            </div>

                            {/* COD */}
                            <div className="p-4 lg:p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group flex-wrap gap-y-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'Cash On Delivery'}
                                        onChange={() => setPaymentMethod('Cash On Delivery')}
                                        className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer flex-shrink-0"
                                    />
                                    <span className="font-medium text-[16px] lg:text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Cash On Delivery</span>
                                    <span className="text-[#1877f2] text-[13px] lg:text-[15px] xl:ml-2 font-medium hover:underline cursor-pointer">(Advanced pay 10% For Order confirmation)</span>
                                    <span className="text-gray-900 text-[14px] lg:text-[16px] font-bold xl:ml-2">Free Delivery</span>
                                </label>
                            </div>

                            {/* Store Pickup */}
                            <div className="p-4 lg:p-6 pt-5 pb-8">
                                <label className="flex items-center space-x-3 cursor-pointer group flex-wrap gap-y-2">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'Store Pickup / Showroom Booking'}
                                        onChange={() => setPaymentMethod('Store Pickup / Showroom Booking')}
                                        className="w-4 h-4 lg:w-[22px] lg:h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer flex-shrink-0"
                                    />
                                    <span className="font-medium text-[16px] lg:text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Store Pickup / Showroom Booking</span>
                                    <span className="text-[#1877f2] text-[13px] lg:text-[15px] xl:ml-2 font-medium hover:underline cursor-pointer">(Advanced pay 10% For Order confirmation)</span>
                                    <span className="text-gray-900 text-[14px] lg:text-[16px] font-bold xl:ml-2">Get 5% OFF</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Note */}
                    <section>
                        <h2 className="lg:text-[24px] text-[18px] font-semibold lg:mb-6 mb-2 text-gray-900 tracking-wide">Delivery Note</h2>
                        <textarea
                            value={deliveryNote}
                            onChange={(e) => setDeliveryNote(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-4 lg:p-5 text-[13px] lg:text-[15px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] min-h-[120px] lg:min-h-[160px] resize-y bg-white"
                            placeholder="Enter your instruction message"
                        ></textarea>
                    </section>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 sticky top-[230px] self-start hidden lg:block">
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 lg:p-7 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-[18px] lg:text-[22px] font-bold flex items-center text-gray-900 tracking-tight cursor-pointer">
                                Order Total <FiChevronDown className="ml-2 w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
                            </h2>
                            <div className="flex flex-col items-end">
                                <span className="text-[20px] lg:text-[26px] font-bold text-[#1877f2] tracking-tight">
                                    {mounted ? formatCurrency(totals.total) : "৳0"}
                                </span>
                                {mounted && totals.savePercent > 0 && (
                                    <span className="bg-[#ff3b30] text-white text-[10px] lg:text-[12px] px-2 lg:px-2.5 py-0.5 lg:py-1 rounded mt-1 font-medium">Saving : {totals.savePercent}%</span>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4 mb-8">
                            {mounted && cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl items-start shadow-sm">
                                    <div className="w-[72px] h-[72px] bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-gray-100">
                                        <Image
                                            key={item.image}
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                        <div className="pr-3">
                                            <p className="text-[14px] text-gray-800 font-medium leading-[1.3]">
                                                {item.title}
                                            </p>
                                            {item.type && (
                                                <p className="text-[12px] text-gray-500 mt-1">Category: {item.type}</p>
                                            )}
                                            {(item.variant || item.color) && (
                                                <p className="text-[12px] text-gray-500 mt-0.5">Variant: {item.variant || item.color}</p>
                                            )}
                                            <p className="text-[14px] text-gray-500 mt-2">QTY : {item.quantity}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end whitespace-nowrap">
                                            <span className="text-[11px] lg:text-[13px] text-[#a1a1aa] line-through font-medium">{item.originalPrice}</span>
                                            <span className="font-bold text-[15px] lg:text-[18px] mt-0.5 text-black">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {mounted && cartItems.length === 0 && (
                                <p className="text-center text-gray-500 py-4 italic">Your cart is empty</p>
                            )}
                        </div>

                        {/* Sub-Total */}
                        <div className="pt-2">
                            <h3 className="text-[17px] lg:text-[20px] font-bold mb-4 lg:mb-5 text-gray-900">Sub -Total</h3>
                            <div className="space-y-3 lg:space-y-3.5 text-[14px] lg:text-[16px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Save</span>
                                    <span className="font-bold text-gray-900">
                                        {mounted ? formatCurrency(totals.savings) : "৳0"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Store Pickup</span>
                                    <span className="font-bold text-gray-900">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">TAX</span>
                                    <span className="font-bold text-gray-900">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-bold text-gray-900">Free/ Charge</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Coupon Code</span>
                                    <span className="font-bold text-gray-900">0</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={mounted ? cartItems.length === 0 : true}
                            className={`w-full bg-[#1877f2] hover:bg-blue-600 text-white font-semibold py-3 lg:py-4 rounded-xl mt-6 lg:mt-8 shadow-sm transition-colors text-[15px] lg:text-[17px] ${mounted && cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Place Order
                        </button>
                    </div>

                    <p className="text-[12px] text-gray-500 text-center mt-6 px-4 leading-relaxed tracking-tight">
                        By proceeding, you acknowledge and accept Electra<br />International&apos;s <span className="font-bold text-gray-700">Terms &amp; Conditions, Cancellation &amp; Refund Policy</span>, and <span className="font-bold text-gray-700">Privacy Policy</span>.
                    </p>
                </div>
            </div>
            </div>
            {/* Mobile Fixed Bottom Bar / Bottom Sheet */}
            {mounted && cartItems.length > 0 && (
                <div
                    className={`lg:hidden fixed bottom-0 left-0 w-full bg-white z-[999] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out border-t border-gray-100 ${isExpanded ? 'h-[85vh] translate-y-0' : 'h-[85px] translate-y-0'
                        }`}
                >
                    {/* Arrow Icon Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-all duration-500 z-[1001]"
                    >
                        <FiChevronDown className={`text-gray-600 text-xl transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Wrapper to handle layout in both states */}
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Summary Top Part (Always at top of the expansion) */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-50 flex-shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-medium tracking-tight">Your Order total</span>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[18px] sm:text-[22px] font-semibold text-[#1877f2] leading-none tracking-tight">
                                        {formatCurrency(totals.total)}
                                    </span>

                                    {/* Stacked Discount and Original Price */}
                                    <div className="flex flex-col justify-center leading-tight">
                                        {totals.savings > 0 && (
                                            <>
                                                <span className="text-[9px] sm:text-[10px] text-[#0eb363] font-semibold whitespace-nowrap">
                                                    {totals.savePercent}% Off
                                                </span>
                                                <span className="text-[9px] sm:text-[10px] text-gray-400 line-through whitespace-nowrap">
                                                    {formatCurrency(totals.originalSubtotal)}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Red Save Badge to the Right */}
                                    {totals.savings > 0 && (
                                        <div className="bg-[#ff3b30] text-white text-[8px] sm:text-[9px] px-2 py-0.5 rounded-tl-xl rounded-br-xl font-bold shadow-sm whitespace-nowrap">
                                            Save : {formatCurrency(totals.savings)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="bg-[#1877f2] text-white px-6 sm:px-10 py-2.5 rounded-full font-semibold text-[12px] sm:text-[15px] shadow-md active:scale-95 transition-all"
                            >
                                Place Order
                            </button>
                        </div>

                        {/* Expanded Detailed Breakdown */}
                        <div className={`flex-1 overflow-y-auto px-4 py-6 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="bg-[#f8f9fa] rounded-xl border border-gray-200 p-5 shadow-sm space-y-6">
                                <h3 className="text-center font-semibold text-[16px] text-gray-800 border-b border-gray-200 pb-3">Order Summary</h3>

                                {/* Item List */}
                                <div className="space-y-5">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-[13px] sm:text-[14px]">
                                            <div className="flex flex-col gap-0.5 max-w-[60%]">
                                                <span className="font-bold text-gray-700 leading-tight">{item.title}</span>
                                                {item.type && <span className="text-[11px] text-gray-500">Category: {item.type}</span>}
                                                {(item.variant || item.color) && <span className="text-[11px] text-gray-500">Variant: {item.variant || item.color}</span>}
                                                <span className="text-[11px] text-gray-400 font-medium"> ( {item.quantity} pcs ) </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                {parseCurrency(item.originalPrice) > parseCurrency(item.price) && (
                                                    <div className="text-[11px] text-gray-400 line-through font-medium">
                                                        {formatCurrency(parseCurrency(item.originalPrice) * item.quantity)}
                                                    </div>
                                                )}
                                                <div className="font-bold text-gray-900 text-[15px]">
                                                    {formatCurrency(parseCurrency(item.price) * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 text-[14px] font-medium text-gray-700 pt-2 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-[#ff3b30]">
                                        <span>Save</span>
                                        <span className="font-bold text-[16px]">{formatCurrency(totals.savings)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Store Pickup</span>
                                        <span className="font-bold text-black">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>TAX</span>
                                        <span className="font-bold text-black">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Delivery</span>
                                        <span className="font-bold text-black">Free/ Charge</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Coupon Code</span>
                                        <span className="font-bold text-black">0</span>
                                    </div>
                                </div>

                                <div className="pt-5 border-t border-gray-300 flex justify-between items-center">
                                    <span className="font-semibold text-[18px] text-gray-900">Your Total</span>
                                    <span className="font-bold text-[22px] text-gray-900">{formatCurrency(totals.total)}</span>
                                </div>
                            </div>
                            <p className="mt-8 text-[10px] text-gray-400 text-center leading-relaxed px-4">
                                By proceeding, you acknowledge and accept Electra International&apos;s <span className="underline">Terms &amp; Conditions</span>, <span className="underline">Cancellation &amp; Refund Policy</span>, and <span className="underline">Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleAddAddress} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Detailed Address</label>
                                <textarea
                                    required
                                    value={addressForm.address}
                                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                    placeholder="Street, House No, Area..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.phone}
                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                        placeholder="017********"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                        placeholder="1207"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="flex-1 px-6 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#1877f2] text-white px-6 h-12 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
