"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { BsGearWideConnected } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateQuantity, removeFromCart } from "@/store/features/cart/cartSlice";
import { formatCurrency, parseCurrency } from "@/lib/currencyUtils";

import PeopleAlsoBought from "@/components/cart/PeopleAlsoBought";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cartItems = useAppSelector(state => state.cart.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subTotal = cartItems.reduce((acc, item) => {
    return acc + parseCurrency(item.price) * item.quantity;
  }, 0);

  const originalTotal = cartItems.reduce((acc, item) => {
    const origPrice = item.originalPrice ? parseCurrency(item.originalPrice) : parseCurrency(item.price);
    return acc + origPrice * item.quantity;
  }, 0);

  const totalSavings = originalTotal > subTotal ? originalTotal - subTotal : 0;
  const deliveryCharge = 0; // Configurable if needed
  const finalTotal = subTotal + deliveryCharge;

  return (
    <div className="flex flex-col gap-4 2xl:gap-5 mt-6 lg:mt-10 2xl:mt-20 text-sm lg:text-base">
      {/* Breadcrumbs */}
      <div className="flex items-center text-[10px] lg:text-[11px] 2xl:text-[13px] text-gray-500 font-medium whitespace-nowrap overflow-x-auto no-scrollbar py-1">
        <Link href="/" className="hover:text-black transition-colors flex-shrink-0">Home</Link>
        <BiChevronRight className="text-[12px] lg:text-[13px] 2xl:text-[15px] mx-1 flex-shrink-0" />
        <Link href="/products" className="hover:text-black transition-colors flex-shrink-0">Products</Link>
        <BiChevronRight className="text-[12px] lg:text-[13px] 2xl:text-[15px] mx-1 flex-shrink-0" />
        <span className="text-black font-semibold flex-shrink-0">Cart</span>
      </div>

      {/* EMI Banner */}
      <div className="bg-gray-100 py-2.5 lg:py-3 2xl:py-4 px-4 rounded-[4px] flex items-center justify-center gap-2 text-[12px] sm:text-[13px] lg:text-[14px] 2xl:text-[16px] font-medium text-gray-800 text-center">
        <span className="text-[14px] lg:text-[16px] 2xl:text-[18px]">🛍️</span> Enjoy 0% EMI on orders above ৳ 10,000! and get Up to 36 EMI Offer
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-2">
        {/* Left Column - Cart Items */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <div className="flex items-baseline gap-2 mb-3 lg:mb-4">
            <h1 className="text-[20px] lg:text-[22px] 2xl:text-[26px] font-bold text-black">Shopping Cart</h1>
            <span className="text-[11px] lg:text-[12px] 2xl:text-[13px] text-gray-500 font-medium">({mounted ? cartItems.length : 0}) Items</span>
          </div>

          {!mounted || cartItems.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <p className="text-lg">Your cart is empty.</p>
              <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">Continue Shopping</Link>
            </div>
          ) : (
            <>
              {/* Table Header - Only visible on md+ */}
              <div className="hidden md:grid grid-cols-[3.5fr_1.2fr_1.5fr] bg-[#f7f7f7] bg-opacity-80 py-2 lg:py-2.5 px-4 rounded-[4px] text-[12px] lg:text-[13px] 2xl:text-[14px] font-semibold text-black">
                <div>Product</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Price</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="border-b py-4 lg:py-5 flex flex-col md:grid md:grid-cols-[3.5fr_1.2fr_1.5fr] gap-4 md:items-center">
                  {/* Product Info */}
                  <div className="flex gap-3 lg:gap-4 items-start w-full md:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 2xl:w-28 2xl:h-28 relative flex-shrink-0 border border-gray-200 rounded p-1 bg-white flex items-center justify-center overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] lg:text-[12px] 2xl:text-[13px] leading-tight">
                      <div className="font-bold text-[10px] lg:text-[11px] 2xl:text-[12px] text-black">
                        {item.brand || "BRAND"}
                      </div>
                      <div className="font-semibold text-[13px] lg:text-[14px] 2xl:text-[17px] leading-snug text-black mt-0.5">
                        {item.title}
                      </div>
                      <div className="text-gray-500 mt-1 lg:mt-1.5 text-[10px] lg:text-[11px] 2xl:text-[13px]">
                        {item.type && <span>Type: {item.type} | </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="text-gray-500 text-[10px] lg:text-[11px] 2xl:text-[13px]">
                        {item.weight && <span>Weight: {item.weight}</span>}
                      </div>
                      <div className="flex items-center gap-3 lg:gap-4 mt-2 font-medium flex-wrap">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
                          <FiHeart className="text-[12px] 2xl:text-[14px]" /> Save For Later
                        </button>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="flex items-center gap-1 text-[#f23333] hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 className="text-[12px] 2xl:text-[14px]" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price wrapper for mobile */}
                  <div className="flex items-end md:items-center justify-between w-full md:w-auto mt-2 md:mt-0 md:contents">
                    {/* Quantity */}
                    <div className="flex justify-start md:justify-center items-center">
                      <div className="flex border border-gray-400 rounded-sm overflow-hidden h-8 w-12 lg:h-8 lg:w-14 2xl:h-9 2xl:w-16 bg-white">
                        <input
                          type="text"
                          value={item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                          readOnly
                          className="w-full text-center text-[12px] lg:text-[13px] 2xl:text-[15px] font-bold border-r border-gray-400 outline-none p-0 text-black bg-white"
                        />
                        <div className="flex flex-col w-[20px] lg:w-[22px] 2xl:w-[24px] flex-shrink-0 bg-transparent">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, newQuantity: item.quantity - 1 }))}
                            className="h-1/2 flex items-center justify-center border-b border-gray-400 text-gray-600 hover:bg-gray-100 leading-none text-[12px] 2xl:text-[14px] bg-white"
                          >
                            -
                          </button>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, newQuantity: item.quantity + 1 }))}
                            className="h-1/2 flex items-center justify-center text-gray-600 hover:bg-gray-100 leading-none text-[12px] 2xl:text-[14px] bg-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end gap-[1px] lg:gap-[3px] text-right">
                      <div className="font-bold text-[#1a83ff] text-[16px] lg:text-[17px] 2xl:text-[20px]">
                        {formatCurrency(parseCurrency(item.price) * item.quantity)}
                      </div>
                      {item.originalPrice && parseCurrency(item.originalPrice) > parseCurrency(item.price) && (
                        <div className="text-gray-400 text-[10px] lg:text-[11px] 2xl:text-[13px] line-through font-medium">
                          {formatCurrency(parseCurrency(item.originalPrice) * item.quantity)}
                        </div>
                      )}
                      {item.discountPercent && (
                        <div className="text-[#0eb363] font-bold text-[10px] 2xl:text-[12px]">
                          {item.discountPercent}
                        </div>
                      )}
                      {item.saveAmount && (
                        <div className="bg-[#f04848] text-white text-[9px] lg:text-[10px] 2xl:text-[12px] px-2 2xl:px-2.5 py-[2px] 2xl:py-[3px] rounded-tl-2xl rounded-br-2xl font-medium mt-[2px] leading-tight shadow-sm tracking-wide">
                          {item.saveAmount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Motor Warranty Banner */}
          <div className="mt-4 lg:mt-5 bg-[#f5f5f5] rounded-[4px] py-3 lg:py-3.5 px-3 lg:px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] lg:text-[13px] 2xl:text-[15px] font-medium text-gray-700 w-full sm:w-auto">
              <BsGearWideConnected className="text-gray-600 text-[18px] lg:text-[20px] 2xl:text-[24px] flex-shrink-0" />
              <span>DIT Motor*-20 Years, Spare Parts &amp; After Sales Service - 1 Year</span>
            </div>
            <div className="bg-[#0f55bd] text-white text-[10px] lg:text-[11px] 2xl:text-[13px] font-medium px-3 lg:px-4 py-1 lg:py-1.5 rounded-full flex-shrink-0">
              Cost = Free
            </div>
          </div>
        </div>

        {/* Right Column - Sub Total (40%) */}
        <div className="w-full lg:w-[40%] border border-gray-200 rounded-lg p-4 lg:p-5 bg-[#fafafa] shadow-[0_0_10px_rgba(0,0,0,0.02)] flex-shrink-0 lg:sticky top-28">
          <h2 className="text-[18px] lg:text-[20px] 2xl:text-[22px] font-bold text-center mb-3 lg:mb-4 text-black">Sub -Total</h2>
          <hr className="border-gray-200 mb-4 lg:mb-5" />

          {mounted && cartItems.length > 0 ? (
            cartItems.map(item => {
              const itemTotal = formatCurrency(parseCurrency(item.price) * item.quantity);
              const itemOriginalTotal = item.originalPrice ? formatCurrency(parseCurrency(item.originalPrice) * item.quantity) : '';
              return (
                <div key={item.id} className="flex justify-between items-start mb-4 lg:mb-5 text-[12px] lg:text-[13px] 2xl:text-[14px]">
                  <div className="text-gray-600 w-[50%] lg:w-[55%] leading-relaxed font-medium line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-gray-400 mt-[2px] text-[11px] lg:text-[12px] 2xl:text-[13px] font-medium whitespace-nowrap">
                    ( {item.quantity} pcs )
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    {itemOriginalTotal && <span className="text-gray-400 line-through text-[10px] lg:text-[11px] 2xl:text-[12px] font-medium">{itemOriginalTotal}</span>}
                    <span className="font-bold text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">{itemTotal}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-[12px] text-gray-500 mb-4">{mounted ? "No items to compute." : "Loading..."}</div>
          )}

          <div className="space-y-3 lg:space-y-4 text-[13px] lg:text-[14px] 2xl:text-[15px] font-medium text-gray-700 mt-6 lg:mt-8">
            <div className="flex justify-between items-center">
              <span>Save</span>
              <span className="font-bold text-[#f04848] lg:text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">
                {mounted ? formatCurrency(totalSavings) : "৳0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Store Pickup</span>
              <span className="font-bold text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TAX</span>
              <span className="font-bold text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery</span>
              <span className="font-bold text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Coupon Code</span>
              <span className="font-bold text-black text-[14px] lg:text-[15px] 2xl:text-[16px]">0</span>
            </div>
          </div>

          <hr className="border-gray-200 my-4 lg:my-5" />

          <div className="flex justify-between items-center mb-5 lg:mb-6">
            <span className="font-bold text-[16px] lg:text-[17px] 2xl:text-[20px] text-black">Your Total</span>
            <span className="font-bold text-[18px] lg:text-[20px] 2xl:text-[24px] text-black">
              {mounted ? formatCurrency(finalTotal) : "৳0"}
            </span>
          </div>

          <button
            disabled={!mounted || cartItems.length === 0}
            className={`w-full font-semibold py-3 2xl:py-3.5 rounded-md transition-colors text-[15px] lg:text-[16px] 2xl:text-[18px] shadow-sm tracking-wide ${mounted && cartItems.length > 0
              ? "bg-[#247dfa] hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Process to Checkout
          </button>
        </div>
      </div>

      {/* People Also Bought Section */}
      <PeopleAlsoBought />

      {/* Payment Methods Section */}
      <div className="mt-16 lg:mt-24 2xl:mt-32 flex flex-col items-center justify-center gap-8 pb-16">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
          <h2 className="text-[22px] lg:text-[26px] 2xl:text-[32px] font-bold text-black tracking-tight">
            Accept Payments Methods
          </h2>
          <span className="text-[10px] lg:text-[11px] 2xl:text-[12px] text-[#1a83ff] font-semibold">
            15% discount on pay with visa Master card
          </span>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/paymethods.png"
            alt="Acceptable Payment Methods"
            className="w-full h-auto max-w-[900px] object-contain opacity-90 transition-opacity hover:opacity-100"
          />
        </div>

        <div className="text-gray-400 text-[13px] lg:text-[14px] 2xl:text-[16px] font-medium tracking-wide underline underline-offset-[6px] decoration-gray-300">
          Guaranteed Safe Checkout
        </div>
      </div>
    </div>
  )
}
