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
