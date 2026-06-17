import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiFolder, FiGrid, FiList } from "react-icons/fi";

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  icon: string | null;
  cover_image: string | null;
  number_of_products?: number;
};

async function getCategoriesData() {
  const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const res = await fetch(`${backendUrl}/api/v2/categories?limit=100`, {
      headers: { 'x-system-key': systemKey },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const payload = await res.json();
    return (payload.data || []) as ApiCategory[];
  } catch (error) {
    console.error("Error fetching categories data:", error);
    return [];
  }
}

export const metadata = {
  title: "All Categories | Samsung Electra",
  description: "Browse all categories of appliances, electronics, mobile phones, and home products at Samsung Electra.",
};

export default async function CategoriesPage() {
  const allCategories = await getCategoriesData();

  // Filter parent categories
  const parentCategories = allCategories.filter(c => c.parent_id === 0);

  // Group subcategories by parent_id
  const getSubcategories = (parentId: number) => {
    return allCategories.filter(c => c.parent_id === parentId);
  };

  return (
    <div className="mainwidth mx-auto  mt-8 lg:mt-12 mb-16 ">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center space-x-1.5">
        <Link href="/" className="cursor-pointer hover:text-gray-900 transition-colors">Home</Link>
        <FiChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">All Categories</span>
      </nav>

      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <FiGrid className="text-[#1877f2] w-7 h-7 lg:w-9 lg:h-9" />
          Shop By Categories
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-500 max-w-2xl">
          Explore our wide range of premium electronics, appliances, and accessories curated to fit your modern lifestyle.
        </p>
        <div className="mt-4 h-[3px] w-24 bg-gradient-to-r from-[#1877f2] to-blue-400 rounded-full mx-auto md:mx-0" />
      </div>

      {parentCategories.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <FiFolder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No categories available at the moment.</p>
          <Link href="/" className="mt-4 inline-block bg-[#1877f2] hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors text-sm">
            Go back Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Jump Sidebar (Large screens) */}
          <aside className="hidden md:block md:col-span-1">
            <div className="sticky top-[120px] bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3 flex items-center gap-1.5">
                <FiList className="w-3.5 h-3.5" /> Quick Navigation
              </h3>
              {parentCategories.map((parent) => (
                <a
                  key={parent.id}
                  href={`#category-${parent.slug}`}
                  className="block px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#1877f2] hover:bg-blue-50/50 rounded-xl transition-all duration-200"
                >
                  {parent.name}
                </a>
              ))}
            </div>
          </aside>

          {/* Categories Grid List */}
          <div className="md:col-span-3 space-y-10">
            {parentCategories.map((parent) => {
              const subcategories = getSubcategories(parent.id);
              const totalProducts = parent.number_of_products || 0;

              return (
                <section
                  key={parent.id}
                  id={`category-${parent.slug}`}
                  className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 scroll-mt-[130px]"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-5 gap-3">
                    <Link
                      href={`/category/${parent.slug}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl relative overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center transition-colors group-hover:bg-blue-50/50">
                        <Image
                          src={parent.cover_image || parent.icon || "/images/placeholder.png"}
                          alt={parent.name}
                          fill
                          sizes="56px"
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#1877f2] transition-colors leading-tight">
                          {parent.name}
                        </h2>
                        <span className="inline-block mt-0.5 text-xs text-slate-400 font-medium">
                          {totalProducts > 0 ? `${totalProducts} Products` : "Browse all items"}
                        </span>
                      </div>
                    </Link>

                    <Link
                      href={`/category/${parent.slug}`}
                      className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-[#1877f2] hover:underline"
                    >
                      View All Products <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Subcategories Grid */}
                  {subcategories.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No subcategories listed.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {subcategories.map((sub) => {
                        const subProducts = sub.number_of_products || 0;
                        return (
                          <Link
                            key={sub.id}
                            href={`/category/${sub.slug}`}
                            className="group flex flex-col p-3 bg-gray-50/50 hover:bg-blue-50/30 border border-transparent hover:border-blue-100 rounded-xl transition-all duration-200"
                          >
                            <span className="font-semibold text-xs md:text-sm text-gray-700 group-hover:text-[#1877f2] transition-colors line-clamp-1">
                              {sub.name}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1 font-medium">
                              {subProducts > 0 ? `${subProducts} Items` : "View details"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
