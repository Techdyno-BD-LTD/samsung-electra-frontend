"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiEdit, FiTrash2, FiPlus, FiChevronDown } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import Skeleton from "@/components/common/Skeleton";

interface Address {
  id: number;
  user_id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  postal_code: string;
  set_default: number;
  country_id?: number;
  country_name?: string;
  state_name?: string;
  city_name?: string;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAppSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    phone: user?.phone || "",
    postal_code: "",
    country_id: "",
    state_id: "",
    city_id: "",
    area_id: "",
    area: "",
    set_default: 0
  });

  const [districts, setDistricts] = useState<{ id: number; name: string }[]>([]);
  const [thanas, setThanas] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  const fetchAddresses = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/v2/user/shipping/address", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const payload = await response.json();
      if (payload.success) {
        setAddresses(payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDistricts = useCallback(async () => {
    try {
      const response = await fetch("/api/v2/districts");
      const payload = await response.json();
      if (payload.success) setDistricts(payload.data);
    } catch (error) {
      console.error("Failed to fetch districts", error);
    }
  }, []);

  const fetchCities = async (districtId: string) => {
    if (!districtId) return;
    try {
      const response = await fetch(`/api/v2/cities-by-district/${districtId}`);
      const payload = await response.json();
      if (payload.success) setThanas(payload.data);
    } catch (error) {
      console.error("Failed to fetch cities", error);
    }
  };

  const fetchAreas = async (cityId: string) => {
    if (!cityId) return;
    try {
      const response = await fetch(`/api/v2/areas-by-city/${cityId}`);
      const payload = await response.json();
      if (payload.success) setCities(payload.data);
    } catch (error) {
      console.error("Failed to fetch areas", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchDistricts();
  }, [fetchAddresses, fetchDistricts]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const response = await fetch(`/api/v2/user/shipping/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingAddress 
      ? "/api/v2/user/shipping/update" 
      : "/api/v2/user/shipping/create";
    
    const payload_body: any = editingAddress 
      ? { ...formData, id: editingAddress.id } 
      : formData;
    
    if (!payload_body.city_id) delete payload_body.city_id;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload_body)
      });
      const payload = await response.json();
      if (payload.success) {
        fetchAddresses();
        setShowModal(false);
        setEditingAddress(null);
        setFormData({ 
          name: user?.name || "", 
          email: user?.email || "", 
          address: "", 
          phone: user?.phone || "", 
          postal_code: "", 
          country_id: "",
          state_id: "",
          city_id: "",
          area_id: "",
          set_default: 0 
        });
      }
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || user?.name || "",
      email: address.email || user?.email || "",
      address: address.address,
      phone: address.phone,
      postal_code: address.postal_code,
      country_id: address.country_id?.toString() || "",
      state_id: address.state_id?.toString() || "",
      city_id: address.city_id?.toString() || "",
      area_id: address.area_id?.toString() || "",
      set_default: address.set_default
    });
    if (address.country_id) fetchCities(address.country_id.toString());
    if (address.state_id) fetchAreas(address.state_id.toString());
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Manage Addresses</h2>
            <button 
            onClick={() => {
              setEditingAddress(null);
              setFormData({ 
                name: user?.name || "", 
                email: user?.email || "", 
                address: "", 
                phone: user?.phone || "", 
                postal_code: "", 
                country_id: "",
                state_id: "",
                city_id: "",
                area_id: "",
                area: "",
                set_default: 0 
              });
              setShowModal(true);
            }}
            className="bg-[#1877f2] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-600 transition-all"
          >
            <FiPlus /> Add new address
          </button>
        </div>

        <div className="p-6 lg:p-8 flex flex-col gap-6">
          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No addresses saved yet.</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{addr.name || user?.name}</h3>
                    {addr.set_default === 1 && (
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mb-1">{addr.phone}</p>
                  <p className="text-sm text-slate-700 mb-1">{addr.email || user?.email}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {addr.address}, {addr.city_name ? `${addr.city_name}, ` : ''}{addr.state_name}, {addr.country_name}, {addr.postal_code}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => openEdit(addr)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#2b7fe8] transition-colors text-sm font-medium p-2"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-medium p-2"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="017********"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="1207"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Street Address / House / Road</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 123 Street Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">District</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.country_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, country_id: val, state_id: "", city_id: "" });
                        fetchCities(val);
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none appearance-none"
                    >
                      <option value="">Select District</option>
                      {districts.map((d: { id: number; name: string }) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">City</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.state_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({ ...formData, state_id: val, city_id: "" });
                        fetchAreas(val);
                      }}
                      disabled={!formData.country_id}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select City</option>
                      {thanas.map((t: { id: number; name: string }) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Thana / Area (Optional)</label>
                <div className="relative">
                  <select
                    value={formData.city_id}
                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                    disabled={!formData.state_id}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-12 text-sm focus:ring-2 focus:ring-[#2b7fe8]/20 focus:border-[#2b7fe8] transition-all outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Thana / Area</option>
                    {cities.map((c: { id: number; name: string }) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="set_default"
                  checked={formData.set_default === 1}
                  onChange={(e) => setFormData({ ...formData, set_default: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-[#2b7fe8] border-gray-300 rounded focus:ring-[#2b7fe8]"
                />
                <label htmlFor="set_default" className="text-sm font-medium text-gray-700">Set as default address</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2b7fe8] text-white px-6 h-12 rounded-xl font-bold hover:bg-[#1a6ed9] transition-all shadow-lg shadow-blue-500/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
