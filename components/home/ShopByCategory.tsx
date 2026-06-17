import Image from "next/image";
import Link from "next/link";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  itemCount: string;
  imageSrc: string;
  imageAlt: string;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  cover_image: string | null;
  icon: string | null;
  parent_id?: number;
  number_of_products?: number;
};

async function getCategories(): Promise<CategoryItem[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${siteUrl}/api/categories`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data: ApiCategory[] = json.data || [];

    // Filter for parent categories, take first 6 and map to CategoryItem
    return data.filter((c) => c.parent_id === 0).slice(0, 6).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      itemCount: `${item.number_of_products || 0}+ Items`,
      imageSrc: item.cover_image || item.icon || "/images/placeholder.png",
      imageAlt: item.name,
    }));
  } catch (error) {
    console.error("Error loading categories for ShopByCategory:", error);
    return [];
  }
}

export default async function ShopByCategory() {
  const dynamicCategories = await getCategories();

  if (dynamicCategories.length === 0) return null;

  return (
    <section className="mx-auto space-y-6 mb-10 lg:mb-14">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">Shop by category</h2>
          <div className="mt-2 sm:mt-5 h-[2px] w-full max-w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:max-w-[380px]" />
        </div>

        <Link
          href="/categories"
          className="inline-flex flex-shrink-0 items-center rounded-full border border-[#2F73BD] px-4 py-1.5 text-xs font-medium text-[#2F73BD] transition hover:bg-[#2F73BD] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
        >
          See More
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-4">
        {dynamicCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center rounded-xl sm:rounded-2xl bg-white p-2 sm:p-3 transition-all duration-300 hover:shadow-md lg:p-4 hover:-translate-y-0.5 border border-transparent hover:border-[#2F73BD]/30"
          >
            <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-50 lg:mb-4">
              <Image
                src={category.imageSrc}
                alt={category.imageAlt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                className="object-contain p-1.5 sm:p-2 transition-transform duration-500 group-hover:scale-110 lg:p-4"
              />
            </div>

            <div className="text-center">
              <h3 className="line-clamp-1 text-[11px] font-medium text-slate-800 sm:text-sm lg:text-xl">{category.name}</h3>
              <p className="mt-0.5 text-[9px] font-medium text-slate-500 sm:text-[10px] lg:mt-1 lg:text-xs">{category.itemCount}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}