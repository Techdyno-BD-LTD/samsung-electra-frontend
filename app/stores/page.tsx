"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import storeData from "@/database/storelocations.json";

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
};

export default function StoresPage() {
  const stores = storeData.stores as StoreItem[];
  const [expandedStoreId, setExpandedStoreId] = useState<number>(stores[0]?.id ?? 0);

  const [query, setQuery] = useState("");
  const [serviceType, setServiceType] = useState(storeData.filters.serviceTypes[0] ?? "Service Center");
  const [division, setDivision] = useState(storeData.filters.divisions[0] ?? "Division");
  const [district, setDistrict] = useState(storeData.filters.districts[0] ?? "District");

  const filteredStores = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return stores;
    }

    return stores.filter((store) => {
      const haystack = `${store.title} ${store.address} ${store.phone}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [query, stores]);

  return (
    <main className="mt-20 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-[#1E5AA4]">
        <div className="flex aspect-[1840/400] w-full items-center justify-center">
          <span className="text-3xl font-semibold text-white sm:text-4xl">{storeData.banner.label}</span>
        </div>
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
            placeholder={storeData.searchPlaceholder}
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
            {storeData.filters.serviceTypes.map((item) => (
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
            {storeData.filters.divisions.map((item) => (
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
            {storeData.filters.districts.map((item) => (
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
          {filteredStores.map((store) => {
            const isExpanded = expandedStoreId === store.id;

            return (
              <article key={store.id} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <div className="absolute right-0 top-0 h-9 w-9 overflow-hidden">
                  <div className="absolute right-[-10px] top-[8px] rotate-45 bg-[#1f68bf] px-4 py-[1px] text-[8px] font-semibold uppercase tracking-wide text-white">
                    Store
                  </div>
                </div>

                <div className="mb-1.5 flex items-start justify-between gap-2 pr-6">
                  <h2 className="text-[16px] font-semibold leading-5 text-slate-800">{store.title}</h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <button type="button" className="transition hover:text-[#2b7fe8]" aria-label="Copy">
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
                      {store.hours.map((item) => (
                        <div key={`${store.id}-${item.day}`} className="flex items-center gap-1">
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
                  <Link
                    href={store.mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 items-center justify-center gap-1 rounded-full bg-slate-100 px-2 text-[11px] font-semibold text-slate-700"
                  >
                    <FiMapPin className="text-[11px]" />
                    <span>View map</span>
                  </Link>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            className="mx-auto mt-1 flex items-center gap-1.5 text-[13px] text-slate-600 transition hover:text-slate-900"
          >
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border border-slate-400 border-t-transparent" />
            <span>More Loading</span>
          </button>
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-32 lg:h-fit">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/11] w-full sm:aspect-[16/10] lg:aspect-[4/6]">
              <iframe
                title={storeData.map.title}
                src={storeData.map.embedUrl}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
