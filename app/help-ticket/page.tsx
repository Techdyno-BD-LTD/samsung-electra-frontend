"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import HelpTicketSuccessModal from "@/components/common/HelpTicketSuccessModal";

export default function HelpTicketPage() {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    order_id: "",
    topic: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      const storedToken = localStorage.getItem("auth_token");
      if (!storedToken) {
        router.push("/login?redirect=/help-ticket");
      }
    }
  }, [isAuthenticated, router]);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.name || "",
        email: user.email || "",
        mobile_number: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v2/help-tickets/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setFormData({
          full_name: user?.name || "",
          mobile_number: user?.phone || "",
          email: user?.email || "",
          order_id: "",
          topic: "",
          message: "",
        });
      } else {
        setError(data.message || "Failed to submit help ticket");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-[#f8faff] min-h-screen py-8 px-4 lg:py-12">
      <div className="w-10/12 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-5 text-sm text-slate-500 font-medium">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/')}>Home</span>
          <span className="mx-2">&gt;</span>
          <span className="text-blue-600 font-semibold">Help Ticket</span>
        </nav>

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Help Ticket</h1>
          <div className="w-full h-0.5 bg-black rounded-full"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="   overflow-hidden">
          <div className="">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    Full Name<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    Mobile Number<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile_number"
                    required
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* E-mail Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    E-mail Address<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Order ID / Invoice number */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    Order id / Invoice number<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="order_id"
                    required
                    value={formData.order_id}
                    onChange={handleChange}
                    placeholder="Enter order id"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Topics */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    Topics<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="Select topics"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    Message<span className="text-blue-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="w-full px-5 py-4  border border-slate-300 rounded-md focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <HelpTicketSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
