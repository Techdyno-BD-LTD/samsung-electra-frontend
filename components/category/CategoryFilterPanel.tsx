"use client";

import { useState } from "react";
import { HiChevronUp } from "react-icons/hi2";

/* ──────────────── Brands data ──────────────── */
const brands = [
  { name: "Samsung", count: 12 },
  { name: "Whirlpool", count: 18 },
  { name: "Electra", count: 10 },
  { name: "Phillips", count: 6 },
];

/* ──────────────── Product Type data ──────────────── */
const productTypes = [
  { name: "LED TV", count: 12 },
  { name: "OLED TV", count: 18 },
  { name: "QLED TV", count: 10 },
  { name: "BASIC TV", count: 6 },
];

/* ──────────────── Display Size data ──────────────── */
const displaySizes = [
  { name: '43"', count: 18 },
  { name: '55"', count: 3 },
  { name: '45"', count: 9 },
  { name: '60"', count: 10 },
  { name: '19"', count: 3 },
  { name: '26"', count: 4 },
  { name: '36"', count: 10 },
  { name: '32"', count: 12 },
];

/* ──────────────── Bluetooth data ──────────────── */
const bluetoothOptions = [
  { name: "Bluetooth", count: 2 },
];

/* ──────────────── Color data ──────────────── */
const colorOptions = [
  { name: "White", count: 20 },
  { name: "Black", count: 16 },
];

/* ──────────────── Power data ──────────────── */
const powerOptions = [
  { name: "26 W", count: 20 },
];

/* ──────────────── Campaign data ──────────────── */
const campaignOptions = [
  { name: "Best Seller", count: 18 },
  { name: "Offers", count: 3 },
];

export default function CategoryFilterPanel() {
  /* ---- Brands ---- */
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleBrand = (name: string) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  /* ---- Price Range ---- */
  const [priceOpen, setPriceOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(12000);

  /* ---- Product Types ---- */
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const toggleType = (name: string) => {
    setSelectedTypes((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  /* ---- Display Size ---- */
  const [displaySizeOpen, setDisplaySizeOpen] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const toggleSize = (name: string) => {
    setSelectedSizes((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  /* ---- Bluetooth ---- */
  const [bluetoothOpen, setBluetoothOpen] = useState(true);
  const [selectedBluetooth, setSelectedBluetooth] = useState<string[]>([]);
  const toggleBluetooth = (name: string) => {
    setSelectedBluetooth((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  /* ---- Color ---- */
  const [colorOpen, setColorOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  /* ---- Power ---- */
  const [powerOpen, setPowerOpen] = useState(true);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const togglePower = (name: string) => {
    setSelectedPowers((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  /* ---- Campaign ---- */
  const [campaignOpen, setCampaignOpen] = useState(true);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const toggleCampaign = (name: string) => {
    setSelectedCampaigns((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ═══════════════ BRANDS SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-semibold text-slate-800">Brands</h3>
            <button
              type="button"
              onClick={() => setSelectedBrands([])}
              className="text-[12px] font-medium text-slate-400 transition hover:text-red-500"
            >
              Reset
            </button>
          </div>
          {/* Blue partial underline */}
          <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />
        </div>

        {/* Checkbox list */}
        <ul className="flex flex-col gap-2.5">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand.name);
            return (
              <li key={brand.name}>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                        ? "border-slate-800 bg-slate-800"
                        : "border-slate-300 bg-white"
                        }`}
                    >
                      {checked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleBrand(brand.name)}
                    />
                    <span className="text-[16px] text-slate-600">
                      {brand.name}
                    </span>
                  </span>
                  <span className="text-[12px] text-slate-400">
                    {brand.count}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ═══════════════ PRICE RANGE SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        {/* Header */}
        <button
          type="button"
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">
            Price Range
          </h3>

          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${priceOpen ? "" : "rotate-180"
              }`}
          />

        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />
        {/* Collapsible content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${priceOpen ? "mt-3 max-h-[200px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {/* Price labels */}
          <div className="mb-3 flex items-center justify-between text-[24px] text-slate-700">
            <span>৳{minPrice.toLocaleString()}</span>
            <span className="text-slate-400">—</span>
            <span>৳{maxPrice.toLocaleString()}</span>
          </div>

          {/* Dual range slider (simplified single slider for max) */}
          <div className="relative">
            {/* Track background */}
            <div className="h-[3px] w-full rounded-full bg-slate-200" />
            {/* Active track */}
            <div
              className="absolute top-0 h-[3px] rounded-full bg-[#2B7FE8]"
              style={{
                left: `${(minPrice / 200000) * 100}%`,
                right: `${100 - (maxPrice / 200000) * 100}%`,
              }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < maxPrice) setMinPrice(val);
              }}
              className="price-range-slider absolute top-[-6px] w-full"
            />
            {/* Max thumb */}
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > minPrice) setMaxPrice(val);
              }}
              className="price-range-slider absolute top-[-6px] w-full"
            />
          </div>

          {/* Input fields */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-center text-[18px] text-slate-600 outline-none focus:border-blue-400"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-center text-[18px] text-slate-600 outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════ PRODUCT TYPE SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[24px] font-semibold text-slate-800">
            Product Type
          </h3>
          <button
            type="button"
            onClick={() => setSelectedTypes([])}
            className="text-[12px] font-medium text-slate-400 transition hover:text-red-500"
          >
            Reset
          </button>
        </div>
        <div className="mt-2 mb-3 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        {/* Checkbox list */}
        <ul className="flex flex-col gap-2.5">
          {productTypes.map((pt) => {
            const checked = selectedTypes.includes(pt.name);
            return (
              <li key={pt.name}>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                        ? "border-slate-800 bg-slate-800"
                        : "border-slate-300 bg-white"
                        }`}
                    >
                      {checked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleType(pt.name)}
                    />
                    <span className="text-[16px] text-slate-600">
                      {pt.name}
                    </span>
                  </span>
                  <span className="text-[12px] text-slate-400">{pt.count}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ═══════════════ DISPLAY SIZE SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setDisplaySizeOpen(!displaySizeOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Display Size</h3>
          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${displaySizeOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${displaySizeOpen ? "mt-3 max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {displaySizes.map((size) => {
              const checked = selectedSizes.includes(size.name);
              return (
                <li key={size.name}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                          ? "border-slate-800 bg-slate-800"
                          : "border-slate-300 bg-white"}`}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleSize(size.name)} />
                      <span className="text-[16px] text-slate-600">{size.name}</span>
                    </span>
                    <span className="text-[12px] text-slate-400">{String(size.count).padStart(2, '0')}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ═══════════════ BLUETOOTH SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setBluetoothOpen(!bluetoothOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Bluetooth</h3>
          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${bluetoothOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${bluetoothOpen ? "mt-3 max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {bluetoothOptions.map((bt) => {
              const checked = selectedBluetooth.includes(bt.name);
              return (
                <li key={bt.name}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                          ? "border-slate-800 bg-slate-800"
                          : "border-slate-300 bg-white"}`}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleBluetooth(bt.name)} />
                      <span className="text-[16px] text-slate-600">{bt.name}</span>
                    </span>
                    <span className="text-[12px] text-slate-400">{String(bt.count).padStart(2, '0')}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ═══════════════ COLOR SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setColorOpen(!colorOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Color</h3>
          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${colorOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${colorOpen ? "mt-3 max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {colorOptions.map((color) => {
              const checked = selectedColors.includes(color.name);
              return (
                <li key={color.name}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                          ? "border-slate-800 bg-slate-800"
                          : "border-slate-300 bg-white"}`}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleColor(color.name)} />
                      <span className="text-[16px] text-slate-600">{color.name}</span>
                    </span>
                    <span className="text-[12px] text-slate-400">{String(color.count).padStart(2, '0')}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ═══════════════ POWER SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setPowerOpen(!powerOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Power</h3>
          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${powerOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${powerOpen ? "mt-3 max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {powerOptions.map((pw) => {
              const checked = selectedPowers.includes(pw.name);
              return (
                <li key={pw.name}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                          ? "border-slate-800 bg-slate-800"
                          : "border-slate-300 bg-white"}`}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => togglePower(pw.name)} />
                      <span className="text-[16px] text-slate-600">{pw.name}</span>
                    </span>
                    <span className="text-[12px] text-slate-400">{String(pw.count).padStart(2, '0')}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ═══════════════ CAMPAIGN SECTION ═══════════════ */}
      <div className="rounded-md border border-slate-200 bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setCampaignOpen(!campaignOpen)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="text-[24px] font-semibold text-slate-800">Campaign</h3>
          <HiChevronUp
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${campaignOpen ? "" : "rotate-180"}`}
          />
        </button>
        <div className="mt-2 h-[2.5px] w-[50%] rounded-full bg-gradient-to-r from-[#2B7FE8] via-[#2B7FE8]/60 to-transparent" />

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${campaignOpen ? "mt-3 max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
          <ul className="flex flex-col gap-2.5">
            {campaignOptions.map((cp) => {
              const checked = selectedCampaigns.includes(cp.name);
              return (
                <li key={cp.name}>
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border transition-colors ${checked
                          ? "border-slate-800 bg-slate-800"
                          : "border-slate-300 bg-white"}`}
                      >
                        {checked && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleCampaign(cp.name)} />
                      <span className="text-[16px] text-slate-600">{cp.name}</span>
                    </span>
                    <span className="text-[12px] text-slate-400">{String(cp.count).padStart(2, '0')}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
