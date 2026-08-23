"use client"
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FiChevronRight, FiEdit, FiChevronDown, FiX, FiCheck, FiSearch, FiMapPin, FiMap } from 'react-icons/fi';
import { HiOutlineTicket } from "react-icons/hi2";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart, updateItemDetails } from '@/store/features/cart/cartSlice';
import { setLastOrder } from '@/store/features/order/orderSlice';
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Skeleton from "@/components/common/Skeleton";
import { pushToDataLayer, hashSHA256, fetchClientIP } from "@/lib/gtm";

interface Carrier {
    id: number;
    name: string;
    cost: number;
    inside_dhaka_cost: number;
    outside_dhaka_cost: number;
    transit_time: string;
    is_pickup?: boolean;
}

interface PickupPoint {
    id: number;
    name: string;
    address: string;
    phone: string;
    type?: string;
    embedded_map_link?: string;
    images?: string;
    district?: string;
    division?: string;
    area?: string;
}

let lastBeginCheckoutTime = 0;

const Checkout = () => {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cartItems = useAppSelector((state) => state.cart.items);
    const hasGiftVoucher = useMemo(() => cartItems.some((item) => item.type === "Gift Voucher"), [cartItems]);
    const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
    const [addresses, setAddresses] = useState<{ id: number; address: string; phone: string; postal_code: string; name: string; email: string; country_id?: number; country_name?: string; state_name?: string; city_name?: string }[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        postal_code: '',
        country_id: '',
        state_id: '',
        city_id: '',
        area: '',
    });

    const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
    const [thanas, setThanas] = useState<{ id: number; name: string }[]>([]);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

    const [paymentMethod, setPaymentMethod] = useState('');

    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [selectedCarrierId, setSelectedCarrierId] = useState<number | null>(null);
    const [selectedPickupPointId, setSelectedPickupPointId] = useState<number | null>(null);
    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
    const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
    const [pickupSearchQuery, setPickupSearchQuery] = useState("");
    const [pickupTypeFilter, setPickupTypeFilter] = useState("All Types");
    const [pickupDivisionFilter, setPickupDivisionFilter] = useState("All Divisions");
    const [pickupDistrictFilter, setPickupDistrictFilter] = useState("All Districts");
    const [previewPickupPointId, setPreviewPickupPointId] = useState<number | null>(null);
    const [paymentTypes, setPaymentTypes] = useState<{
        online: { id: number; name: string; thumbnail: string }[],
        offline: { id: number; heading: string; description: string }[]
    }>({ online: [], offline: [] });

    useEffect(() => {
        if (hasGiftVoucher) {
            if (paymentMethod === 'Cash On Delivery' || !paymentMethod) {
                if (paymentTypes.online && paymentTypes.online.length > 0) {
                    setPaymentMethod(paymentTypes.online[0].name);
                }
            }
        }
    }, [hasGiftVoucher, paymentMethod, paymentTypes]);

    const [deliveryNote, setDeliveryNote] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(true);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: number; code: string; discount: number; type: string; discount_type: string; min_shopping?: number; max_discount?: number; end_date?: number } | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [allCoupons, setAllCoupons] = useState<{ id: number; code: string; discount: number; type: string; discount_type: string; min_shopping?: number; max_discount?: number; end_date?: number }[]>([]);
    const [couponError, setCouponError] = useState<string | null>(null);

    const [hasFiredBeginCheckout, setHasFiredBeginCheckout] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && cartItems.length > 0 && !hasFiredBeginCheckout) {
            const now = Date.now();
            if (now - lastBeginCheckoutTime < 2000) {
                setHasFiredBeginCheckout(true);
                return;
            }
            lastBeginCheckoutTime = now;

            const subtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.price) * item.quantity), 0);
            pushToDataLayer({
                event: "begin_checkout",
                ecommerce: {
                    currency: "BDT",
                    value: subtotal,
                    coupon: appliedCoupon?.code || "",
                    items: cartItems.map(item => ({
                        id: String(item.productId),
                        item_id: String(item.productId),
                        item_name: item.title,
                        currency: "BDT",
                        price: parseCurrency(item.price),
                        item_brand: item.brand || "Samsung",
                        item_category: item.type || "Category",
                        item_variant: item.variant || item.color || "",
                        quantity: item.quantity
                    }))
                }
            });
            setHasFiredBeginCheckout(true);
        }
    }, [mounted, cartItems, appliedCoupon, hasFiredBeginCheckout]);

    const fetchAddresses = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch("/api/v2/user/shipping/address", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const payload = await response.json();
            if (payload.success) {
                setAddresses(payload.data);
                const defaultAddr = (payload.data as { id: number; set_default: number }[]).find((a) => a.set_default === 1);
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                else if (payload.data.length > 0) setSelectedAddressId(payload.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    }, [token]);

    const fetchDistricts = useCallback(async () => {
        try {
            const response = await fetch("/api/v2/districts");
            const payload = await response.json();
            if (payload.success) setDistricts(payload.data);
        } catch (error) {
            console.error("Failed to fetch districts", error);
        }
    }, []);

    const fetchCities = async (districtId: string) => {
        if (!districtId) return;
        try {
            const response = await fetch(`/api/v2/cities-by-district/${districtId}`);
            const payload = await response.json();
            if (payload.success) setThanas(payload.data);
        } catch (error) {
            console.error("Failed to fetch cities", error);
        }
    };

    const fetchAreas = async (cityId: string) => {
        if (!cityId) return;
        try {
            const response = await fetch(`/api/v2/areas-by-city/${cityId}`);
            const payload = await response.json();
            if (payload.success) setCities(payload.data);
        } catch (error) {
            console.error("Failed to fetch areas", error);
        }
    };

    useEffect(() => {
        fetchAddresses();
        fetchDistricts();
    }, [fetchAddresses, fetchDistricts]);

    const fetchCarriers = useCallback(async () => {
        try {
            const response = await fetch("/api/v2/carriers");
            const payload = await response.json();
            if (payload.success) {
                setCarriers(payload.data);
                if (payload.data.length > 0) setSelectedCarrierId(payload.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch carriers", error);
        }
    }, []);

    const fetchPickupPoints = useCallback(async () => {
        try {
            const response = await fetch("/api/v2/pickup-list");
            const payload = await response.json();
            if (payload.success) {
                setPickupPoints(payload.data.locations);
            }
        } catch (error) {
            console.error("Failed to fetch pickup points", error);
        }
    }, []);

    const fetchCoupons = useCallback(async () => {
        try {
            const response = await fetch("/api/coupon/list");
            const payload = await response.json();
            if (payload.success) setAllCoupons(payload.data);
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        }
    }, []);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError(null);
        try {
            const subtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.price) * item.quantity), 0);
            const response = await fetch("/api/coupon/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: couponCode,
                    total_amount: subtotal,
                    cart_items: cartItems.map(item => ({
                        product_id: item.productId,
                        price: parseCurrency(item.price),
                        quantity: item.quantity
                    }))
                })
            });
            const payload = await response.json();
            if (payload.success) {
                setAppliedCoupon(payload.data);
                setCouponDiscount(payload.data.discount);
                setCouponError(null);
            } else {
                setCouponError(payload.message || "Failed to apply coupon");
            }
        } catch {
            setCouponError("An error occurred while applying the coupon.");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        setCouponError(null);
    };

    const fetchPaymentTypes = useCallback(async () => {
        try {
            const response = await fetch("/api/v2/payment-types");
            const payload = await response.json();
            if (payload.success) {
                setPaymentTypes(payload.data);
                if (payload.data.online && payload.data.online.length > 0) {
                    setPaymentMethod(payload.data.online[0].name);
                } else if (payload.data.offline && payload.data.offline.length > 0) {
                    setPaymentMethod(payload.data.offline[0].heading);
                }
            }
        } catch (error) {
            console.error("Failed to fetch payment types", error);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchCarriers();
            fetchPaymentTypes();
            fetchPickupPoints();
        }
    }, [mounted, fetchCarriers, fetchPaymentTypes, fetchPickupPoints]);

    useEffect(() => {
        if (user) {
            setAddressForm(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload_body: any = { ...addressForm };
        if (!payload_body.city_id) delete payload_body.city_id;

        try {
            const response = await fetch("/api/v2/user/shipping/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload_body)
            });
            const payload = await response.json();
            if (payload.success) {
                await fetchAddresses();
                setIsAddressModalOpen(false);
                if (payload.data && payload.data.id) {
                    setSelectedAddressId(payload.data.id);
                }
                setAddressForm({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: '',
                    postal_code: '',
                    country_id: '',
                    state_id: '',
                    city_id: '',
                    area: '',
                });
            }
        } catch (error) {
            console.error("Failed to create address", error);
        }
    };

    const selectedAddress = useMemo(() =>
        (addresses as { id: number; address: string; phone: string; postal_code: string; name: string; email: string; country_id?: number; country_name?: string; state_name?: string; city_name?: string }[]).find(a => a.id === selectedAddressId),
        [addresses, selectedAddressId]);

    const filteredPickupPoints = useMemo(() => {
        let result = pickupPoints;

        if (pickupSearchQuery.trim()) {
            const text = pickupSearchQuery.trim().toLowerCase();
            result = result.filter((point) => {
                const haystack = `${point.name} ${point.address} ${point.phone} ${point.area}`.toLowerCase();
                return haystack.includes(text);
            });
        }

        if (pickupTypeFilter !== "All Types") {
            result = result.filter(s => (s.type === "service_center" ? "Service Center" : s.type === "store" ? "Brand Shop" : s.type) === pickupTypeFilter);
        }
        if (pickupDivisionFilter !== "All Divisions") {
            result = result.filter(s => s.division === pickupDivisionFilter);
        }
        if (pickupDistrictFilter !== "All Districts") {
            result = result.filter(s => s.district === pickupDistrictFilter);
        }

        return result;
    }, [pickupSearchQuery, pickupPoints, pickupTypeFilter, pickupDivisionFilter, pickupDistrictFilter]);

    const pickupFilterOptions = useMemo(() => {
        const types = new Set<string>(["All Types"]);
        const divisions = new Set<string>(["All Divisions"]);
        const districts = new Set<string>(["All Districts"]);

        pickupPoints.forEach(s => {
            const type = s.type === "service_center" ? "Service Center" : s.type === "store" ? "Brand Shop" : s.type;
            if (type) types.add(type);
            if (s.division) divisions.add(s.division);
            if (s.district) districts.add(s.district);
        });

        return {
            types: Array.from(types),
            divisions: Array.from(divisions),
            districts: Array.from(districts)
        };
    }, [pickupPoints]);

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
                            const matchedVariant = variants.find((v: { variant?: string; image?: string }) =>
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
    }, [mounted, cartItems, dispatch]);

    const totals = useMemo(() => {
        const subtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.price) * item.quantity), 0);
        const originalSubtotal = cartItems.reduce((acc, item) => acc + (parseCurrency(item.originalPrice) * item.quantity), 0);
        const savings = originalSubtotal - subtotal;
        const tax = 0; // Assuming tax is free/0 as per UI

        const carrier = carriers.find(c => c.id === selectedCarrierId);
        let delivery = 0;
        if (!hasGiftVoucher && carrier) {
            // Logic for Inside/Outside Dhaka based on District ID 1
            const isInsideDhaka = Number((selectedAddress as any)?.country_id) === 1;

            if (isInsideDhaka) {
                delivery = carrier.inside_dhaka_cost > 0 ? carrier.inside_dhaka_cost : (carrier.cost || 0);
            } else {
                delivery = carrier.outside_dhaka_cost > 0 ? carrier.outside_dhaka_cost : (carrier.cost || 0);
            }
        }

        const total = (subtotal + tax + delivery) - couponDiscount;

        return {
            subtotal,
            originalSubtotal,
            savings,
            tax,
            delivery,
            total,
            couponDiscount,
            savePercent: originalSubtotal > 0 ? Math.round((savings / originalSubtotal) * 100) : 0
        };
    }, [cartItems, carriers, selectedCarrierId, couponDiscount, selectedAddress, hasGiftVoucher]);

    const handleSelectCarrier = (carrier: Carrier) => {
        setSelectedCarrierId(carrier.id);
        const isInsideDhaka = Number((selectedAddress as any)?.country_id) === 1;
        const cost = isInsideDhaka
            ? (carrier.inside_dhaka_cost > 0 ? carrier.inside_dhaka_cost : carrier.cost)
            : (carrier.outside_dhaka_cost > 0 ? carrier.outside_dhaka_cost : carrier.cost);

        pushToDataLayer({
            event: "add_shipping_info",
            ecommerce: {
                currency: "BDT",
                value: totals.subtotal,
                shipping_tier: carrier.name,
                items: cartItems.map((item) => ({
                    id: String(item.productId),
                    item_id: String(item.productId),
                    item_name: item.title,
                    currency: "BDT",
                    price: parseCurrency(item.price),
                    item_brand: item.brand || "Samsung",
                    item_category: item.type || "Category",
                    item_variant: item.variant || item.color || "",
                    quantity: item.quantity,
                }))
            }
        });
    };

    const handleSelectPaymentMethod = (methodName: string) => {
        setPaymentMethod(methodName);

        pushToDataLayer({
            event: "add_payment_info",
            ecommerce: {
                currency: "BDT",
                value: totals.subtotal,
                payment_type: methodName,
                items: cartItems.map((item) => ({
                    id: String(item.productId),
                    item_id: String(item.productId),
                    item_name: item.title,
                    currency: "BDT",
                    price: parseCurrency(item.price),
                    item_brand: item.brand || "Samsung",
                    item_category: item.type || "Category",
                    item_variant: item.variant || item.color || "",
                    quantity: item.quantity,
                }))
            }
        });
    };

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!token) {
            alert("Please login to place order");
            return;
        }

        const selectedCarrier = carriers.find(c => c.id === selectedCarrierId);
        if (!hasGiftVoucher && !selectedCarrier) {
            alert("Please select a shipping method");
            return;
        }

        const isPickup = !hasGiftVoucher && selectedCarrier?.is_pickup;
        if (isPickup && !selectedPickupPointId) {
            alert("Please select a pickup store");
            return;
        }

        if (!hasGiftVoucher && !isPickup && !selectedAddressId) {
            alert("Please select a shipping address");
            return;
        }

        try {
            const orderPayload = {
                items: cartItems.map(item => ({
                    product_id: item.productId,
                    variation: item.variant || '',
                    price: parseCurrency(item.price),
                    quantity: item.quantity,
                    tax: 0,
                    shipping_cost: 0
                })),
                shipping_address: hasGiftVoucher
                    ? { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: 'Digital Delivery' }
                    : selectedAddress,
                shipping_type: hasGiftVoucher ? "digital" : (isPickup ? "pickup" : "home_delivery"),
                pickup_point_id: isPickup ? selectedPickupPointId : 0,
                carrier_id: hasGiftVoucher ? 0 : selectedCarrierId,
                shipping_cost: totals.delivery,
                payment_type: paymentMethod === 'Cash On Delivery' ? 'cod' : (paymentMethod === 'sslcommerz' ? 'sslcommerz' : 'online'),
                coupon_discount: couponDiscount,
                coupon_code: appliedCoupon?.code || '',
                order_from: "web"
            };

            const response = await fetch("/api/v2/order/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderPayload)
            });

            const data = await response.json();

            if (data.success || data.result) {
                const responseData = data.data || data;
                const orderId = responseData?.code || data?.code || `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                dispatch(setLastOrder({
                    orderId,
                    paymentMethod: paymentMethod,
                    deliveryDate: 'Estimated 5-7 days',
                    items: cartItems.map(item => ({ ...item })),
                    subtotal: totals.subtotal,
                    savings: totals.savings,
                    tax: totals.tax,
                    delivery: totals?.delivery,
                    couponCode: appliedCoupon?.code || '',
                    couponDiscount: totals.couponDiscount,
                    total: totals.total
                }));

                // Trigger GTM Purchase Event asynchronously to avoid blocking user flow
                (async () => {
                    try {
                        const ip = await fetchClientIP();
                        const customerEmail = selectedAddress?.email || user?.email || "";
                        const customerPhone = selectedAddress?.phone || user?.phone || "";
                        
                        // Generate SHA-256 hashed emails/phones for privacy-first Enhanced Conversions
                        const hashedEmail = customerEmail ? await hashSHA256(customerEmail) : "";
                        const hashedPhone = customerPhone ? await hashSHA256(customerPhone) : "";

                        pushToDataLayer({
                            event: "purchase",
                            ecommerce: {
                                transaction_id: orderId,
                                value: totals.total,
                                tax: totals.tax,
                                shipping: totals.delivery,
                                currency: "BDT",
                                coupon: appliedCoupon?.code || "",
                                items: cartItems.map(item => ({
                                    id: String(item.productId),
                                    item_id: String(item.productId),
                                    item_name: item.title,
                                    currency: "BDT",
                                    price: parseCurrency(item.price),
                                    item_brand: item.brand || "Samsung",
                                    item_category: item.type || "Category",
                                    item_variant: item.variant || item.color || "",
                                    quantity: item.quantity
                                }))
                            },
                            // Enhanced Conversions Fields
                            user_data: {
                                sha256_email_address: hashedEmail,
                                sha256_phone_number: hashedPhone,
                                address: {
                                    first_name: selectedAddress?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "",
                                    last_name: selectedAddress?.name?.split(" ").slice(1).join(" ") || user?.name?.split(" ").slice(1).join(" ") || "",
                                    street: selectedAddress?.address || "",
                                    city: selectedAddress?.city_name || "",
                                    region: selectedAddress?.state_name || "",
                                    postal_code: selectedAddress?.postal_code || "",
                                    country: selectedAddress?.country_name || "Bangladesh"
                                }
                            },
                            ip_address: ip
                        });
                    } catch (err) {
                        console.error("GTM Purchase logging error:", err);
                    }
                })();

                dispatch(clearCart());

                // SSLCommerz Redirect Logic
                if (paymentMethod === 'sslcommerz') {
                    try {
                        const initResponse = await fetch("/api/v2/payment/ssl-init", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ order_id: responseData.order_id || responseData.id })
                        });
                        const initData = await initResponse.json();
                        if (initData.success && initData.url) {
                            window.location.href = initData.url;
                            return;
                        } else {
                            alert(initData.message || "Failed to initialize payment gateway.");
                        }
                    } catch (error) {
                        console.error("SSLCommerz initialization failed:", error);
                        alert("An error occurred while connecting to the payment gateway.");
                    }
                }

                router.push('/checkout/success');
            } else {
                alert(data.message || "Failed to place order.");
            }
        } catch (error) {
            console.error("Order placement failed:", error);
            alert("An error occurred while placing the order.");
        }
    };

    if (!mounted) {
        return (
            <div className="mx-auto w-full py-12 px-4 space-y-12 animate-in fade-in duration-500">
                <Skeleton className="h-10 w-1/4 rounded-xl" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <Skeleton className="h-40 w-full rounded-2xl" />
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                    <div className="lg:col-span-2">
                        <Skeleton className="h-96 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const isUnderDevelopment = true; // Set to false to enable checkout page content

    if (isUnderDevelopment) {
        return (
            <div className="flex items-center justify-center min-h-[70vh] px-4 py-12 mt-12">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-xl p-8 text-center animate-fadeIn">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Website Under Development</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        The checkout feature is currently disabled for maintenance and testing. Please check back later.
                    </p>
                    <button 
                        onClick={() => router.push('/')}
                        className="inline-flex items-center justify-center bg-[#1877f2] hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="px-2 mt-12">
                {/* Breadcrumb */}
                <nav className="text-xs text-gray-400 mb-1 flex items-center space-x-1.5">
                    <span className="cursor-pointer hover:text-gray-900" onClick={() => router.push('/')}>Home</span>
                    <FiChevronRight className="w-3.5 h-3.5" />
                    <span className="text-gray-800 font-medium">Cart</span>
                    <FiChevronRight className="w-3.5 h-3.5" />
                    <span className="cursor-pointer hover:text-gray-900">Checkout</span>

                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    {/* Left Column */}
                    <div className="lg:col-span-3 flex flex-col gap-4 lg:gap-6">
                        {!hasGiftVoucher && (
                            <section>
                                <h2 className="lg:text-[18px] text-[15px] font-semibold lg:mb-3 mb-2 text-gray-900 tracking-wide">Shipping Address</h2>

                                {!isAuthenticated ? (
                                    <div className="border border-gray-200 rounded-xl p-2.5 lg:p-3 flex flex-col lg:flex-row justify-between items-center gap-3 mb-4">
                                        <span className="text-[#a1a1aa] font-medium text-[11px] lg:text-[13px] text-center lg:text-left">Add an address or login to use saved address</span>
                                        <div className="flex space-x-2.5 w-full md:w-auto">
                                            <button onClick={() => router.push('/login')} className="flex-1 md:flex-none border border-[#1877f2] text-[#1877f2] rounded-full lg:px-10 lg:py-1 py-1 font-medium hover:bg-blue-50 transition-colors text-[10px] lg:text-[13px]">Login</button>
                                            <button onClick={() => router.push('/login')} className="flex-1 md:flex-none bg-[#1877f2] text-white rounded-full lg:px-8 py-1 font-medium hover:bg-blue-600 transition-colors w-max text-[10px] lg:text-[13px]">Add new address</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-xl p-1.5 lg:p-2">
                                        {addresses.length > 0 ? (
                                            <>
                                                <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-2.5 mb-3 lg:mb-4">
                                                    <div className="flex justify-between lg:items-start items-center mb-1">
                                                        <h3 className="font-semibold text-gray-900 text-[13px] lg:text-[15px]">
                                                            {((selectedAddress as unknown) as { name?: string })?.name || user?.name}
                                                        </h3>
                                                        <button onClick={() => setIsAddressModalOpen(true)} className="text-[#1877f2] flex items-center text-[11px] lg:text-[13px] font-semibold hover:underline">
                                                            Change / Add <FiEdit className="ml-1 w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-0.5 text-[11px] lg:text-[13px] text-gray-700 max-w-3xl leading-relaxed">
                                                        {selectedAddress ? (
                                                            <>
                                                                <p>
                                                                    {(selectedAddress as any).address}, {(selectedAddress as any).city_name ? `${(selectedAddress as any).city_name}, ` : ''}{(selectedAddress as any).state_name}, {(selectedAddress as any).country_name}, {(selectedAddress as any).postal_code}
                                                                </p>
                                                                <p>Phone: {(selectedAddress as any).phone}</p>
                                                                <p>Email: {(selectedAddress as any).email || user?.email}</p>
                                                            </>
                                                        ) : (
                                                            <p className="text-orange-500">Please select or add a shipping address</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Address Selector */}
                                                <div className="flex gap-2 overflow-x-auto pb-1.5 mb-3 no-scrollbar">
                                                    {(addresses as { id: number; address: string }[]).map(addr => (
                                                        <button
                                                            key={addr.id}
                                                            onClick={() => setSelectedAddressId(addr.id)}
                                                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${selectedAddressId === addr.id
                                                                ? 'bg-blue-50 border-[#1877f2] text-[#1877f2]'
                                                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                        >
                                                            {addr.address.slice(0, 18)}...
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-gray-500 mb-3 text-xs">No addresses found</p>
                                                <button onClick={() => setIsAddressModalOpen(true)} className="bg-[#1877f2] text-white rounded-full px-6 py-1.5 font-medium hover:bg-blue-600 transition-colors text-xs">Add new address</button>
                                            </div>
                                        )}

                                        {/* Checkbox */}
                                        <label className="inline-flex items-center space-x-2 cursor-pointer group">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-3 h-3 lg:w-4 lg:h-4 cursor-pointer" />
                                            <span className="text-gray-700 text-[11px] lg:text-[13px] font-medium group-hover:text-gray-900 transition-colors">Use a different billing address</span>
                                        </label>
                                    </div>
                                )}

                            </section>
                        )}

                        {!hasGiftVoucher && (
                            <section>
                                <h2 className="lg:text-[18px] text-[15px] font-semibold mb-3 text-gray-900 tracking-wide">Shipping Method</h2>
                                <div className="border border-gray-200 rounded-xl bg-white overflow-hidden mb-4">
                                    {carriers.map((carrier) => (
                                        <div key={carrier.id} className="p-3 lg:p-4 border-b border-gray-100 last:border-0">
                                            <label className="flex items-center space-x-2.5 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="carrier"
                                                    checked={selectedCarrierId === carrier.id}
                                                    onChange={() => handleSelectCarrier(carrier)}
                                                    className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#1877f2] focus:ring-[#1877f2] cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-semibold text-[14px] lg:text-[16px] text-gray-800 group-hover:text-[#1877f2] transition-colors">{carrier.name}</span>
                                                        <span className={`px-3 py-0.5 rounded-full text-[10px] lg:text-[11px] font-bold ${carrier.cost === 0 ? 'bg-[#1E5AA4] text-white' : 'text-gray-900'}`}>
                                                            {(() => {
                                                                if (carrier.cost === 0) return 'Free';
                                                                const isInsideDhaka = Number((selectedAddress as any)?.country_id) === 1;
                                                                const cost = isInsideDhaka
                                                                    ? (carrier.inside_dhaka_cost > 0 ? carrier.inside_dhaka_cost : carrier.cost)
                                                                    : (carrier.outside_dhaka_cost > 0 ? carrier.outside_dhaka_cost : carrier.cost);
                                                                return formatCurrency(cost);
                                                            })()}
                                                        </span>
                                                    </div>
                                                    {!carrier.is_pickup && <p className="text-[11px] lg:text-[12px] text-gray-500 mt-0.5">Estimated delivery: {carrier.transit_time}</p>}
                                                </div>
                                            </label>

                                            {carrier.is_pickup && selectedCarrierId === carrier.id && (
                                                <div className="mt-3 ml-[24px] lg:ml-[28px]">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-gray-600 font-medium text-xs lg:text-sm">Pickup location</span>
                                                        <button
                                                            onClick={() => setIsPickupModalOpen(true)}
                                                            className="text-[#1877f2] flex items-center gap-1 text-xs lg:text-sm font-semibold hover:underline"
                                                        >
                                                            Select Store <FiChevronRight />
                                                        </button>
                                                    </div>

                                                    {selectedPickupPointId ? (
                                                        <div className="bg-gray-50 rounded-xl p-3 lg:p-4 border border-gray-100">
                                                            <div className="flex justify-between items-start mb-1.5">
                                                                <h3 className="font-bold text-gray-900 text-xs lg:text-sm">{pickupPoints.find(p => p.id === selectedPickupPointId)?.name}</h3>
                                                                <button onClick={() => setIsPickupModalOpen(true)} className="text-[#1877f2] flex items-center gap-1 text-[11px] lg:text-xs font-medium">
                                                                    Change <FiEdit className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                                {pickupPoints.find(p => p.id === selectedPickupPointId)?.address}
                                                            </p>
                                                            <p className="text-xs text-gray-900 font-semibold mt-1.5">
                                                                Phone: {pickupPoints.find(p => p.id === selectedPickupPointId)?.phone}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 text-center">
                                                            <p className="text-gray-500 text-xs italic">Please select a pickup store</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {carriers.length === 0 && (
                                        <p className="p-4 text-center text-gray-500 italic text-xs">No shipping methods available.</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Available Offers */}
                        <section className="mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="lg:text-[18px] text-[15px] font-semibold text-gray-900 tracking-wide">Available Offers</h2>
                                <button
                                    onClick={() => setIsCouponModalOpen(true)}
                                    className="text-[#1877f2] font-semibold text-[12px] lg:text-[14px] hover:underline"
                                >
                                    See All Coupon
                                </button>
                            </div>
                            <div className="border border-gray-200 rounded-xl bg-white p-3 lg:p-4 shadow-sm">
                                {appliedCoupon && (
                                    <div className="mb-3 flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg p-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-blue-600 rounded-full p-1 text-white">
                                                <HiOutlineTicket className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-blue-900">Coupon- {appliedCoupon.code}</p>
                                                <p className="text-[11px] text-blue-700">Discount of {formatCurrency(couponDiscount)} applied</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500 hover:text-red-700 transition-colors p-0.5"
                                            title="Remove Coupon"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Enter Coupon Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            disabled={!!appliedCoupon}
                                            className={`w-full h-[40px] lg:h-[44px] px-3.5 rounded-lg border ${couponError ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#1877f2] focus:border-transparent outline-none transition-all text-[13px] lg:text-[14px] disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                        />
                                        {couponError && (
                                            <p className="text-red-500 text-[10px] mt-0.5 absolute left-0 -bottom-4">{couponError}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                                        className={`h-[40px] lg:h-[44px] px-6 rounded-lg font-bold text-[13px] lg:text-[14px] transition-all min-w-[150px] ${appliedCoupon ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#1877f2] hover:bg-[#1565c0] text-white shadow-md shadow-blue-100'}`}
                                    >
                                        {appliedCoupon ? 'Remove Coupon' : 'Apply Coupon/Gift Code'}
                                    </button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="lg:text-[18px] text-[15px] font-semibold lg:mb-3 mb-2 text-gray-900 tracking-wide">Payment Method</h2>
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                {/* Online Payments */}
                                {(paymentTypes.online as { id: number; name: string; frontend_name?: string; image?: string }[]).map((method) => (
                                    <div key={method.id} className="p-3 lg:p-4 border-b border-gray-100">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="flex items-center space-x-2.5 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={paymentMethod === method.name}
                                                    onChange={() => handleSelectPaymentMethod(method.name)}
                                                    className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#1877f2] focus:ring-[#1877f2] cursor-pointer"
                                                />
                                                <span className="font-medium text-[13px] lg:text-[15px] text-gray-800 group-hover:text-[#1877f2] transition-colors">{method.frontend_name || method.name}</span>
                                            </label>
                                            {method.image && (
                                                <div className="ml-[24px] lg:ml-[28px]">
                                                    <Image src={method.image} alt={method.frontend_name || method.name} width={220} height={40} className="h-auto object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Offline/Manual Payments (including COD) */}
                                {(paymentTypes.offline as { id: number; heading: string; description: string }[]).map((method) => (
                                    <div key={method.id} className="p-3 lg:p-4 border-b border-gray-100 last:border-0">
                                        <label className={`flex items-center space-x-2.5 cursor-pointer group flex-wrap gap-y-1 ${hasGiftVoucher && method.heading === 'Cash On Delivery' ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                disabled={hasGiftVoucher && method.heading === 'Cash On Delivery'}
                                                checked={paymentMethod === method.heading}
                                                onChange={() => {
                                                    if (!(hasGiftVoucher && method.heading === 'Cash On Delivery')) {
                                                        handleSelectPaymentMethod(method.heading);
                                                    }
                                                }}
                                                className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] text-[#1877f2] focus:ring-[#1877f2] cursor-pointer disabled:cursor-not-allowed"
                                            />
                                            <span className="font-medium text-[13px] lg:text-[15px] text-gray-800 group-hover:text-[#1877f2] transition-colors">{method.heading}</span>
                                            {method.heading === 'Cash On Delivery' && (
                                                <span className="text-[#1877f2] text-[11px] lg:text-[12px] xl:ml-2 font-medium"></span>
                                            )}
                                        </label>
                                        <div className="ml-[24px] lg:ml-[28px] mt-1.5 text-[11px] lg:text-[12px] text-gray-500">
                                            <div dangerouslySetInnerHTML={{ __html: method.description }}></div>
                                        </div>
                                    </div>
                                ))}

                                {paymentTypes.online.length === 0 && paymentTypes.offline.length === 0 && (
                                    <p className="p-4 text-center text-gray-500 italic text-xs">No payment methods available.</p>
                                )}
                            </div>
                        </section>

                        {/* Delivery Note */}
                        <section>
                            <h2 className="lg:text-[18px] text-[15px] font-semibold lg:mb-3 mb-2 text-gray-900 tracking-wide">Delivery Note</h2>
                            <textarea
                                value={deliveryNote}
                                onChange={(e) => setDeliveryNote(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 lg:p-4 text-[12px] lg:text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] min-h-[80px] lg:min-h-[100px] resize-y bg-white"
                                placeholder="Enter your instruction message"
                            ></textarea>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 sticky top-[120px] self-start hidden lg:block">
                        <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-[15px] lg:text-[17px] font-bold flex items-center text-gray-900 tracking-tight cursor-pointer">
                                    Order Total <FiChevronDown className="ml-1.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                                </h2>
                                <div className="flex flex-col items-end">
                                    <span className="text-[18px] lg:text-[22px] font-bold text-[#1877f2] tracking-tight">
                                        {mounted ? formatCurrency(totals.total) : "৳0"}
                                    </span>
                                    {mounted && totals.savePercent > 0 && (
                                        <span className="bg-[#ff3b30] text-white text-[9px] lg:text-[11px] px-2 py-0.5 rounded mt-0.5 font-medium">Saving : {totals.savePercent}%</span>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2 mb-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                {mounted && cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-2.5 bg-white border border-gray-200 rounded-xl items-start shadow-sm">
                                        <div className="w-[56px] h-[56px] bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-gray-100">
                                            <Image
                                                key={item.image}
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-contain p-1"
                                            />
                                        </div>
                                        <div className="flex-1 flex justify-between">
                                            <div className="pr-2 min-w-0">
                                                <p className="text-[12px] text-gray-800 font-medium leading-[1.3] truncate">
                                                    {item.title}
                                                </p>
                                                {item.type && (
                                                    <p className="text-[10px] text-gray-500 mt-0.5">Category: {item.type}</p>
                                                )}
                                                {(item.variant || item.color) && (
                                                    <p className="text-[10px] text-gray-500 mt-0.5">Variant: {item.variant || item.color}</p>
                                                )}
                                                <p className="text-[11px] text-gray-500 mt-1">QTY : {item.quantity}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end whitespace-nowrap flex-shrink-0 pl-1">
                                                {parseCurrency(item.originalPrice) > parseCurrency(item.price) && (
                                                    <span className="text-[9px] lg:text-[11px] text-[#a1a1aa] line-through font-medium">{item.originalPrice}</span>
                                                )}
                                                <span className="font-bold text-[13px] lg:text-[15px] mt-0.5 text-black">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {mounted && cartItems.length === 0 && (
                                    <p className="text-center text-gray-500 py-3 italic text-xs">Your cart is empty</p>
                                )}
                            </div>

                            {/* Sub-Total */}
                            <div className="pt-1.5 border-t border-gray-200">
                                <h3 className="text-[14px] lg:text-[16px] font-bold mb-2 lg:mb-3 text-gray-900">Sub -Total</h3>
                                <div className="space-y-2 lg:space-y-2.5 text-[12px] lg:text-[14px]">
                                    {totals.savings > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Save</span>
                                            <span className="font-bold text-gray-900">
                                                {formatCurrency(totals.savings)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery</span>
                                        <span className="font-bold text-gray-900">{totals.delivery > 0 ? formatCurrency(totals.delivery) : 'Free'}</span>
                                    </div>
                                    {totals.couponDiscount > 0 && (
                                        <div className="flex justify-between text-green-600 animate-fadeIn">
                                            <span className="font-medium">Coupon Discount</span>
                                            <span className="font-bold">- {formatCurrency(totals.couponDiscount)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions Checkbox */}
                            <div className="mt-4 mb-3 flex items-start space-x-2.5 cursor-pointer group" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                                <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${agreedToTerms ? 'bg-[#1877f2] border-[#1877f2]' : 'bg-white border-gray-300'}`}>
                                    {agreedToTerms && <span className="text-white text-[8px]">✓</span>}
                                </div>
                                <p className="text-[14px] text-gray-900 font-poppins leading-relaxed select-none">
                                    By proceeding, you acknowledge and accept Electra International&apos;s{" "}
                                    <Link href="/policy/terms" className="font-bold text-[#1877f2] hover:text-blue-700 underline" onClick={(e) => e.stopPropagation()}>
                                        Terms &amp; Conditions
                                    </Link>
                                    ,{" "}
                                    <Link href="/policy/cancellation-refund" className="font-bold text-[#1877f2] hover:text-blue-700 underline" onClick={(e) => e.stopPropagation()}>
                                        Cancellation &amp; Refund Policy
                                    </Link>
                                    , and{" "}
                                    <Link href="/policy/privacy" className="font-bold text-[#1877f2] hover:text-blue-700 underline" onClick={(e) => e.stopPropagation()}>
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={cartItems.length === 0 || !agreedToTerms}
                                className={`w-full bg-[#1877f2] hover:bg-blue-600 text-white font-semibold py-2 lg:py-2.5 rounded-xl shadow-sm transition-colors text-[13px] lg:text-[14px] ${(cartItems.length === 0 || !agreedToTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Fixed Bottom Bar / Bottom Sheet */}
            {mounted && cartItems.length > 0 && (
                <div
                    className={`lg:hidden fixed bottom-0 left-0 w-full bg-white z-[999] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out border-t border-gray-100 ${isExpanded ? 'h-[80vh] translate-y-0' : 'h-[75px] translate-y-0'
                        }`}
                >
                    {/* Arrow Icon Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md cursor-pointer active:scale-90 transition-all duration-500 z-[1001]"
                    >
                        <FiChevronDown className={`text-gray-600 text-lg transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Wrapper to handle layout in both states */}
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Summary Top Part (Always at top of the expansion) */}
                        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-50 flex-shrink-0">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-500 font-medium tracking-tight">Your Order total</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px] sm:text-[18px] font-semibold text-[#1877f2] leading-none tracking-tight">
                                        {formatCurrency(totals.total)}
                                    </span>

                                    {/* Stacked Discount and Original Price */}
                                    <div className="flex flex-col justify-center leading-tight">
                                        {totals.savings > 0 && (
                                            <>
                                                <span className="text-[8px] sm:text-[9px] text-[#0eb363] font-semibold whitespace-nowrap">
                                                    {totals.savePercent}% Off
                                                </span>
                                                <span className="text-[8px] sm:text-[9px] text-gray-400 line-through whitespace-nowrap">
                                                    {formatCurrency(totals.originalSubtotal)}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Red Save Badge to the Right */}
                                    {totals.savings > 0 && (
                                        <div className="bg-[#ff3b30] text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-tl-lg rounded-br-lg font-bold shadow-sm whitespace-nowrap">
                                            Save : {formatCurrency(totals.savings)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!agreedToTerms}
                                className={`bg-[#1877f2] text-white px-5 sm:px-8 py-2 rounded-full font-semibold text-[11px] sm:text-[13px] shadow-md active:scale-95 transition-all ${!agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Place Order
                            </button>
                        </div>

                        {/* Expanded Detailed Breakdown */}
                        <div className={`flex-1 overflow-y-auto px-3 py-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <div className="bg-[#f8f9fa] rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
                                <h3 className="text-center font-semibold text-[14px] text-gray-800 border-b border-gray-200 pb-2">Order Summary</h3>

                                {/* Item List */}
                                <div className="space-y-3">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-[12px] sm:text-[13px]">
                                            <div className="flex flex-col gap-0.5 max-w-[60%]">
                                                <span className="font-bold text-gray-700 leading-tight truncate">{item.title}</span>
                                                {item.type && <span className="text-[10px] text-gray-500">Category: {item.type}</span>}
                                                {(item.variant || item.color) && <span className="text-[10px] text-gray-500">Variant: {item.variant || item.color}</span>}
                                                <span className="text-[10px] text-gray-400 font-medium"> ( {item.quantity} pcs ) </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end whitespace-nowrap">
                                                {parseCurrency(item.originalPrice) > parseCurrency(item.price) && (
                                                    <div className="text-[10px] text-gray-400 line-through font-medium">
                                                        {formatCurrency(parseCurrency(item.originalPrice) * item.quantity)}
                                                    </div>
                                                )}
                                                <div className="font-bold text-gray-900 text-[13px]">
                                                    {formatCurrency(parseCurrency(item.price) * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 text-[12px] font-medium text-gray-700 pt-2 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-[#ff3b30]">
                                        <span>Save</span>
                                        <span className="font-bold text-[14px]">{formatCurrency(totals.savings)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Store Pickup</span>
                                        <span className="font-bold text-black">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Delivery</span>
                                        <span className="font-bold text-black">{totals.delivery > 0 ? formatCurrency(totals.delivery) : 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Coupon Code</span>
                                        <span className="font-bold text-black">0</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
                                    <span className="font-semibold text-[15px] text-gray-900">Your Total</span>
                                    <span className="font-bold text-[18px] text-gray-900">{formatCurrency(totals.total)}</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-start space-x-2.5 cursor-pointer group px-2 pb-6" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                                <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${agreedToTerms ? 'bg-[#1877f2] border-[#1877f2]' : 'bg-white border-gray-300'}`}>
                                    {agreedToTerms && <span className="text-white text-[8px]">✓</span>}
                                </div>
                                <p className="text-[10px] text-gray-500 leading-relaxed select-none">
                                    By proceeding, you acknowledge and accept Electra International&apos;s <span className="underline">Terms &amp; Conditions</span>, <span className="underline">Cancellation &amp; Refund Policy</span>, and <span className="underline">Privacy Policy</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h3 className="text-xl font-bold text-gray-800">Shipping Details</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="text-2xl">×</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddAddress} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                            {/* Contact Person Section */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Person</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Full Name<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.name}
                                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                            placeholder="Enter full name"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Phone Number<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                            placeholder="+88801**********"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">E-Mail Address<span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            value={addressForm.email}
                                            onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                                            placeholder="Enter email address"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address Section */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-4">Shipping address</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Enter House/Street/Road<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.address}
                                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                            placeholder="Enter house- street- road"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">District<span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={addressForm.country_id}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setAddressForm({ ...addressForm, country_id: val, state_id: '', city_id: '' });
                                                        fetchCities(val);
                                                    }}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none appearance-none"
                                                >
                                                    <option value="">Select District</option>
                                                    {districts.map((d: { id: number; name: string }) => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">City<span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={addressForm.state_id}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setAddressForm({ ...addressForm, state_id: val, city_id: '' });
                                                        fetchAreas(val);
                                                    }}
                                                    disabled={!addressForm.country_id}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">Select City</option>
                                                    {thanas.map((t: { id: number; name: string }) => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Thana / Area (Optional)</label>
                                        <div className="relative">
                                            <select
                                                value={addressForm.city_id}
                                                onChange={(e) => setAddressForm({ ...addressForm, city_id: e.target.value })}
                                                disabled={!addressForm.state_id}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none appearance-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select Thana / Area</option>
                                                {cities.map((c: { id: number; name: string }) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Postal Code<span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={addressForm.postal_code}
                                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                            placeholder="Enter code"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#1877f2] text-white h-14 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 text-lg"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Coupon Modal */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-[20px] lg:text-[24px] font-bold text-gray-900">All Coupons</h3>
                                <p className="text-[14px] text-gray-500 mt-1">Select and copy a code to apply</p>
                            </div>
                            <button onClick={() => setIsCouponModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <FiX className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allCoupons.length > 0 ? (
                                    allCoupons.map((coupon) => (
                                        <div key={coupon.id} className="relative group overflow-hidden rounded-xl border border-dashed border-blue-200 bg-blue-50/30 p-5 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                                            onClick={() => {
                                                setCouponCode(coupon.code);
                                                setIsCouponModalOpen(false);
                                            }}
                                        >
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-600/10 rounded-bl-3xl flex items-center justify-center">
                                                <HiOutlineTicket className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="pr-8">
                                                <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded text-[12px] font-bold mb-3 uppercase tracking-wider">
                                                    {coupon.type.replace('_', ' ')}
                                                </span>
                                                <h4 className="text-[18px] font-bold text-gray-900 mb-1">{coupon.code}</h4>
                                                <p className="text-[14px] text-blue-800 font-medium mb-3">
                                                    {coupon.discount_type === 'percent' ? `${coupon.discount}% OFF` : `৳${formatCurrency(coupon.discount)} OFF`}
                                                </p>
                                                <div className="space-y-1">
                                                    <p className="text-[12px] text-gray-500 flex items-center">
                                                        <FiCheck className="w-3 h-3 mr-1 text-green-500" /> Min. Buy: ৳{formatCurrency(coupon.min_shopping || 0)}
                                                    </p>
                                                    {(coupon.max_discount || 0) > 0 && (
                                                        <p className="text-[12px] text-gray-500 flex items-center">
                                                            <FiCheck className="w-3 h-3 mr-1 text-green-500" /> Max Discount: ৳{formatCurrency(coupon.max_discount || 0)}
                                                        </p>
                                                    )}
                                                    {coupon.end_date && (
                                                        <p className="text-[12px] text-gray-400 mt-2 italic">Valid till: {new Date(coupon.end_date * 1000).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-blue-100/50 flex justify-between items-center">
                                                <span className="text-[12px] font-semibold text-blue-600 group-hover:underline">Click to use</span>
                                                <FiChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-10 text-center">
                                        <HiOutlineTicket className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400">No available coupons at this time.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isPickupModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-[1000px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-[20px] lg:text-[24px] font-bold text-gray-900">Select Store Location</h3>
                            <button onClick={() => setIsPickupModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <FiX className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-4 bg-gray-50 border-b border-gray-100 space-y-4">
                            {/* Search bar top full width */}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Enter - district- thana etc...."
                                    value={pickupSearchQuery}
                                    onChange={(e) => setPickupSearchQuery(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 text-sm focus:border-[#1877f2] outline-none shadow-sm"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#001B33] p-2 rounded text-white">
                                    <FiSearch size={18} />
                                </div>
                            </div>

                            {/* Filters below search */}
                            <div className="flex flex-col lg:flex-row gap-3">
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    <select value={pickupTypeFilter} onChange={(e) => setPickupTypeFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#1877f2]">
                                        {pickupFilterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <select value={pickupDivisionFilter} onChange={(e) => setPickupDivisionFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#1877f2]">
                                        {pickupFilterOptions.divisions.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <select value={pickupDistrictFilter} onChange={(e) => setPickupDistrictFilter(e.target.value)} className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none focus:border-[#1877f2]">
                                        {pickupFilterOptions.districts.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <button className="bg-[#1877f2] text-white rounded-lg px-6 h-10 text-xs font-bold flex items-center justify-center gap-2">
                                    <FiMapPin /> Search Locations
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {filteredPickupPoints.map(point => {
                                    const isPreviewed = previewPickupPointId === point.id;
                                    return (
                                        <div
                                            key={point.id}
                                            onClick={() => setPreviewPickupPointId(point.id)}
                                            className={`border rounded-xl p-4 relative group transition-all cursor-pointer ${isPreviewed ? 'border-[#1877f2] bg-blue-50/30' : 'border-gray-200 hover:border-[#1877f2]'}`}
                                        >
                                            <div className="absolute right-0 top-0 h-9 w-9 overflow-hidden">
                                                <div className="absolute right-[-10px] top-[8px] rotate-45 bg-[#1f68bf] px-4 py-[1px] text-[8px] font-semibold uppercase tracking-wide text-white">
                                                    {point.type?.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">{point.name}</h4>
                                            <p className="text-xs text-gray-600 mb-2">{point.address}</p>
                                            <p className="text-xs text-gray-900 font-semibold mb-3">Phone: {point.phone}</p>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPickupPointId(point.id);
                                                        setIsPickupModalOpen(false);
                                                    }}
                                                    className="flex-1 h-9 bg-[#1877f2] text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                                                >
                                                    Select this store
                                                </button>
                                                <button
                                                    disabled
                                                    className="flex-1 h-9 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed"
                                                >
                                                    Available this showroom
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredPickupPoints.length === 0 && (
                                    <div className="py-20 text-center text-gray-400">No stores found.</div>
                                )}
                            </div>
                            <div className="w-full lg:w-[450px] bg-gray-100 p-4 border-l border-gray-100 hidden lg:block">
                                <div className="rounded-xl overflow-hidden border border-gray-200 h-full bg-white relative">
                                    {(() => {
                                        const point = pickupPoints.find(p => p.id === previewPickupPointId) || filteredPickupPoints[0];
                                        if (point) {
                                            if (point.embedded_map_link) {
                                                const isIframeTag = point.embedded_map_link.includes('<iframe');
                                                if (isIframeTag) {
                                                    return (
                                                        <div
                                                            className="h-full w-full [&>iframe]:w-full [&>iframe]:h-full"
                                                            dangerouslySetInnerHTML={{
                                                                __html: point.embedded_map_link.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"')
                                                            }}
                                                        />
                                                    );
                                                }
                                                return (
                                                    <iframe
                                                        src={point.embedded_map_link}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                                );
                                            }
                                            return (
                                                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                    <FiMapPin className="w-12 h-12 text-gray-200 mb-4" />
                                                    <p className="text-gray-400 text-sm italic">No map link available for {point.name}</p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                <FiMap className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-400 text-sm italic">Select a store to view its location</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
