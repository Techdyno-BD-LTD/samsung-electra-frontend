"use client";

import React, { useState, useEffect } from "react";
import { FiImage, FiChevronDown, FiLoader } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/features/toast/toastSlice";
import Skeleton from "@/components/common/Skeleton";

interface DeliveredProduct {
  product_id: number;
  product_name: string;
  product_slug: string;
  product_thumbnail: string;
  order_code: string;
  order_date: string;
  variation: string | null;
}

const ComplainPage = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const [products, setProducts] = useState<DeliveredProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    mobile_number: user?.phone || "",
    email: user?.email || "",
    product_id: "",
    order_code: "",
    purchase_date: "",
    category: "",
    description: "",
    documents: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.name || "",
        mobile_number: user.phone || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/v2/complains/delivered-products", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("/api/v2/complains/categories")
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (productsData.success) setProducts(productsData.data);
        if (categoriesData.success) setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = products.find(p => String(p.product_id) === productId);
    
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        product_id: productId,
        order_code: selectedProduct.order_code,
        purchase_date: selectedProduct.order_date ? new Date(Number(selectedProduct.order_date) * 1000).toISOString().split('T')[0] : ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        product_id: productId
      }));
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formDataUpload = new FormData();
    formDataUpload.append("document", file);

    try {
      const response = await fetch("/api/v2/complains/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataUpload
      });

      const result = await response.json();
      if (result.success) {
        setUploadedDocs(prev => [...prev, result.data.url]);
        dispatch(showToast({
          message: "Document uploaded successfully",
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: result.message || "Upload failed",
          type: 'error'
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      dispatch(showToast({
        message: "Upload failed",
        type: 'error'
      }));
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = [
      { key: 'full_name', label: 'Full Name' },
      { key: 'mobile_number', label: 'Mobile Number' },
      { key: 'email', label: 'E-mail Address' },
      { key: 'product_id', label: 'Product' },
      { key: 'category', label: 'Complain Category' },
      { key: 'description', label: 'Detailed Description' }
    ];

    for (const field of requiredFields) {
      if (!formData[field.key as keyof typeof formData]) {
        const element = (document.getElementsByName(field.key)[0] || document.getElementById(field.key)) as HTMLElement;
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('border-red-500');
          setTimeout(() => element.classList.remove('border-red-500'), 3000);
        }
        dispatch(showToast({ message: `${field.label} is required.`, type: 'error' }));
        return;
      }
    }

    setSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        documents: uploadedDocs.join(",")
      };

      const response = await fetch("/api/v2/complains/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      if (result.success) {
        dispatch(showToast({
          message: "Complaint submitted successfully",
          type: 'success'
        }));
        setFormData(prev => ({
          ...prev,
          product_id: "",
          order_code: "",
          purchase_date: "",
          category: "",
          description: "",
          documents: ""
        }));
        setUploadedDocs([]);
      } else {
        dispatch(showToast({
          message: result.message || "Failed to submit complaint",
          type: 'error'
        }));
      }
    } catch (error) {
      console.error("Error submitting complain:", error);
      dispatch(showToast({
        message: "Something went wrong",
        type: 'error'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-6 bg-white rounded-2xl p-8 border border-black/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-14 w-1/3 rounded-lg ml-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Complains</h2>
        </div>

        <div className="p-6 lg:p-8">
           <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Row 1 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name<span className="text-red-500">*</span></label>
                 <input 
                  type="text" 
                  name="full_name"
                  placeholder="Enter full name" 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" 
                 />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Mobile Number<span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="mobile_number"
                      placeholder="Enter number" 
                      value={formData.mobile_number}
                      onChange={e => setFormData({...formData, mobile_number: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">E-mail Address<span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Enter email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" 
                    />
                 </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Product Name<span className="text-red-500">*</span></label>
                    <div className="relative">
                       <select 
                        name="product_id"
                        id="product_id"
                        value={formData.product_id}
                        onChange={handleProductChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 appearance-none outline-none focus:border-[#2b7fe8] transition-colors shadow-sm"
                        required
                       >
                          <option value="">Select Product</option>
                          {products.map(p => (
                            <option key={`${p.product_id}-${p.order_code}`} value={p.product_id}>
                              {p.product_name} ({p.order_code})
                            </option>
                          ))}
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Order Code<span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="enter code" 
                      value={formData.order_code}
                      onChange={e => setFormData({...formData, order_code: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" 
                      readOnly
                    />
                 </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Date of purchase<span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      value={formData.purchase_date}
                      onChange={e => setFormData({...formData, purchase_date: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#2b7fe8] transition-colors shadow-sm" 
                      readOnly
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1">Complain Category<span className="text-red-500">*</span></label>
                    <div className="relative">
                       <select 
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 appearance-none outline-none focus:border-[#2b7fe8] transition-colors shadow-sm"
                        required
                       >
                          <option value="">select category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                       </select>
                       <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                 </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-1.5">
                 <label className="text-[13px] font-semibold text-slate-700 ml-1">Detailed Description of the Complaint<span className="text-red-500">*</span></label>
                 <textarea 
                  name="description"
                  rows={6} 
                  placeholder="write" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2b7fe8] transition-colors resize-none shadow-sm" 
                  required
                 />
              </div>

              {/* Row 6: Upload */}
              <div className="space-y-4 pt-4">
                 <div 
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                 >
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#2b7fe8] transition-colors">
                       {uploadingDoc ? <Skeleton className="w-5 h-5 rounded-full" /> : <FiImage className="text-xl" />}
                    </div>
                    <div>
                       <p className="text-[11px] text-slate-400 font-medium group-hover:text-slate-600">
                         {uploadingDoc ? "Uploading..." : "Upload Supporting Documents (if any)"}
                       </p>
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                 </div>

                 {uploadedDocs.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {uploadedDocs.map((doc, idx) => (
                       <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1 text-[10px] text-slate-600 flex items-center gap-2">
                         <span>Document {idx + 1}</span>
                         <button 
                          type="button" 
                          onClick={() => setUploadedDocs(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-600"
                         >
                           ×
                         </button>
                       </div>
                     ))}
                   </div>
                 )}

                 <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={submitting || uploadingDoc}
                      className="bg-[#2b7fe8] text-white px-12 py-3 rounded-lg text-sm font-semibold hover:bg-[#1a6ed9] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting && <Skeleton className="w-4 h-4 rounded-full" />}
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                 </div>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};


export default ComplainPage;
