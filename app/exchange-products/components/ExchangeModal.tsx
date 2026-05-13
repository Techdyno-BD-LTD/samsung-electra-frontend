"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

type Showroom = {
  id: number;
  name: string;
  address: string;
};

type ExchangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ExchangeModal({ isOpen, onClose }: ExchangeModalProps) {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email_address: "",
    delivery_address: "",
    brands: "",
    product_name: "",
    showroom_id: "",
    message: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/proxy?path=showrooms")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setShowrooms(data.data);
        })
        .catch((err) => console.error("Error fetching showrooms:", err));

      // Reset success state when opening
      setSuccess(false);

      // Lock scroll
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle image uploads first if any
      const imageIds: number[] = [];
      if (selectedImages.length > 0) {
        for (const file of selectedImages) {
          const uploadFormData = new FormData();
          uploadFormData.append("aiz_file", file);

          const uploadRes = await fetch("/api/proxy?path=aiz-upload", {
            method: "POST",
            body: uploadFormData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.data?.[0]?.id) {
            imageIds.push(uploadData.data[0].id);
          }
        }
      }

      const response = await fetch("/api/proxy?path=exchange-request/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: imageIds,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          full_name: "",
          mobile_number: "",
          email_address: "",
          delivery_address: "",
          brands: "",
          product_name: "",
          showroom_id: "",
          message: "",
        });
        setSelectedImages([]);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-300 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-[#fcfcfc] px-5 py-4 text-center relative border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoMdClose size={18} />
          </button>

          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Electra International | <span className="font-medium text-slate-600">Exchange information</span>
          </h2>
          <p className="mt-1 text-[10px] leading-relaxed text-slate-500 max-w-xl mx-auto">
            Select product to exchange. Complete at nearest showroom. Free delivery included.
          </p>
        </div>

        {/* Form Content */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-5">
          {success ? (
            <div className="py-12 text-center animate-in fade-in zoom-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <IoCheckmarkCircleOutline size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Application Submitted!</h3>
              <p className="text-sm text-slate-600">Our team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Full Name</label>
                <input
                  required
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Mobile Number<span className="text-red-500">*</span></label>
                  <input
                    required
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Enter number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">E-mail Address<span className="text-red-500">*</span></label>
                  <input
                    required
                    type="email"
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Delivery Address<span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Brands<span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    name="brands"
                    value={formData.brands}
                    onChange={handleChange}
                    placeholder="Enter brands"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Product Name<span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Showroom<span className="text-red-500">*</span></label>
                <select
                  required
                  name="showroom_id"
                  value={formData.showroom_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 appearance-none bg-white focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all cursor-pointer"
                >
                  <option value="">Select showroom</option>
                  {showrooms.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider ml-0.5">Message<span className="text-red-500">*</span></label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1f74e8] focus:ring-4 focus:ring-[#1f74e8]/10 outline-none transition-all resize-none"
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative group size-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <Image
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="size-14 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-[#1f74e8] hover:text-[#1f74e8] hover:bg-blue-50 transition-all group"
                  >
                    <FiUpload size={14} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-bold mt-0.5 uppercase">Add</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Upload clear photos of the product you wish to exchange.</p>
                <input
                  type="file"
                  multiple
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              {/* Submit Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1f74e8] hover:bg-[#1666d4] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
