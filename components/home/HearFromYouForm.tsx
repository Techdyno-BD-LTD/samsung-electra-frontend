"use client";

import React, { useState, useEffect } from "react";
import { FaStar, FaRegUser } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HearFromYouForm() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Set mounted on client-side to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mounted || !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (rating === 0) {
      setMessage({ type: "error", text: "Please select a rating before submitting." });
      return;
    }

    if (!comment.trim()) {
      setMessage({ type: "error", text: "Please enter a comment before submitting." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/testimonials/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Anonymous Customer",
          rating,
          comment: comment.trim(),
          avatar: user?.avatar_original || user?.avatar || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Thank you! Your feedback has been submitted for admin approval." });
        setComment("");
        setRating(0);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to submit feedback. Please try again." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "An error occurred. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  // Determine actual render state (always guest/not-authenticated on server SSR)
  const isUserLoggedIn = mounted && isAuthenticated;

  return (
    <section className="w-full bg-blue-600 pb-16 -mt-[1px] lg:-mt-[1px]">
      <div className="max-w-[1500px] mx-auto px-3.5 md:px-16 lg:px-24">
        <div className="w-full lg:bg-white/20 rounded-[30px] px-3.5 py-8 md:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-8 lg:shadow-xl">
          <div className="shrink-0 text-center">
            <h2 className="text-[32px] sm:text-3xl font-bold text-center leading-tight text-white select-none">
              We want to hear<br />from you!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 w-full max-w-[680px] lg:max-w-none mx-auto md:bg-transparent bg-white/10 px-3.5 py-6 lg:p-4 rounded-[12px] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="flex flex-col gap-3 w-full lg:max-w-[320px] text-center lg:text-left">
              <p className="text-white text-xs sm:text-sm font-light text-center lg:text-left leading-relaxed">
                Dear Valued Customer, thank you for choosing Electra International! How was your recent experience with us?
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="w-14 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-150 shadow-sm focus:outline-none transition-transform hover:scale-105"
                  >
                    <FaStar
                      className={`w-6 h-6 ${
                        star <= (hoverRating ?? rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full">
              <textarea
                placeholder="Your Message..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                className="w-full px-6 py-4 rounded-[20px] border-none bg-gray-100/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm resize-none"
              />

              {message && (
                <div
                  className={`mt-2 px-4 py-2 rounded-lg text-xs font-semibold ${
                    message.type === "success" ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>

            <div className="shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto lg:min-h-[110px] gap-4">
              {isUserLoggedIn ? (
                <div className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:opacity-80">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/40 relative">
                    <Image
                      src={user?.avatar_original || user?.avatar || "/assets/img/avatar-place.png"}
                      alt={user?.name || "User avatar"}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white max-w-[80px] truncate">{user?.name}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="flex items-center gap-2 text-xs font-medium cursor-pointer hover:opacity-80 bg-white/20 px-3 py-1.5 rounded-full border border-white/20 text-white"
                >
                  <FaRegUser className="w-3 h-3 text-white" />
                  <span>Login</span>
                </button>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl transition-all duration-200 shadow-md text-sm disabled:opacity-50 min-w-[120px]"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
