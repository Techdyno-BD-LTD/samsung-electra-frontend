"use client"
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryHeroBanner from "@/components/category/CategoryHeroBanner";
import CategoryFilterPanel from "@/components/category/CategoryFilterPanel";
import SearchProductGrid from "@/components/search/SearchProductGrid";
import CategoryFAQ from "@/components/category/CategoryFAQ";
import { HiChevronLeft } from "react-icons/hi2";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("cat");

  return (
    <div className="mainwidth mx-auto px-4 lg:px-0">
      <div className="mt-4 lg:mt-16">
        {/* ═══════════════ MOBILE NAVIGATION ═══════════════ */}
        <div className="mb-4 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <HiChevronLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* ═══════════════ BREADCRUMB ═══════════════ */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 hidden items-center gap-2 text-[12px] leading-none text-slate-500 lg:flex lg:text-sm"
        >
          <Link href="/" className="transition hover:text-slate-700">
            Home
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-slate-700">Search Results</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-700">&quot;{query}&quot;</span>
        </nav>

        {/* ═══════════════ MAIN LAYOUT ═══════════════ */}
        <div className="flex flex-col gap-4 lg:grid lg:items-stretch lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Desktop Sidebar (Optional for Search, maybe show categories?) */}
          <div className="hidden lg:flex lg:flex-col">
            <CategorySidebar
              categoryName="Search Categories"
              subcategories={[]}
            />
          </div>

          <div className="min-w-0">
            <CategoryHeroBanner />
          </div>
        </div>

        {/* ═══════════════ FILTER + PRODUCTS SECTION ═══════════════ */}
        <div className="mt-2 lg:mt-6 flex gap-[1%]">
          {/* Desktop Filter panel */}
          <aside className="hidden w-[24%] shrink-0 lg:block">
            <CategoryFilterPanel />
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1 lg:w-[73%]">
            <SearchProductGrid query={query} categoryId={categoryId} />
          </div>
        </div>

        {/* Search FAQ or relevant content */}
        <div className="mt-8 lg:mt-0">
          <CategoryFAQ categoryName={`Search: ${query}`} />
        </div>
      </div>
    </div>
  );
}
