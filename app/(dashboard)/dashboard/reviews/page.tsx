"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiMessageCircle, FiMoreVertical, FiCheckCircle, FiSave, FiChevronDown } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import Skeleton from "@/components/common/Skeleton";

interface Review {
  id: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  status: number;
}

interface PurchasedProduct {
  id: number;
  name: string;
  thumbnail_img: string;
  slug: string;
}

const ReviewsPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    product_id: "",
    rating: 5,
    title: "",
    comment: ""
  });

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await fetch("/api/v2/reviews/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        setError(`Failed to fetch reviews (${res.status})`);
        return;
      }
      const payload = await res.json();
      if (payload.success || Array.isArray(payload.data)) {
        setReviews(Array.isArray(payload.data) ? payload.data : (Array.isArray(payload) ? payload : []));
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  }, [token]);

  const fetchPurchasedProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/v2/purchased-products", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const payload = await res.json();
      if (payload.success || Array.isArray(payload.data)) {
        setPurchasedProducts(Array.isArray(payload.data) ? payload.data : payload);
      }
    } catch (err) {
      console.error("Failed to fetch purchased products", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      Promise.all([fetchReviews(), fetchPurchasedProducts()]).finally(() => setLoading(false));
    }
  }, [token, fetchReviews, fetchPurchasedProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProduct = purchasedProducts.find(p => p.id.toString() === formData.product_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id) {
      setError("Please select a product to review");
      return;
    }
    if (!formData.comment.trim()) {
      setError("Please enter your review comment");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/v2/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          product_id: parseInt(formData.product_id)
        })
      });
      const payload = await res.json();
      if (payload.success || payload.result) {
        setSuccess(true);
        setFormData({ product_id: "", rating: 5, title: "", comment: "" });
        await fetchReviews();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(payload.message || "Failed to submit review");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Side: Reviews List */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Reviews</h2>
          </div>

          <div className="p-8">
            {reviews.length === 0 ? (
              <div className="py-20 text-center">
                <FiMessageCircle className="text-6xl text-slate-100 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">You haven&apos;t given any reviews yet.</p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#2b7fe8] text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-[#1a6ed9] hover:-translate-y-0.5 mt-6 text-sm"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="group relative pb-8 mb-8 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0 transition-all">
                    <div className="flex flex-col gap-4">
                      {/* Product Image */}
                      <Link
                        href={`/product/${review.product_slug}`}
                        className="w-40 h-32 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-4 hover:border-blue-200 transition-colors"
                      >
                        <Image
                          src={review.product_image || "/images/wm2.png"}
                          alt="Product"
                          width={140}
                          height={100}
                          className="object-contain"
                        />
                      </Link>

                      {/* Content Section */}
                      <div className="relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/product/${review.product_slug}`}>
                              <h3 className="text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors mb-1">
                                {review.product_name}
                              </h3>
                            </Link>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>

                          <button className="p-2 hover:bg-white rounded-lg text-slate-400 transition-colors">
                            <FiMoreVertical />
                          </button>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-4 mb-3">
                          <div className="flex text-orange-500 text-[14px]">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-slate-200"} />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-500">({review.rating.toFixed(1)})</span>

                          {review.status === 1 && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full ml-2">
                              <FiCheckCircle size={10} />
                              LIVE
                            </div>
                          )}
                        </div>

                        {/* Review Title & Comment */}
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                            {review.title || (review.comment.startsWith("Title: ") ? review.comment.split("\n\n")[0].replace("Title: ", "") : "Good product")}
                          </h4>
                          <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                            {review.title ? review.comment : (review.comment.startsWith("Title: ") ? review.comment.split("\n\n").slice(1).join("\n\n") : review.comment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Add Review Form */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-slate-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden sticky top-8">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Add Review</h2>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <FiStar
                      className={`text-2xl ${star <= formData.rating ? "fill-orange-400 text-orange-400" : "text-slate-200"
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{formData.rating} Stars</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 rounded-2xl flex items-center gap-3 text-green-600 animate-in fade-in slide-in-from-top-4">
                <FiCheckCircle className="text-xl flex-shrink-0" />
                <p className="text-sm font-medium">Review submitted successfully!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-2xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 relative" ref={dropdownRef}>
                <label className="text-[13px] font-bold text-slate-700 ml-1">Select Product</label>
                <div className="relative">
                  <div
                    onClick={() => !submitting && setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full h-14 bg-white border border-slate-100 rounded-2xl px-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-all ${isDropdownOpen ? 'ring-2 ring-blue-500/20 border-blue-200' : ''}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {selectedProduct ? (
                        <>
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1">
                            <Image
                              src={selectedProduct.thumbnail_img || "/images/wm2.png"}
                              alt="Product"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-800 truncate">{selectedProduct.name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-400">Select a product</span>
                      )}
                    </div>
                    <FiChevronDown className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                      {purchasedProducts.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-400 font-medium">No products available</div>
                      ) : (
                        purchasedProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setFormData({ ...formData, product_id: product.id.toString() });
                              setIsDropdownOpen(false);
                            }}
                            className="p-3 flex items-center gap-3 hover:bg-white cursor-pointer border-b border-slate-50 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1.5">
                              <Image
                                src={product.thumbnail_img || "/images/wm2.png"}
                                alt="Product"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[13px] font-medium text-slate-700 line-clamp-2 leading-snug flex-1">{product.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Review Title</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent Quality!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-12 bg-white border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Your Message</label>
                <textarea
                  placeholder="Share your experience..."
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 bg-[#2b7fe8] text-white rounded-2xl font-bold transition-all hover:bg-[#1a6ed9] hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? <Skeleton className="w-4 h-4 rounded-full" /> : <FiSave />}
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
