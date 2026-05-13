"use client";

import React, { useEffect, useMemo, useState } from "react";
import { 
  FiSearch, 
  FiTarget, 
  FiCopy, 
  FiShare2, 
  FiChevronDown, 
  FiChevronUp,
  FiPhoneCall,
  FiMapPin 
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

type StoreHour = {
  day: string;
  time: string;
};

type StoreItem = {
  id: number;
  title: string;
  address: string;
  phone: string;
  callHref: string;
  messageHref: string;
  mapHref: string;
  hours: StoreHour[];
  type: string;
  division: string;
  district: string;
  area: string;
};

interface StoreLocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  embedded_map_link?: string;
  opening_hours?: string;
  type: string;
  division: string;
  district: string;
  area: string;
}

const StoreLocationsPage = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStoreId, setExpandedStoreId] = useState<number | null>(null);

  const [query, setQuery] = useState("");
  const [serviceType, setServiceType] = useState("All Types");
  const [division, setDivision] = useState("All Divisions");
  const [district, setDistrict] = useState("All Districts");

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("/api/v2/pickup-list");
        const data = await res.json();
        if (data.success) {
          const transformed = data.data.locations.map((loc: StoreLocation) => ({
            id: loc.id,
            title: loc.name,
            address: loc.address,
            phone: loc.phone,
            callHref: `tel:${loc.phone}`,
            messageHref: `https://wa.me/${loc.whatsapp_number}`,
            mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + loc.address)}`,
            hours: loc.opening_hours ? loc.opening_hours.split('\r\n').filter(Boolean).map((line: string) => {
              const [day, time] = line.split(' : ');
              return { day, time: time || "Closed" };
            }) : [],
            type: loc.type === "service_center" ? "Service Center" : loc.type === "store" ? "Brand Shop" : loc.type,
            division: loc.division,
            district: loc.district,
            area: loc.area
          }));
          setStores(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const filterOptions = useMemo(() => {
    const types = new Set<string>(["All Types"]);
    const divisions = new Set<string>(["All Divisions"]);
    const districts = new Set<string>(["All Districts"]);

    stores.forEach(s => {
      if (s.type) types.add(s.type);
      if (s.division) divisions.add(s.division);
      if (s.district) districts.add(s.district);
    });

    return {
      types: Array.from(types),
      divisions: Array.from(divisions),
      districts: Array.from(districts)
    };
  }, [stores]);

  const filteredStores = useMemo(() => {
    let result = stores;

    if (query.trim()) {
      const text = query.trim().toLowerCase();
      result = result.filter((store) => {
        const haystack = `${store.title} ${store.address} ${store.phone} ${store.area}`.toLowerCase();
        return haystack.includes(text);
      });
    }

    if (serviceType !== "All Types") {
      result = result.filter(s => s.type === serviceType);
    }
    if (division !== "All Divisions") {
      result = result.filter(s => s.division === division);
    }
    if (district !== "All Districts") {
      result = result.filter(s => s.district === district);
    }

    return result;
  }, [query, stores, serviceType, division, district]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center bg-white rounded-2xl shadow-sm border border-black/5">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2b7fe8] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 ">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden">
        <div className="p-6 lg:p-6 border-b border-slate-100">
          <h2 className="text-xl lg:text-2xl font-semibold text-slate-800">Store Locations</h2>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
           {/* Search Section */}
           <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Enter - district- thana etc...."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fe8]/10 transition-all font-medium pr-16"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#001b33] text-white p-2.5 rounded-lg hover:bg-black transition-colors">
                  <FiSearch />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center">
                 <select 
                   value={serviceType}
                   onChange={(e) => setServiceType(e.target.value)}
                   className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                 >
                   {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
                 <select 
                   value={division}
                   onChange={(e) => setDivision(e.target.value)}
                   className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                 >
                   {filterOptions.divisions.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
                 <select 
                   value={district}
                   onChange={(e) => setDistrict(e.target.value)}
                   className="w-full lg:w-1/4 bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 outline-none"
                 >
                   {filterOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
                 <button className="w-full lg:w-fit bg-[#2b7fe8] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#1a6ed9] transition-all">
                   <FiTarget className="text-lg" />
                   <span>Search your location</span>
                 </button>
              </div>
           </div>

           {/* Store Cards */}
           <div className="space-y-6">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => {
                  const isExpanded = expandedStoreId === store.id;

                  return (
                    <div key={store.id} className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group">
                      {/* Store Badge Ribbon */}
                      <div className="absolute top-0 right-0 overflow-hidden w-20 h-20 pointer-events-none">
                        <div className="absolute top-[18px] right-[-24px] bg-[#2b7fe8] text-white text-[10px] font-bold py-1 px-8 rotate-45 shadow-sm transform-gpu tracking-wider">
                          {store.type}
                        </div>
                      </div>

                      <div className="p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-4 pr-12 lg:pr-0">
                          <h3 className="text-lg lg:text-xl font-semibold text-slate-900 leading-tight">
                            {store.title}
                          </h3>
                          <div className="flex items-center gap-3 text-slate-400">
                            <button 
                              onClick={() => navigator.clipboard.writeText(`${store.title}\n${store.address}\nPhone: ${store.phone}`)}
                              className="hover:text-[#2b7fe8] transition-colors"
                            >
                              <FiCopy />
                            </button>
                            <button className="hover:text-[#2b7fe8] transition-colors"><FiShare2 /></button>
                          </div>
                        </div>

                        <div className="space-y-2 mb-8">
                          <p className="text-sm lg:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
                            {store.address}
                          </p>
                          <p className="text-sm lg:text-base text-slate-800 font-bold">
                            Phone: {store.phone}
                          </p>
                        </div>

                        {/* Opening Hours */}
                        <div className="mb-8">
                          <button 
                            onClick={() => setExpandedStoreId(isExpanded ? null : store.id)}
                            className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-800 hover:bg-blue-50 transition-colors"
                          >
                             <span>Store Opening Hours</span>
                             {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          
                          {isExpanded && store.hours.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-2 text-[10px] lg:text-[11px] font-medium text-slate-500 animate-in fade-in slide-in-from-top-1 duration-200">
                               {store.hours.map((h, i) => (
                                 <div key={i} className="flex justify-between border-b border-slate-50 pb-1">
                                   <span className="text-slate-700">{h.day}</span>
                                   <span className="font-bold">: {h.time}</span>
                                 </div>
                               ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <a 
                             href={store.callHref}
                             className="flex items-center justify-center gap-2 bg-[#2b7fe8] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#1a6ed9] transition-all shadow-sm"
                           >
                             <FiPhoneCall /> Directly Call
                           </a>
                           <a 
                             href={store.messageHref}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-2 bg-[#2b7fe8] text-white py-3.5 rounded-full text-sm font-bold hover:bg-[#1a6ed9] transition-all shadow-sm"
                           >
                             <FaWhatsapp /> Directly Message
                           </a>
                           <button 
                             onClick={() => store.mapHref && window.open(store.mapHref, "_blank")}
                             className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-3.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all"
                           >
                             <FiMapPin /> View map
                           </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 text-slate-500 font-medium">
                  No stores found matching your criteria.
                </div>
              )}
           </div>

           {/* More Loading Footer */}
           <div className="flex justify-center pt-4">
              <button className="flex items-center gap-2 text-slate-500 text-sm font-semibold hover:text-slate-800 transition-colors">
                 <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                 <span>More Loading</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocationsPage;
