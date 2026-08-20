"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiCopy,

  FiSearch,
  FiShare2,
} from "react-icons/fi";

import Image from "next/image";
import Skeleton from "@/components/common/Skeleton";

type StoreItem = {
  id: number;
  title: string;
  address: string;
  phone: string;
  email: string | null;
  callHref: string;
  messageHref: string;
  mapHref: string;
  openingHours: string;
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
  email?: string | null;
  whatsapp_number: string;
  embedded_map_link?: string;
  opening_hours?: string;
  type: string;
  division: string;
  district: string;
  area: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedStoreId, setExpandedStoreId] = useState<number>(0);

  const [query, setQuery] = useState("");
  const [division, setDivision] = useState("All Divisions");
  const [district, setDistrict] = useState("All Districts");
  const [selectedShowroom, setSelectedShowroom] = useState("All Showrooms");

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
            email: loc.email || "info@electrabd.com",
            callHref: `tel:${loc.phone}`,
            messageHref: `https://wa.me/${loc.whatsapp_number}`,
            mapHref: (() => {
              const raw = loc.embedded_map_link || "";
              let href = raw.match(/src="([^"]+)"/)?.[1] || raw;
              href = href.replace(/&amp;/g, "&");
              if (href.includes("google.com/maps/embed") && !href.includes("!3f0")) {
                href = href.replace("!3m2", "!3f0!3m2");
              }
              if (!href) {
                return `https://maps.google.com/maps?q=${encodeURIComponent(loc.name + ", " + loc.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
              }
              return encodeURI(href);
            })(),
            openingHours: loc.opening_hours || "10:00 AM - 08:00 PM (Friday Closed)",
            type: loc.type === "service_center" ? "Service Center" : loc.type === "store" ? "Brand Shop" : loc.type,
            division: loc.division,
            district: loc.district,
            area: loc.area
          }));
          setStores(transformed);
          setBanner(data.data.banner);
          if (transformed.length > 0) {
            setExpandedStoreId(transformed[0].id);
          }
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
    const divisions = new Set<string>(["All Divisions"]);
    const districts = new Set<string>(["All Districts"]);

    stores.forEach(s => {
      if (s.division) divisions.add(s.division);
      if (s.district) districts.add(s.district);
    });

    return {
      divisions: Array.from(divisions),
      districts: Array.from(districts)
    };
  }, [stores]);

  const filteredShowroomsForDropdown = useMemo(() => {
    let list = stores;
    if (division !== "All Divisions") {
      list = list.filter(s => s.division === division);
    }
    if (district !== "All Districts") {
      list = list.filter(s => s.district === district);
    }
    return ["All Showrooms", ...list.map(s => s.title)];
  }, [stores, division, district]);

  const filteredStores = useMemo(() => {
    let result = stores;

    if (query.trim()) {
      const text = query.trim().toLowerCase();
      result = result.filter((store) => {
        const haystack = `${store.title} ${store.address} ${store.phone} ${store.area}`.toLowerCase();
        return haystack.includes(text);
      });
    }

    if (division !== "All Divisions") {
      result = result.filter(s => s.division === division);
    }
    if (district !== "All Districts") {
      result = result.filter(s => s.district === district);
    }
    if (selectedShowroom !== "All Showrooms") {
      result = result.filter(s => s.title === selectedShowroom);
    }

    return result;
  }, [query, stores, division, district, selectedShowroom]);

  const activeMapUrl = useMemo(() => {
    const activeStore = stores.find(s => s.id === expandedStoreId);
    return activeStore?.mapHref || "";
  }, [expandedStoreId, stores]);

  const handleShowroomChange = (val: string) => {
    setSelectedShowroom(val);
    if (val !== "All Showrooms") {
      const found = stores.find(s => s.title === val);
      if (found) {
        setExpandedStoreId(found.id);
      }
    }
  };

  const parseOpeningDetails = (hoursStr: string) => {
    // E.g. "10:00 AM - 09:00 PM (Friday Closed)"
    const match = hoursStr.match(/^([^(]+)\s*\(([^)]+)\)$/);
    if (match) {
      return {
        time: match[1].trim(),
        holiday: match[2].replace(/Closed|Open/gi, "").trim() || "None"
      };
    }
    return { time: hoursStr, holiday: "N/A" };
  };

  const handleCopy = (store: StoreItem) => {
    const text = `${store.title}\n${store.address}\nPhone: ${store.phone}\nEmail: ${store.email}`;
    navigator.clipboard.writeText(text);
    alert("Store details copied to clipboard!");
  };

  const handleShare = (store: StoreItem) => {
    if (navigator.share) {
      navigator.share({
        title: store.title,
        text: `${store.address}\nPhone: ${store.phone}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      handleCopy(store);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto px-4 md:px-8 py-24 space-y-12 animate-in fade-in duration-500">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-[600px] w-full rounded-xl sticky top-24" />
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-full mx-auto   pt-20 pb-16 sm:pt-24 lg:pt-6">
      {/* Breadcrumbs & Centered Title */}
      <div className="relative w-11/12 mx-auto  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="transition hover:text-slate-700">
            Home
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="font-medium text-slate-700">Store Location</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-800 text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          Our Stores
        </h1>
        <div className="hidden sm:block w-20" />
      </div>

      {/* Hero Search Section */}
      <section className="relative overflow-hidden  bg-[#1e293b] text-white min-h-[280px] flex flex-col justify-center items-center px-6 py-10 shadow-md">
        {banner ? (
          <Image
            src={banner}
            alt="Store Locations Banner"
            fill
            className="object-fill  pointer-events-none"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-60" />
        )}
        
        <div className="relative z-10 text-center w-full max-w-6xl space-y-6">
          <h2 className="text-3xl font-normal font-poppins   tracking-wide sm:text-4xl text-white drop-shadow-sm">
            Electra International All Stores
          </h2>
          <div className="relative mx-auto max-w-full w-full">
            <div className="relative flex items-center ">
              <input
                type="text"
                placeholder="Search your nearest place here..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full border border-white bg-transparent   rounded-xl px-5 pr-14 text-sm text-white placeholder-slate-400 "
              />
              <button
                type="button"
                className="absolute right-0 top-0 flex h-12 w-14 rounded-r-xl items-center justify-center bg-[#2b7fe8] text-white hover:bg-blue-600 transition"
                aria-label="Search"
              >
                <FiSearch className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown Filters Row */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* Division Selector */}
        <div className="relative">
          <select
            value={division}
            onChange={(e) => {
              setDivision(e.target.value);
              setDistrict("All Districts");
              setSelectedShowroom("All Showrooms");
            }}
            className="w-full appearance-none rounded-full border border-slate-200 bg-[#eff6ff] px-6 py-3 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="All Divisions">Select Division</option>
            {filterOptions.divisions.filter(d => d !== "All Divisions").map((item) => (
              <option key={item} value={item}>
                Division: {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <FiChevronDown className="text-base" />
          </div>
        </div>

        {/* District Selector */}
        <div className="relative">
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setSelectedShowroom("All Showrooms");
            }}
            className="w-full appearance-none rounded-full border border-slate-200 bg-[#eff6ff] px-6 py-3 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="All Districts">Select District</option>
            {filterOptions.districts.filter(d => d !== "All Districts").map((item) => (
              <option key={item} value={item}>
                District: {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <FiChevronDown className="text-base" />
          </div>
        </div>

        {/* Showroom Selector */}
        <div className="relative">
          <select
            value={selectedShowroom}
            onChange={(e) => handleShowroomChange(e.target.value)}
            className="w-full appearance-none rounded-full border border-slate-200 bg-[#eff6ff] px-6 py-3 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="All Showrooms">Select Showroom</option>
            {filteredShowroomsForDropdown.filter(s => s !== "All Showrooms").map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <FiChevronDown className="text-base" />
          </div>
        </div>
      </section>

      {/* Main Split Layout */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] w-11/12 mx-auto items-start">
        {/* Left Side: Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => {
              const { time, holiday } = parseOpeningDetails(store.openingHours);
              const isActive = expandedStoreId === store.id;

              return (
                <article
                  key={store.id}
                  onClick={() => setExpandedStoreId(store.id)}
                  className={`cursor-pointer flex flex-col justify-between overflow-hidden rounded-lg border transition-all duration-200 ${
                    isActive ? "border-blue-400 ring-1 ring-blue-400" : "border-slate-200"
                  } bg-[#EDF2FB] shadow-sm hover:shadow-md`}
                >
                  {/* Card Header Bar */}
                  <div className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                    isActive ? "bg-[#2b7fe8] text-white" : "bg-[#EDF2FB] text-slate-800"
                  }`}>
                    <h3 className="text-base font-bold tracking-wide truncate max-w-[80%]">
                      {store.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(store)}
                        className={`p-1 transition ${isActive ? "hover:text-blue-100 text-white" : "hover:text-slate-900 text-slate-500"}`}
                        title="Copy details"
                      >
                        <FiCopy className="text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare(store)}
                        className={`p-1 transition ${isActive ? "hover:text-blue-100 text-white" : "hover:text-slate-900 text-slate-500"}`}
                        title="Share store"
                      >
                        <FiShare2 className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 space-y-2 text-[11px] text-slate-600 bg-[#EDF2FB]">
                    <p className="leading-relaxed font-medium text-slate-700 min-h-[32px]">
                  {store.address}, {store.area}, {store.division}                    </p>
                    <div className="space-y-0.5 pt-1 border-t border-slate-200/50">
                      <p>
                        <span className="font-semibold text-slate-800">Opening :</span> {time}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Holiday :</span> {holiday}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Phone :</span> {store.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-800">Email :</span> {store.email}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="grid grid-cols-3 2xl:grid-cols-4 gap-1.5 p-3 bg-[#EDF2FB] border-t border-slate-200/50">
                    <Link
                      href={store.callHref}
                      className="flex h-8 items-center justify-center gap-1 rounded-full bg-gradient-to-t from-blue-600 to-blue-500 text-white hover:bg-blue-600 transition text-[12px] font-bold shadow-sm"
                    >
                    
                      <span>Call Now</span>
                    </Link>
                    <Link
                      href={store.messageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 items-center justify-center gap-1 rounded-full border border-blue-500 bg-transparent  text-black hover:bg-blue-50 transition text-[12px] font-bold"
                    >
                     
                      <span>Send Message</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedStoreId(store.id)}
                      className={`flex h-8 items-center justify-center gap-1 rounded-full border transition text-[12px] font-bold ${
                        isActive
                          ? "border-blue-400 bg-blue-50 text-black"
                          : "border-blue-500 bg-transparent text-black  hover:bg-slate-50"
                      }`}
                    >
                
                      <span>View Map</span>
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              No stores found matching your criteria.
            </div>
          )}
        </div>

        {/* Right Side: Map Container */}
        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/12] w-full sm:aspect-[16/10] lg:aspect-[4/5]">
              {activeMapUrl ? (
                <iframe
                  title="Store location map"
                  src={activeMapUrl}
                  className="h-full w-full border-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                  Select a store to view map
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
