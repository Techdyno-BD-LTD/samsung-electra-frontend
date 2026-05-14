"use client";

import React, { useState, useEffect } from "react";
import { FiPhone } from "react-icons/fi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/features/toast/toastSlice";

const ServiceRequestPage = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    service_type: "",
    problem: "",
    brand: "",
    model_number: "",
    warranty: "",
    buy_from: "",
    full_address: "",
    division: "",
    district: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = [
      { key: 'full_name', label: 'Full Name' },
      { key: 'mobile_number', label: 'Mobile Number' },
      { key: 'email', label: 'E-mail Address' }
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData].trim()) {
        const element = document.getElementsByName(field.key)[0] as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('border-red-500');
          setTimeout(() => element.classList.remove('border-red-500'), 3000);
        }
        dispatch(showToast({ message: `${field.label} is required.`, type: "error" }));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/service-request/submit", {
        method: "POST",
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(showToast({ message: "Service request submitted successfully!", type: "success" }));
        setFormData({
          full_name: "",
          mobile_number: "",
          email: "",
          service_type: "",
          problem: "",
          brand: "",
          model_number: "",
          warranty: "",
          buy_from: "",
          full_address: "",
          division: "",
          district: "",
          message: ""
        });
      } else {
        dispatch(showToast({ message: data.message || "Failed to submit request.", type: "error" }));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      dispatch(showToast({ message: "An error occurred. Please try again.", type: "error" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [serviceCenters, setServiceCenters] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCenters() {
      try {
        const res = await fetch("/api/v2/pickup-list");
        const data = await res.json();
        if (data.success) {
          const centers = data.data.locations
            .filter((loc: any) => loc.type === "service_center")
            .map((loc: any) => ({
              id: loc.id,
              city: loc.district || loc.division || "DHAKA",
              address: loc.address,
              phones: loc.phone ? [loc.phone] : [],
              mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + loc.address)}`
            }));
          setServiceCenters(centers);
        }
      } catch (error) {
        console.error("Error fetching service centers:", error);
      }
    }
    fetchCenters();
  }, []);

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Service Request</h2>
        </div>

        <div className="p-6 lg:p-8">
           <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Row 1 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name<span className="text-red-500">*</span></label>
                 <input 
                    type="text" 
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name" 
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                 />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Mobile Number<span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        placeholder="Enter number" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">E-mail Address<span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Service Type</label>
                    <input 
                        type="text" 
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        placeholder="Enter service type" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Problem <span className="text-[10px] text-slate-400 font-normal underline">( you can type any language)</span></label>
                    <input 
                        type="text" 
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        placeholder="Describe your problem" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Brand</label>
                    <input 
                        type="text" 
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Model number</label>
                    <input 
                        type="text" 
                        name="model_number"
                        value={formData.model_number}
                        onChange={handleChange}
                        placeholder="Enter model number" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Warranty</label>
                    <input 
                        type="text" 
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleChange}
                        placeholder="Warranty status" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Buy From</label>
                 <input 
                    type="text" 
                    name="buy_from"
                    value={formData.buy_from}
                    onChange={handleChange}
                    placeholder="Where did you buy it from?" 
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                 />
              </div>

              {/* Row 6 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full-address</label>
                 <textarea 
                    rows={3} 
                    name="full_address"
                    value={formData.full_address}
                    onChange={handleChange}
                    placeholder="Enter full address" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none" 
                 />
              </div>

              {/* Row 7 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Division</label>
                    <input 
                        type="text" 
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        placeholder="Enter division" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Select District</label>
                    <input 
                        type="text" 
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter district" 
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors" 
                    />
                 </div>
              </div>

              {/* Row 8 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Message</label>
                 <textarea 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter any additional details" 
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none" 
                 />
              </div>

              <div className="flex justify-end pt-4">
                 <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#2b7fe8] text-white px-12 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a6ed9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? "Submitting..." : "Submit"}
                 </button>
              </div>
           </form>

           {/* Service centers section */}
           <div className="mt-12 pt-12 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Our Service Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {serviceCenters.map((sc) => (
                    <div key={sc.id} className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
                       <h4 className="text-lg lg:text-xl font-bold text-slate-800 mb-4">{sc.city}</h4>
                       <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-6 h-12 overflow-hidden">
                          {sc.address}
                       </p>
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
                          {sc.phones.map((p, i) => (
                             <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                <div className="p-1 bg-slate-50 border border-slate-100 rounded-md">
                                   <FiPhone className="text-slate-400" />
                                </div>
                                <span>{p}</span>
                             </div>
                          ))}
                       </div>
                       <a 
                          href={sc.mapHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center bg-slate-900 text-white py-3.5 rounded-full text-sm font-bold hover:bg-black transition-all"
                       >
                          Map
                       </a>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;
