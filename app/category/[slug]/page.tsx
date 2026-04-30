import { notFound } from "next/navigation";
import Link from "next/link";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryHeroBanner from "@/components/category/CategoryHeroBanner";
import CategoryFilterPanel from "@/components/category/CategoryFilterPanel";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import CategoryFAQ from "@/components/category/CategoryFAQ";
import { HiChevronLeft } from "react-icons/hi2";

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  icon: string | null;
  cover_image: string | null;
  number_of_products: number;
};

type PageProps = {
  params: { slug: string };
};

async function getCategoryData(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${siteUrl}/api/categories`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    
    const payload = await res.json();
    const categories: ApiCategory[] = payload.data || [];
    
    // Find the current category by slug
    // We normalize the slug matching to be more resilient
    const currentCategory = categories.find(c => 
      c.slug === slug || 
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === slug
    );
    
    if (!currentCategory) return null;
    
    // Find subcategories
    const subcategories = categories
      .filter(c => c.parent_id === currentCategory.id)
      .map(c => ({
        name: c.name,
        count: c.number_of_products || 0,
        slug: c.slug
      }));
      
    return {
      ...currentCategory,
      subcategories
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const category = await getCategoryData(params.slug);
  
  if (!category) {
    return {
      title: "Category not found | Electra",
      description: "We can't locate the requested category.",
    };
  }
  
  return {
    title: `${category.name} | Samsung Electra`,
    description: `Browse ${category.name} products at Samsung Electra. Find ${category.subcategories.map((s) => s.name).join(", ")} and more.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const category = await getCategoryData(params.slug);

  if (!category) {
    notFound();
  }

  // Build breadcrumb parts from the category name
  const breadcrumbParts = category.name.split(" ");
  const shortName = breadcrumbParts[0]; // e.g., "TV" from "TV and Audio"

  return (
    <div className="mt-4 lg:mt-16">
      {/* ═══════════════ MOBILE NAVIGATION (Hidden on Desktop) ═══════════════ */}
      <div className="mb-4 lg:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <HiChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* ═══════════════ BREADCRUMB (Hidden on Mobile) ═══════════════ */}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 hidden items-center gap-2 text-[12px] leading-none text-slate-500 lg:flex lg:text-sm"
      >
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span>All {shortName}</span>
        <span className="text-slate-400">›</span>
        <span className="text-slate-700">{shortName}</span>
      </nav>

      {/* ═══════════════ MAIN LAYOUT ═══════════════ */}
      <div className="flex flex-col gap-4 lg:grid lg:items-stretch lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:flex-col">
          <CategorySidebar
            categoryName={category.name}
            subcategories={category.subcategories}
          />
        </div>

        {/* Hero banner (Shared, but might need different margins on mobile) */}
        <div className="min-w-0">
          <CategoryHeroBanner />

          {/* ═══════════════ MOBILE SUB-CATEGORIES (Hidden on Desktop) ═══════════════ */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide lg:hidden">
            <button className="whitespace-nowrap rounded-full bg-[#1A80FE] px-6 py-1 text-[12px] font-medium text-white shadow-sm">
              All
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.name}
                className="whitespace-nowrap rounded-full bg-[#F3F4F6] px-6 py-1 text-[12px] font-medium text-[#374151] transition hover:bg-slate-200"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ FILTER + PRODUCTS SECTION ═══════════════ */}
      <div className="mt-2 lg:mt-6 flex gap-[1%]">
        {/* Desktop Filter panel — 24% width (Hidden on Mobile) */}
        <aside className="hidden w-[24%] shrink-0 lg:block">
          <CategoryFilterPanel />
        </aside>

        {/* Product grid — takes remaining space (~73% on desktop, full width on mobile) */}
        <div className="min-w-0 flex-1 lg:w-[73%]">
          <CategoryProductGrid />
        </div>
      </div>

      {/* Category FAQ and SEO content section */}
      <div className="mt-8 lg:mt-0">
        <CategoryFAQ categoryName={category.name} />
      </div>
    </div>
  );
}
