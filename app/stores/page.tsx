"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiCopy,
  FiMapPin,
  FiPhoneCall,
  FiSearch,
  FiShare2,
  FiTarget,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";

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

export default function StoresPage() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [expandedStoreId, setExpandedStoreId] = useState<number>(0);

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
            mapHref: loc.embedded_map_link?.match(/src="([^"]+)"/)?.[1] || "",
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

  const activeMapUrl = useMemo(() => {
    const activeStore = stores.find(s => s.id === expandedStoreId);
    return activeStore?.mapHref || "";
  }, [expandedStoreId, stores]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2b7fe8] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="mt-20 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-[#1E5AA4]">
        {banner ? (
          <div className="relative aspect-[1840/400] w-full">
            <Image src={banner} alt="Store Banner" fill className="object-cover" />
          </div>
        ) : (
          <div className="flex aspect-[1840/400] w-full items-center justify-center">
            <span className="text-3xl font-semibold text-white sm:text-4xl">Store Locations</span>
          </div>
        )}
      </section>

      <nav aria-label="Breadcrumb" className="mt-3 mb-3 flex items-center gap-2 text-[11px] text-slate-500 sm:text-xs">
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span className="font-medium text-slate-700">Store locations</span>
      </nav>

      <section className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Enter - district- thana etc...."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 pr-12 text-sm text-slate-700 outline-none transition focus:border-[#2b7fe8]/70"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded bg-[#001B33] text-white"
            aria-label="Search"
          >
            <FiSearch className="text-sm" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[180px_140px_130px_170px]">
          <select
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            className="h-8 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none"
          >
            {filterOptions.types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={division}
            onChange={(event) => setDivision(event.target.value)}
            className="h-8 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none"
          >
            {filterOptions.divisions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="h-8 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none"
          >
            {filterOptions.districts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="flex h-8 items-center justify-center gap-1 rounded bg-[#2b7fe8] px-3 text-[11px] font-semibold text-white transition hover:bg-[#1a6ed9]"
          >
            <FiTarget className="text-sm" />
            <span>Search your location</span>
          </button>
        </div>
      </section>

      <section className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="order-2 space-y-2 lg:order-1">
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => {
              const isExpanded = expandedStoreId === store.id;

              return (
                <article key={store.id} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="absolute right-0 top-0 h-9 w-9 overflow-hidden">
                    <div className="absolute right-[-10px] top-[8px] rotate-45 bg-[#1f68bf] px-4 py-[1px] text-[8px] font-semibold uppercase tracking-wide text-white">
                      {store.type}
                    </div>
                  </div>

                  <div className="mb-1.5 flex items-start justify-between gap-2 pr-6">
                    <h2 className="text-[16px] font-semibold leading-5 text-slate-800">{store.title}</h2>
                    <div className="flex items-center gap-2 text-slate-400">
                      <button 
                        type="button" 
                        onClick={() => navigator.clipboard.writeText(`${store.title}\n${store.address}\nPhone: ${store.phone}`)}
                        className="transition hover:text-[#2b7fe8]" 
                        aria-label="Copy"
                      >
                        <FiCopy className="text-[13px]" />
                      </button>
                      <button type="button" className="transition hover:text-[#2b7fe8]" aria-label="Share">
                        <FiShare2 className="text-[13px]" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[12px] text-slate-600">{store.address}</p>
                  <p className="mt-1 text-[12px] font-semibold text-slate-800">Phone: {store.phone}</p>

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setExpandedStoreId((prev) => (prev === store.id ? 0 : store.id))}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-700"
                    >
                      <span>Store Opening Hours</span>
                      <FiChevronDown className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-600 sm:grid-cols-3">
                        {store.hours.map((item, idx) => (
                          <div key={`${store.id}-${item.day}-${idx}`} className="flex items-center gap-1">
                            <span>{item.day}</span>
                            <span className="font-semibold">: {item.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Link
                      href={store.callHref}
                      className="flex h-8 items-center justify-center gap-1 rounded-full bg-[#2b7fe8] px-2 text-[11px] font-semibold text-white"
                    >
                      <FiPhoneCall className="text-[11px]" />
                      <span>Directly Call</span>
                    </Link>
                    <Link
                      href={store.messageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 items-center justify-center gap-1 rounded-full bg-[#2b7fe8] px-2 text-[11px] font-semibold text-white"
                    >
                      <FaWhatsapp className="text-[11px]" />
                      <span>Directly Message</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setExpandedStoreId(store.id)}
                      className="flex h-8 items-center justify-center gap-1 rounded-full bg-slate-100 px-2 text-[11px] font-semibold text-slate-700"
                    >
                      <FiMapPin className="text-[11px]" />
                      <span>View map</span>
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
              No stores found matching your criteria.
            </div>
          )}
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-32 lg:h-fit">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/11] w-full sm:aspect-[16/10] lg:aspect-[4/6]">
              {activeMapUrl ? (
                <iframe
                  title="Store location map"
                  src={activeMapUrl}
                  className="h-full w-full"
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
