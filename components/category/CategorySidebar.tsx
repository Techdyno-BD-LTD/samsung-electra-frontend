"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { HiOutlineTv } from "react-icons/hi2";

type Subcategory = {
  name: string;
  count: number;
};

type CategorySidebarProps = {
  categoryName: string;
  subcategories: Subcategory[];
};

export default function CategorySidebar({
  categoryName,
  subcategories,
}: CategorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="flex h-full w-full flex-col">
      <h2 className="mb-2 text-[14px] font-semibold text-slate-800">
        Category
      </h2>

      {/* Parent category dropdown */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-1 py-2.5 text-left text-[12px] text-slate-700 transition hover:text-blue-600"
      >
        <span className="flex items-center gap-2">
          <HiOutlineTv className="h-4 w-4 text-slate-500" />
          <span>{categoryName}</span>
        </span>
        <HiChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Subcategory list */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <ul>
          {subcategories.map((sub) => (
            <li key={sub.name}>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-slate-100 px-1 py-3.5 text-left text-[12px] text-slate-600 transition hover:text-blue-600"
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">—</span>
                  <span>{sub.name} ({sub.count})</span>
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#2F7FE8]" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
