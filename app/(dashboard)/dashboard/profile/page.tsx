"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiLoader } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/features/auth/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
        avatar_original: user.avatar || user.avatar_original || "",
      });
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar_original: previewUrl }));

    setUploading(true);
    setError("");

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const response = await fetch("/api/v2/profile/upload-avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataUpload
      });

      const payload = await response.json();
      if (payload.success) {
        const newAvatarUrl = payload.data.url;
        setFormData(prev => ({ ...prev, avatar_original: newAvatarUrl }));

        // Sync with Redux immediately
        dispatch(updateUser({
          avatar: newAvatarUrl,
          avatar_original: newAvatarUrl
        }));

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(payload.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

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
        dispatch(updateUser({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          avatar: formData.avatar_original
        }));

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(payload.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">My Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences</p>
          </div>
          <div className="flex flex-col items-end gap-2">
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
        </div>

        <div className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border border-slate-100 relative">
                    {uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <FiLoader className="animate-spin text-blue-600 text-2xl" />
                      </div>
                    ) : null}
                    <Image
                      src={(typeof formData.avatar_original === 'string' && (formData.avatar_original.startsWith('/') || formData.avatar_original.startsWith('http') || formData.avatar_original.startsWith('blob:')))
                        ? formData.avatar_original
                        : "https://ui-avatars.com/api/?name=" + (formData.name || "User") + "&background=random"}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <FiCamera className="text-white text-2xl" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">{formData.name || "Your Name"}</p>
                  <p className="text-xs text-slate-400 mt-1">Click image to upload</p>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        readOnly
                        value={formData.email}
                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-12 pr-4 h-14 text-sm text-slate-500 cursor-not-allowed outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                        placeholder="017********"
                      />
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Profile Image URL</label>
                    <div className="relative">
                      <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={formData.avatar_original}
                        onChange={(e) => setFormData({ ...formData, avatar_original: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 h-14 text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div> */}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Default Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-slate-400" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 min-h-[120px] text-sm focus:ring-2 focus:ring-[#1877f2]/20 focus:border-[#1877f2] transition-all outline-none"
                      placeholder="Enter your default shipping address"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading || uploading}
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
