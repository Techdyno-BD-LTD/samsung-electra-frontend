"use client";

import { useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

interface HigherSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

export default function HigherSaleModal({
  isOpen,
  onClose,
  productId,
  productName,
}: HigherSaleModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    age: "",
    gender: "",
    marital_status: "",
    head_of_household: "",
    delivery_address: "",
    message: "",
  });

  const [files, setFiles] = useState<{
    nid_front: { id: string | null; name: string | null; uploading: boolean };
    nid_back: { id: string | null; name: string | null; uploading: boolean };
    passport_photos: { id: string | null; name: string | null; uploading: boolean };
    guarantor_nid_photos: { id: string | null; name: string | null; uploading: boolean };
  }>({
    nid_front: { id: null, name: null, uploading: false },
    nid_back: { id: null, name: null, uploading: false },
    passport_photos: { id: null, name: null, uploading: false },
    guarantor_nid_photos: { id: null, name: null, uploading: false },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [field]: { ...prev[field], uploading: true },
    }));

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/higher-sale/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();

      if (data.success) {
        setFiles((prev) => ({
          ...prev,
          [field]: { id: data.data.upload_id, name: file.name, uploading: false },
        }));
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("File upload failed. Please try again.");
      setFiles((prev) => ({
        ...prev,
        [field]: { ...prev[field], uploading: false },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      product_id: productId,
      nid_front: files.nid_front.id,
      nid_back: files.nid_back.id,
      passport_photos: files.passport_photos.id,
      guarantor_nid_photos: files.guarantor_nid_photos.id,
    };

    try {
      const res = await fetch("/api/higher-sale/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit application. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="relative w-full max-w-[500px] rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Success!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Your Kisti application for <span className="font-semibold">{productName}</span> has been submitted successfully. Our team will review it and contact you soon.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#0081FF] py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out custom-scrollbar">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Electra International <span className="text-slate-300 font-light">|</span> <span className="text-[#0081FF]">Kisti Information</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          {/* Info Text */}
          <div className="bg-slate-50 rounded-xl p-6 text-sm text-slate-600 leading-relaxed">
            <p className="mb-4">
              Electra International Limited is one of the most trusted and well-established consumer electronics brands in Bangladesh, offering premium-quality original electronic appliances through a reliable and customer-focused shopping experience.
            </p>
            <p className="font-bold text-slate-900 mb-2">কিস্তিতে ক্রয়ের জন্য ক্রেতার প্রয়োজনীয় কাগজপত্র: (সর্ব-সাধারণ এর জন্য)</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>জাতীয় পরিচয়পত্র (NID) এর ফটোকপি</li>
              <li>পাসপোর্ট সাইজ ছবি</li>
              <li>ঠিকানা যাচাইয়ের প্রমাণ</li>
              <li>সক্রিয় মোবাইল নম্বর</li>
              <li>জামিনদারের তথ্য (প্রয়োজনে)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-semibold text-slate-700">First Name (নামের প্রথম অংশ)<span className="text-red-500">*</span></label>
              <input
                required
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter last name"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-semibold text-slate-700">Last Name (নামের শেষাংশ)<span className="text-red-500">*</span></label>
              <input
                required
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                type="text"
                placeholder="Enter last name"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-semibold text-slate-700">Mobile Number<span className="text-red-500">*</span></label>
              <input
                required
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                type="tel"
                placeholder="Enter number"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[15px] font-semibold text-slate-700">E-mail Address<span className="text-red-500">*</span></label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Enter email"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Age Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-semibold text-slate-700">Age (বয়স)<span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-6">
              {["18-25", "26-35", "36-45", "46-55"].map((range) => (
                <label key={range} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    required
                    type="radio"
                    name="age"
                    value={range}
                    checked={formData.age === range}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#0081FF] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-semibold text-slate-700">Gender (লিঙ্গ)<span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-6">
              {["Male", "Female", "Others"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    required
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#0081FF] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Marital Status Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-semibold text-slate-700">Marital Status<span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-6">
              {["Single", "Married", "Others"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    required
                    type="radio"
                    name="marital_status"
                    value={option}
                    checked={formData.marital_status === option}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#0081FF] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Head of Household Selection */}
          <div className="space-y-3">
            <label className="text-[15px] font-semibold text-slate-700">Head of Household ? (সংসার প্রধান? )<span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-6">
              {["Male", "Female", "Others"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    required
                    type="radio"
                    name="head_of_household"
                    value={option}
                    checked={formData.head_of_household === option}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-[#0081FF] border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <label className="text-[15px] font-semibold text-slate-700">Delivery Address<span className="text-red-500">*</span></label>
            <textarea
              required
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter full address"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {/* File Uploads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Nid Front */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0081FF]/30 transition-all bg-slate-50/30">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Nid Front (Max 300 KB)</p>
                <p className="text-xs text-slate-500">(জাতীয় পরিচয়পত্রের সামনের দিক)<span className="text-red-500">*</span></p>
                {files.nid_front.name && <p className="text-xs text-green-600 font-medium">✓ {files.nid_front.name}</p>}
              </div>
              <label className="cursor-pointer">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  {files.nid_front.uploading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-[#0081FF] border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCloudUploadAlt className="h-6 w-6 text-[#0081FF]" />
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "nid_front")} />
              </label>
            </div>

            {/* Nid Back */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0081FF]/30 transition-all bg-slate-50/30">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Nid Back (Max 300 KB)</p>
                <p className="text-xs text-slate-500">(জাতীয় পরিচয়পত্রের পেছনের দিক)<span className="text-red-500">*</span></p>
                {files.nid_back.name && <p className="text-xs text-green-600 font-medium">✓ {files.nid_back.name}</p>}
              </div>
              <label className="cursor-pointer">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  {files.nid_back.uploading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-[#0081FF] border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCloudUploadAlt className="h-6 w-6 text-[#0081FF]" />
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "nid_back")} />
              </label>
            </div>

            {/* Passport Photos */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0081FF]/30 transition-all bg-slate-50/30">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Upload 3 copies of the passport size photos</p>
                <p className="text-xs text-slate-500">(পাসপোর্ট সাইজের ছবি ৩ কপি আপলোড করুন )<span className="text-red-500">*</span></p>
                {files.passport_photos.name && <p className="text-xs text-green-600 font-medium">✓ {files.passport_photos.name}</p>}
              </div>
              <label className="cursor-pointer">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  {files.passport_photos.uploading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-[#0081FF] border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCloudUploadAlt className="h-6 w-6 text-[#0081FF]" />
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "passport_photos")} />
              </label>
            </div>

            {/* Guarantor Photos */}
            <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#0081FF]/30 transition-all bg-slate-50/30">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Upload Guarantors One NID Card Photos</p>
                <p className="text-xs text-slate-500">(পাসপোর্ট সাইজের ছবি ১ কপি আপলোড করুন )<span className="text-red-500">*</span></p>
                {files.guarantor_nid_photos.name && <p className="text-xs text-green-600 font-medium">✓ {files.guarantor_nid_photos.name}</p>}
              </div>
              <label className="cursor-pointer">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  {files.guarantor_nid_photos.uploading ? (
                    <div className="animate-spin h-6 w-6 border-2 border-[#0081FF] border-t-transparent rounded-full"></div>
                  ) : (
                    <FaCloudUploadAlt className="h-6 w-6 text-[#0081FF]" />
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "guarantor_nid_photos")} />
              </label>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-[15px] font-semibold text-slate-700">Message<span className="text-red-500">*</span></label>
            <textarea
              required
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter your message"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 focus:border-[#0081FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
            ></textarea>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              disabled={loading}
              type="submit"
              className={`min-w-[160px] rounded-lg bg-[#0081FF] px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 active:scale-[0.98] flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
