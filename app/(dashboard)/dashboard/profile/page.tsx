"use client";

import React, { useState, useEffect } from "react";
import { FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiSave } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/features/auth/authSlice"; 

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar_original: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar_original: user.avatar_original || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/v2/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const payload = await response.json();
      if (payload.success) {
        setSuccess(true);
        // Update Redux state
        dispatch(updateUser({
          name: formData.name,
          phone: formData.phone,
          avatar: formData.avatar_original
        }));
        
        // Optional: refresh page after a short delay or just let Redux handle it
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(payload.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden border border-gray-100">
        <div className="relative h-32 bg-gradient-to-r from-[#1877f2] to-[#0a58ca]">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border-4 border-white">
                <img 
                  src={formData.avatar_original || "https://ui-avatars.com/api/?name=" + (formData.name || "User") + "&background=random"} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl">
                  <FiCamera className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-500 text-sm">Manage your account information and preferences</p>
            </div>
            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
                Profile updated successfully!
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    readOnly
                    value={formData.email}
                    className="w-full bg-gray-100 border border-gray-200 rounded-2xl pl-12 pr-4 h-14 text-sm text-gray-500 cursor-not-allowed outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                    placeholder="017********"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Profile Image URL</label>
                <div className="relative">
                  <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.avatar_original}
                    onChange={(e) => setFormData({ ...formData, avatar_original: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Default Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 min-h-[120px] text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                  placeholder="Enter your default shipping address"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1877f2] text-white px-10 h-14 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSave className="text-lg" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
