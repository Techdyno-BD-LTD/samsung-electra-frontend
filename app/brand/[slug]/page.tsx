import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import BrandProductCarouselSection from "@/components/brand/BrandProductCarouselSection";
import { withDynamicMetadata } from "@/lib/metadata";

export const revalidate = 60; // Revalidate every minute

type PageProps = {
  params: {
    slug: string;
  };
};

type CategoryProduct = {
  id: number;
  name: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  } | null;
  [key: string]: unknown;
};

type BrandSection = {
  id: string;
  title: string;
  tabLabel: string;
  products: CategoryProduct[];
};

export async function generateStaticParams() {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  try {
    const brandsRes = await fetch(`${baseUrl}/api/v2/all-brands`, {
      headers: {
        'x-system-key': systemKey,
      },
    });
    if (brandsRes.ok) {
      const brandsPayload = await brandsRes.json();
      return (brandsPayload.data || []).map((brand: any) => ({
        slug: brand.slug,
      }));
    }
  } catch (err) {
    console.error("generateStaticParams error:", err);
  }
  return [];
}

export const generateMetadata = withDynamicMetadata<PageProps>(
  "products",
  async ({ params }) => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const systemKey = process.env.API_SYSTEM_KEY || '';

    try {
      const brandsRes = await fetch(`${baseUrl}/api/v2/all-brands`, {
        headers: {
          'x-system-key': systemKey,
        },
      });
      if (brandsRes.ok) {
        const brandsPayload = await brandsRes.json();
        const brand = (brandsPayload.data || []).find((b: any) => b.slug === params.slug);
        if (brand) {
          return {
            title: `${brand.name} | Electra`,
            description: `Explore ${brand.name} products category-wise on Electra.`,
          };
        }
      }
    } catch (err) {
      console.error("generateMetadata error:", err);
    }

    return {
      title: "Brand Not Found | Electra",
      description: "The requested brand page could not be found.",
    };
  }
);

export default async function BrandSlugPage({ params }: PageProps) {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
  const systemKey = process.env.API_SYSTEM_KEY || '';

  // 1. Fetch all brands to find the current brand
  const brandsRes = await fetch(`${baseUrl}/api/v2/all-brands`, {
    headers: {
      'x-system-key': systemKey,
    },
    next: { revalidate: 60 },
  });

  if (!brandsRes.ok) {
    notFound();
  }

  const brandsPayload = await brandsRes.json();
  const brand = (brandsPayload.data || []).find((b: any) => b.slug === params.slug);

  if (!brand) {
    notFound();
  }

  // 2. Fetch all products under this brand
  const productsRes = await fetch(`${baseUrl}/api/v2/products/brand/${params.slug}?limit=1000`, {
    headers: {
      'x-system-key': systemKey,
    },
    next: { revalidate: 60 },
  });

  if (!productsRes.ok) {
    notFound();
  }

  const productsPayload = await productsRes.json();
  const products: CategoryProduct[] = productsPayload.data || [];

  // 3. Group products dynamically by category
  const categoryMap = new Map<string, BrandSection>();

  products.forEach((product) => {
    const category = product.category;
    if (!category) return;

    const catName = category.name || "Uncategorized";
    const catSlug = category.slug || "uncategorized";

    if (!categoryMap.has(catSlug)) {
      categoryMap.set(catSlug, {
        id: catSlug,
        title: `${catName}`,
        tabLabel: catName,
        products: [],
      });
    }

    categoryMap.get(catSlug)!.products.push(product);
  });

  const categoryList = Array.from(categoryMap.values());
  const orderedTabs = categoryList.map((section) => section.tabLabel);

  // 4. Fetch dynamic brand banner mapping page
  let brandBanner: string | null = null;
  try {
    const pageRes = await fetch(`${baseUrl}/api/v2/pages/brands`, {
      headers: {
        'x-system-key': systemKey,
      },
      next: { revalidate: 60 },
    });
    if (pageRes.ok) {
      const pagePayload = await pageRes.json();
      if (pagePayload.success && pagePayload.data && pagePayload.data[0]) {
        const contentObj = typeof pagePayload.data[0].content === "string"
          ? JSON.parse(pagePayload.data[0].content)
          : pagePayload.data[0].content;
        
        if (contentObj && contentObj.brand_banners && contentObj.brand_banners[brand.id]) {
          brandBanner = contentObj.brand_banners[brand.id];
        }
      }
    }
  } catch (err) {
    console.error("Error fetching brands page settings:", err);
  }

  return (
    <main className=" mt-20">
      {brandBanner && (
        <section className="mx-auto w-full px-4 pt-4 md:px-0">
          <div className="relative aspect-[1840/400] w-full overflow-hidden rounded-md">
            <Image
              src={brandBanner}
              alt={`${brand.name} hero banner`}
              fill
              priority
              className="object-cover"
            />
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-[1840px] px-4 py-4 md:px-8">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#215A9B]">
            Home
          </Link>
          <FaChevronRight className="h-2.5 w-2.5" />
          <Link href="/shop" className="hover:text-[#215A9B]">
            Brand
          </Link>
          <FaChevronRight className="h-2.5 w-2.5" />
          <span className="font-medium text-[#215A9B]">{brand.name}</span>
        </nav>
      </div>

      <section className="mx-auto w-full max-w-[1840px] px-4 pb-4 md:px-8">
        <div className="border-y border-gray-300 py-5 text-center md:py-6">
          {brand.logo ? (
            <div className="relative mx-auto h-10 w-52 md:h-12 md:w-60">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                priority
                className="object-contain"
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold uppercase text-slate-800 tracking-wider">
              {brand.name}
            </h1>
          )}
        </div>
      </section>

      {categoryList.length > 0 && (
        <section className="mx-auto w-full max-w-[1840px] px-4 pb-5 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 border-b border-gray-300 pb-5">
            {orderedTabs.map((label, index) => {
              const target = categoryList.find((item) => item.tabLabel === label);

              return (
                <Link
                  key={label}
                  href={target ? `#${target.id}` : "#"}
                  className={`min-w-[152px] rounded-full border px-5 py-1.5 text-center text-[15px] font-medium transition-colors ${
                    index === 0
                      ? "border-black bg-black text-white"
                      : "border-gray-500 bg-white text-gray-800 hover:border-[#215A9B] hover:text-[#215A9B]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="pb-12">
        {categoryList.map((category) => (
          <BrandProductCarouselSection
            key={category.id}
            id={category.id}
            title={category.title}
            products={category.products}
            seeMoreHref={`/products?brand=${encodeURIComponent(brand.name)}`}
          />
        ))}
      </div>

      {categoryList.length === 0 && (
        <section className="mx-auto w-full max-w-[1840px] px-4 py-10 text-center md:px-8">
          <p className="rounded-xl border border-gray-200 bg-white py-12 text-lg text-gray-500">
            No products found for {brand.name}.
          </p>
        </section>
      )}

      <div className="h-8" />
    </main>
  );
}
