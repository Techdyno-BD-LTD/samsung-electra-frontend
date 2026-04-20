"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiMessageCircle, FiMoreVertical } from "react-icons/fi";

const ReviewsPage = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: "Khondokar Salah-Uddin",
      date: "6 December 2025",
      rating: 5.0,
      title: "Good product",
      body: "Working Smoothly As Expected. However On The Right Side Of The Machine It Seems Like Its Edge Shrinks A Bit.",
      productImage: "/images/tv2.png"
    },
    {
      id: 2,
      name: "Khondokar Salah-Uddin",
      date: "6 December 2025",
      rating: 5.0,
      title: "Good product",
      body: "Working Smoothly As Expected. However On The Right Side Of The Machine It Seems Like Its Edge Shrinks A Bit.",
      productImage: "/images/tv2.png"
    }
  ]);

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 lg:p-20 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <FiMessageCircle className="text-7xl text-blue-100" />
              <FiStar className="absolute top-0 right-0 text-xl text-red-500 fill-red-500 animate-pulse" />
            </div>
          </div>
        </div>
        <p className="text-slate-600 mb-2 font-medium">Review is empty</p>
        <Link
          href="/shop"
          className="bg-[#2b7fe8] text-white px-10 py-4 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5 mt-6"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Reviews</h2>
        </div>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12">
            {/* Reviews List */}
            <div className="space-y-12">
              {reviews.map((review) => (
                <div key={review.id} className="relative pb-8 border-b border-slate-50 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col items-start gap-4">
                      <div className="w-20 h-20 rounded-lg border border-slate-100 p-2 flex items-start justify-start bg-white shadow-sm">
                        <Image
                          src={review.productImage}
                          alt="Product"
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      </div>
                      <div className="">
                        <div className="flex items-start gap-1.5 mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-[15px]">{review.name}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{review.date}</p>
                          </div>
                          <div className="flex text-orange-500 text-[13px]">
                            <FiStar className="fill-orange-500" />
                            <FiStar className="fill-orange-500" />
                            <FiStar className="fill-orange-500" />
                            <FiStar className="fill-orange-500" />
                            <FiStar className="fill-orange-500" />
                          </div>
                          <span className="text-[12px] text-slate-400 font-bold ml-1">({review.rating.toFixed(1)})</span>
                        </div>
                        <h5 className="text-base font-bold text-slate-800 mb-2">{review.title}</h5>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                          {review.body}
                        </p>
                      </div>

                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <FiMoreVertical size={20} />
                    </button>
                  </div>


                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <div className="h-fit">
              <div className="bg-slate-50/80 rounded-2xl p-6 lg:p-8 border border-slate-100">
                <h3 className="text-lg lg:text-xl font-semibold text-slate-800 text-center mb-6">Add Review</h3>

                <div className="mb-6 flex flex-col items-center">
                  <div className="flex text-slate-300 text-lg mb-1">
                    <FiStar /> <FiStar /> <FiStar /> <FiStar /> <FiStar />
                  </div>
                  <button className="text-[10px] text-slate-400 font-medium hover:text-[#2b7fe8] underline underline-offset-4">
                    ( add rating )
                  </button>
                </div>

                <form className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Title</label>
                    <input
                      type="text"
                      placeholder="Enter Title"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Enter Message"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      className="bg-[#2b7fe8] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-[#1a6ed9] transition-all shadow-sm"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
