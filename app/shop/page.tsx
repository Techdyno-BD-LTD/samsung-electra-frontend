"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import BrandHero from "@/components/brand/BrandHero";
import BrandCategorySection from "@/components/brand/BrandCategorySection";
import Skeleton from "@/components/common/Skeleton";

// Fallback Brand Tab Data
import brandsData from "@/database/brands.json";

interface ShopCategory {
	title: string;
	slug: string;
}

interface CategoryData {
	title: string;
	products: any[];
}

interface BrandItem {
	id: number;
	name: string;
	tabLogo: string;
}

export default function BrandPage() {
	const [brands, setBrands] = useState<BrandItem[]>([]);
	const [categoryList, setCategoryList] = useState<CategoryData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchShopData() {
			try {
				// 1. Fetch Dynamic Brands from API first
				let fetchedBrands: BrandItem[] = [];
				try {
					const brandsRes = await fetch("/api/brands");
					const brandsResult = await brandsRes.json();
					if (brandsResult.success && Array.isArray(brandsResult.data)) {
						const localLogoMap: { [key: string]: string } = {
							"electra": "/images/electra.png",
							"samsung": "/images/samsung.png",
							"whirlpool": "/images/whirpool.png",
							"philips": "/images/phillips.png",
							"phillips": "/images/phillips.png",
						};
						fetchedBrands = brandsResult.data.map((b: any) => ({
							id: b.id,
							name: b.name,
							slug: b.slug,
							tabLogo: localLogoMap[b.name.toLowerCase()] || b.logo || "/images/placeholder.png",
						}));
					}
				} catch (err) {
					console.error("Error fetching dynamic brands:", err);
				}

				const finalBrands = fetchedBrands.length > 0 ? fetchedBrands : (brandsData as BrandItem[]);
				setBrands(finalBrands);

				// 2. Fetch Category List
				let categories: ShopCategory[] = [];
				try {
					const categoriesRes = await fetch("/api/categories");
					const categoriesResult = await categoriesRes.json();
					if (categoriesResult.success && Array.isArray(categoriesResult.data)) {
						categories = categoriesResult.data
							.filter((cat: any) => cat.parent_id === 0)
							.map((cat: any) => ({
								title: cat.name,
								slug: cat.slug,
							}));
					}
				} catch (err) {
					console.error("Error fetching dynamic categories:", err);
				}

				// Fallback to static categories if fetching failed or returned empty
				if (categories.length === 0) {
					categories = [
						{ title: "Television", slug: "tv-audio" },
						{ title: "Washing Machine", slug: "washing-machine" },
						{ title: "Refrigerator", slug: "refrigerator" },
						{ title: "Air Conditioner", slug: "air-conditionar" },
						{ title: "Microwave", slug: "microwave" },
					];
				}

				const fetchPromises = categories.map(async (cat) => {
					try {
						const res = await fetch(`/api/products/category/${cat.slug}`);
						const result = await res.json();
						if (result.success && Array.isArray(result.data)) {
							return {
								title: cat.title,
								products: result.data.map((p: any) => {
									// Match product brand with dynamic brands using ID/Slug to avoid typo issues
									const brandId = p.brand_id || p.brand?.id;
									const brandSlug = p.brand?.slug || "";
									const matchedBrand = finalBrands.find(
										(b: any) =>
											(brandId && b.id === brandId) ||
											(brandSlug && b.slug && b.slug.toLowerCase() === brandSlug.toLowerCase())
									);

									// Normalize brand name with typo-tolerant fallback
									let brandName = "Other";
									if (matchedBrand) {
										brandName = matchedBrand.name;
									} else {
										const rawName = (p.brand_name || p.brand?.name || "").toLowerCase().trim();
										if (rawName === "whirpool" || rawName === "whirlpool") {
											brandName = "Whirlpool";
										} else if (rawName === "philips" || rawName === "phillips") {
											brandName = "Phillips";
										} else if (p.brand_name || p.brand?.name) {
											brandName = p.brand_name || p.brand?.name;
										}
									}

									return {
										...p,
										brand: brandName,
										productData: p,
									};
								}),
							};
						}
					} catch (err) {
						console.error(`Error fetching dynamic products for category ${cat.title}:`, err);
					}
					return { title: cat.title, products: [] };
				});

				const resolvedData = await Promise.all(fetchPromises);
				setCategoryList(resolvedData);
			} catch (error) {
				console.error("Error in fetchShopData:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchShopData();
	}, []);

	return (
		<main className="min-h-screen bg-white">
			{/* Breadcrumb Section */}
			<div className="mx-auto w-full max-w-[1840px] px-4 py-6 md:px-8 mt-6">
				<nav className="flex items-center gap-2 text-sm text-gray-500">
					<Link href="/" className="hover:text-[#215A9B]">
						Home
					</Link>
					<FaChevronRight className="h-3 w-3" />
					<span className="font-medium text-[#215A9B]">Brand</span>
				</nav>
			</div>

			{/* Hero Banner Section */}
			<BrandHero
				bannerImage="/images/shoppage.png"
				altText="Our Premium Brand Collections"
			/>

			{/* Dynamic Category Sections */}
			<div className="mt-8">
				{loading ? (
					<div className="mx-auto w-full max-w-[1840px] px-8 py-12 space-y-12">
						{[1, 2].map((i) => (
							<div key={i} className="space-y-8">
								<Skeleton className="h-10 w-1/4 rounded-xl" />
								<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
									{[1, 2, 3, 4, 5].map((j) => (
										<Skeleton key={j} className="aspect-[3/4] w-full rounded-2xl" />
									))}
								</div>
							</div>
						))}
					</div>
				) : categoryList.some((cat) => cat.products.length > 0) ? (
					categoryList.map((cat, index) =>
						cat.products.length > 0 ? (
							<BrandCategorySection
								key={index}
								title={cat.title}
								brands={brands}
								products={cat.products}
								showAllProducts={false}
								showBrandTabs={true}
								productsPerView={5}
							/>
						) : null
					)
				) : (
					<div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-50 text-gray-500 mx-auto max-w-[1840px] my-12">
						No products found at the moment.
					</div>
				)}
			</div>

			{/* Spacing at the bottom */}
			<div className="h-20" />
		</main>
	);
}
