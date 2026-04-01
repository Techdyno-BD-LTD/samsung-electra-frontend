import React from 'react';
import { FiChevronRight, FiEdit, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { HiOutlineTicket } from "react-icons/hi2";
const Checkout = () => {
    return (
        <div className="px-4 py-8 mt-10 ">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-8 flex items-center space-x-2">
                <span className="cursor-pointer hover:text-gray-900">Home</span>
                <FiChevronRight className="w-4 h-4" />
                <span className="cursor-pointer hover:text-gray-900">Washing Machine</span>
                <FiChevronRight className="w-4 h-4" />
                <span className="cursor-pointer hover:text-gray-900">Washing Machine details</span>
                <FiChevronRight className="w-4 h-4" />
                <span className="text-gray-800 font-medium">Secure Checkout Process</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-3 flex flex-col gap-10">
                    <section>
                        <h2 className="text-[24px] font-semibold mb-6 text-gray-900 tracking-wide">Shipping Address</h2>

                        {/* Login Box */}
                        <div className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                            <span className="text-[#a1a1aa] font-medium text-[15px]">Add an address or login to use saved address</span>
                            <div className="flex space-x-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none border border-[#1877f2] text-[#1877f2] rounded-full px-16 py-1 font-medium hover:bg-blue-50 transition-colors text-[15px]">Login</button>
                                <button className="flex-1 md:flex-none bg-[#1877f2] text-white rounded-full px-10 py-1 font-medium hover:bg-blue-600 transition-colors w-max text-[15px]">Add new address</button>
                            </div>
                        </div>

                        {/* Selected Address Box */}
                        <div className="border border-gray-200 rounded-xl p-4">

                            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-6 mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-gray-900 text-[17px]">Aman miya</h3>
                                    <button className="text-[#1877f2] flex items-center text-[15px] font-semibold hover:underline">
                                        Change <FiEdit className="ml-1.5 w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3 text-[15px] text-gray-700 max-w-3xl leading-relaxed">
                                    <p>Level 4, Techdyno BD LTD, Haq&apos;s Plaza, 4th Floor, , 1, Dhaka, Mohammadpur, Asad Avenue Mohammadpur, 1207</p>
                                    <p>Phone: +8800190877988</p>
                                    <p>Email : amanullah.techdynobd@gmail.com</p>
                                </div>
                            </div>

                            {/* Checkbox */}
                            <label className="inline-flex items-center space-x-3 cursor-pointer group">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-5 h-5 cursor-pointer" />
                                <span className="text-gray-700 text-[15px] font-medium group-hover:text-gray-900 transition-colors">Use a different billing address</span>
                            </label>

                        </div>

                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold mb-6 text-gray-900 tracking-wide">Shipping Method</h2>

                        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                            {/* Express Option */}
                            <div className="p-6 border-b border-gray-200 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <input type="radio" name="shipping" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" />
                                        <span className="font-medium text-[19px] text-gray-900 group-hover:text-[#1877f2] transition-colors">Express</span>
                                    </label>
                                    <span className="bg-[#1f519b] text-white text-[13px] px-6 py-1 rounded-tl-2xl rounded-br-2xl font-semibold">Free</span>
                                </div>
                                <div className="ml-[34px] text-[15px]">
                                    <p className="text-gray-500">Estimated Shipping Time</p>
                                    <p className="text-gray-800 font-medium mt-1">14 December 2025 - 17 December 2025</p>
                                </div>
                            </div>

                            {/* In Store Pickup Option */}
                            <div className="p-6 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <input type="radio" name="shipping" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" defaultChecked />
                                        <span className="font-medium text-[19px] text-gray-900 group-hover:text-[#1877f2] transition-colors">In Store Pickup</span>
                                    </label>
                                    <span className="bg-[#1f519b] text-white text-[13px] px-6 py-1 rounded-tl-2xl rounded-br-2xl font-semibold">Free</span>
                                </div>
                                <div className="ml-[34px] text-[15px]">
                                    <p className="text-gray-500">This item not available in your area</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-gray-500">Pickup location</p>
                                        <button className="text-[#1877f2] font-semibold flex items-center hover:underline">
                                            Select Store <FiArrowRight className="ml-1.5 w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Store Box */}
                                <div className="ml-[34px] mt-4 bg-[#f8f9fa] border border-gray-100 rounded-xl p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-gray-900 text-[16px]">Electra International Abdullapur, Dhaka</h3>
                                        <button className="text-[#1877f2] flex items-center text-[15px] font-semibold hover:underline">
                                            Change <FiEdit className="ml-1.5 w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-[15px] text-gray-700">
                                        <p>Mojidullah Matbor Market, Abdullapur Bazar, Abdullapur, Keranigonj, Dhaka</p>
                                        <p>Phone: +8801713092219</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Available Offers */}
                    <section>
                        <h2 className="text-[24px] font-semibold mb-6 text-gray-900 tracking-wide">Available Offers</h2>
                        <div className="border border-gray-200 rounded-xl p-6 bg-white">
                            <div className="inline-flex items-center space-x-2 bg-[#f8f9fa] px-4 py-2.5 rounded-full mb-6 text-sm font-medium border border-gray-100">
                                <span className="text-gray-700 flex items-center"><span className="text-gray-500 mr-2 text-[18px]"><HiOutlineTicket /></span>Coupon- <span className="font-bold text-gray-900 ml-1">EL05</span></span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Coupon */}
                                <div>
                                    <div className="flex gap-3">
                                        <input type="text" placeholder="Enter Coupon Code" className="flex-1 border border-gray-200 rounded-md px-4 py-[8px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] placeholder:text-gray-300" />
                                        <button className="bg-[#1f519b] hover:bg-blue-600 text-white font-medium px-6 py-[8px] rounded-md text-[15px] transition-colors whitespace-nowrap">Apply Coupon/Gift Code</button>
                                    </div>
                                </div>
                                {/* Reward */}
                                <div>
                                    <div className="flex gap-3 mb-2.5">
                                        <input type="text" placeholder="Reward Point" className="flex-1 border border-gray-200 rounded-md px-4 py-[8px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] placeholder:text-gray-300" />
                                        <button className="bg-[#1f519b] hover:bg-blue-600 text-white font-medium px-6 py-[8px] rounded-md text-[15px] transition-colors whitespace-nowrap">Apply Reward</button>
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
                        <h2 className="text-[24px] font-semibold mb-6 text-gray-900 tracking-wide">Payment Method</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            {/* Online Payment Gateway */}
                            <div className="p-6 pb-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-5">
                                    <input type="radio" name="payment" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" defaultChecked />
                                    <span className="font-medium text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Online Payment Gateway</span>
                                </label>
                                <div className="ml-[34px]">
                                    <div className="flex items-center gap-4">
                                        {/* Mocking the cards based on image: Mastercard, Visa, Amex, DBBL */}
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
                            <div className="p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-3">
                                    <input type="radio" name="payment" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" />
                                    <span className="font-medium text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">EMI Payment (Credit Card only)</span>
                                </label>
                                <div className="ml-[34px] text-[15px] space-y-1.5">
                                    <p className="text-[#0a3055] font-medium">Only applicable for orders over ৳ 10,000</p>
                                    <button className="text-[#1877f2] font-semibold hover:underline">EMI Plans</button>
                                </div>
                            </div>

                            {/* Mobile Bank Payment */}
                            <div className="p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group mb-5">
                                    <input type="radio" name="payment" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer" />
                                    <span className="font-medium text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Mobile Bank Payment</span>
                                </label>
                                <div className="ml-[34px]">
                                    <div className="flex items-center gap-4">
                                        {/* Mocking mobile payment logos */}
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
                            <div className="p-6 py-5">
                                <label className="flex items-center space-x-3 cursor-pointer group flex-wrap gap-y-2">
                                    <input type="radio" name="payment" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer flex-shrink-0" />
                                    <span className="font-medium text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Cash On Delivery</span>
                                    <span className="text-[#1877f2] text-[15px] xl:ml-2 font-medium hover:underline cursor-pointer">(Advanced pay 10% For Order confirmation)</span>
                                    <span className="text-gray-900 text-[16px] font-bold xl:ml-2">Free Delivery</span>
                                </label>
                            </div>

                            {/* Store Pickup */}
                            <div className="p-6 pt-5 pb-8">
                                <label className="flex items-center space-x-3 cursor-pointer group flex-wrap gap-y-2">
                                    <input type="radio" name="payment" className="w-[22px] h-[22px] text-[#1877f2] border-[2px] border-[#1877f2] focus:ring-[#1877f2] cursor-pointer flex-shrink-0" />
                                    <span className="font-medium text-[20px] text-gray-800 group-hover:text-[#1877f2] transition-colors">Store Pickup / Showroom Booking</span>
                                    <span className="text-[#1877f2] text-[15px] xl:ml-2 font-medium hover:underline cursor-pointer">(Advanced pay 10% For Order confirmation)</span>
                                    <span className="text-gray-900 text-[16px] font-bold xl:ml-2">Get 5% OFF</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Note */}
                    <section>
                        <h2 className="text-[24px] font-semibold mb-6 text-gray-900 tracking-wide">Delivery Note</h2>
                        <textarea
                            className="w-full border border-gray-200 rounded-xl p-5 text-[15px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#1877f2] focus:border-[#1877f2] min-h-[160px] resize-y bg-white"
                            placeholder="Enter your instruction message"
                        ></textarea>
                    </section>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 sticky top-[230px] self-start">
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 lg:p-7 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-[22px] font-bold flex items-center text-gray-900 tracking-tight cursor-pointer">
                                Order Total <FiChevronDown className="ml-2 w-6 h-6 text-gray-500" />
                            </h2>
                            <div className="flex flex-col items-end">
                                <span className="text-[26px] font-bold text-[#1877f2] tracking-tight">8,113,900</span>
                                <span className="bg-[#ff3b30] text-white text-[12px] px-2.5 py-1 rounded mt-1 font-medium">Saving : 20%</span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4 mb-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl items-start shadow-sm">
                                    <div className="w-[72px] h-[72px] bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-gray-100">
                                        <div className="w-10 h-10 rounded-md border-[3px] border-gray-700 bg-gray-800 opacity-80 relative flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full border border-gray-500 bg-black"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                        <div className="pr-3">
                                            <p className="text-[14px] text-gray-800 font-medium leading-[1.3]">
                                                Washing Machine - 8KG |<br />SKU -5487 | Black
                                            </p>
                                            <p className="text-[14px] text-gray-500 mt-2">QTY : 1</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end whitespace-nowrap">
                                            <span className="text-[13px] text-[#a1a1aa] line-through font-medium">৳4,70,900</span>
                                            <span className="font-bold text-[18px] mt-0.5 text-black">৳4,56,900</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sub-Total */}
                        <div className="pt-2">
                            <h3 className="text-[20px] font-bold mb-5 text-gray-900">Sub -Total</h3>
                            <div className="space-y-3.5 text-[16px]">
                                <div className="flex justify-between"><span className="text-gray-600">Save</span><span className="font-bold text-gray-900">৳13,500</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Store Pickup</span><span className="font-bold text-gray-900">Free</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">TAX</span><span className="font-bold text-gray-900">Free</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className="font-bold text-gray-900">Free/ Charge</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Coupon Code</span><span className="font-bold text-gray-900">0</span></div>
                            </div>
                        </div>

                        <button className="w-full bg-[#1877f2] hover:bg-blue-600 text-white font-semibold py-4 rounded-xl mt-8 shadow-sm transition-colors text-[17px]">
                            Place Order
                        </button>
                    </div>

                    <p className="text-[12px] text-gray-500 text-center mt-6 px-4 leading-relaxed tracking-tight">
                        By proceeding, you acknowledge and accept Electra<br />International&apos;s <span className="font-bold text-gray-700">Terms &amp; Conditions, Cancellation &amp; Refund Policy</span>, and <span className="font-bold text-gray-700">Privacy Policy</span>.&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
