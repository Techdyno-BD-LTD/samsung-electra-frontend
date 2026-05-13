"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import BrandHero from "@/components/brand/BrandHero";
import BrandCategorySection, { CategoryProduct } from "@/components/brand/BrandCategorySection";
import brandsData from "@/database/brands.json";

interface HigherSaleProduct {
  id: number;
  slug: string;
  category?: { name: string };
  brand?: { name: string };
  brand_name?: string;
  [key: string]: unknown;
}

interface CategoryGroup {
  title: string;
  products: CategoryProduct[];
}

export default function HigherSaleProductsPage() {
  const [products, setProducts] = useState<HigherSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/higher-sale-products");
        const result = await res.json();
        if (result.success) {
          setProducts(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching higher sale products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Dynamic category grouping
  const categoryGroups = useMemo(() => {
    if (products.length === 0) return [];

    // Define standard categories with multiple search terms
    const standardCategories = [
      { title: "Television", terms: ["television", "tv", "audio"] },
      { title: "Refrigerator", terms: ["refrigerator", "fridge", "freezer", "door", "mount"] },
      { title: "Washing Machine", terms: ["washing", "loading"] },
      { title: "Air Conditioner", terms: ["air", "ac", "conditioner"] },
      { title: "Microwave", terms: ["microwave", "oven"] },
    ];

    const groups: CategoryGroup[] = [];

    standardCategories.forEach((cat) => {
      const catProducts = products.filter((p) => {
        const pCat = (p.category?.name || "").toLowerCase();
        return cat.terms.some(term => pCat.includes(term.toLowerCase()));
      });

      if (catProducts.length > 0) {
        groups.push({
          title: cat.title,
          products: catProducts.map(p => ({
            ...p,
            brand: p.brand_name || p.brand?.name || "Other", // Map for BrandCategorySection filter
            productData: p 
          })),
        });
      }
    });

    // Handle any products that didn't fit into standard categories
    const otherProducts = products.filter(p => {
      const pCat = (p.category?.name || "").toLowerCase();
      return !standardCategories.some(sc => 
        sc.terms.some(term => pCat.includes(term.toLowerCase()))
      );
    });

    if (otherProducts.length > 0) {
      groups.push({
        title: "Other Products",
        products: otherProducts.map(p => ({
          ...p,
          brand: p.brand_name || p.brand?.name || "Other",
          productData: p
        })),
      });
    }

    return groups;
  }, [products]);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <div className="mx-auto w-full max-w-[1840px] px-4 py-6 md:px-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#215A9B]">
            Home
          </Link>
          <FaChevronRight className="h-3 w-3" />
          <span className="font-medium text-[#215A9B]">Higher Sale / Kisti</span>
        </nav>
      </div>

      {/* Hero Banner Section */}
      <BrandHero
        bannerImage="/images/shoppage.png"
        altText="Higher Sale Products"
      />

      {/* Dynamic Category Sections */}
      <div className="mt-8">
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#215A9B] border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          categoryGroups.map((cat, index) => (
            <BrandCategorySection
              key={index}
              title={cat.title}
              brands={brandsData}
              products={cat.products}
              showAllProducts={false}
              showBrandTabs={true}
              productsPerView={5}
            />
          ))
        ) : (
          <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-50 text-gray-500 mx-auto max-w-[1840px] my-12">
            No higher sale products found at the moment.
          </div>
        )}
      </div>

      {/* Spacing at the bottom */}
      <div className="h-20" />
    </main>
  );
}
