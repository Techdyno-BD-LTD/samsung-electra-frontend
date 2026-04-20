"use client";

import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import BrandHero from "@/components/brand/BrandHero";
import BrandCategorySection from "@/components/brand/BrandCategorySection";

// Data Imports
import brandsData from "@/database/brands.json";
import washingMachineProducts from "@/database/washingmachineproducts.json";
import refrigeratorProducts from "@/database/refrigeratorproducts.json";
import airConditionerProducts from "@/database/airconditionerproducts.json";
import microwaveProducts from "@/database/microwaveproducts.json";
import flashDealsData from "@/database/flashdeals.json";

type TvDealProduct = {
	title?: string;
};

export default function BrandPage() {
	// Extract TV products from flash deals (based on title/image clues since a dedicated file is missing)
	const tvProducts =
		flashDealsData.specialDeals?.products?.filter((p: TvDealProduct) =>
			(p.title || "").toLowerCase().includes("tv")
		) || [];

	// Combine other products from various sources if needed, but for now we'll use the specific ones
	const categoryList = [
		{
			title: "Television",
			products: tvProducts,
		},
		{
			title: "Washing Machine",
			products: washingMachineProducts,
		},
		{
			title: "Refrigerator",
			products: refrigeratorProducts,
		},
		{
			title: "Air Conditioner",
			products: airConditionerProducts,
		},
		{
			title: "Microwave",
			products: microwaveProducts,
		},
	];

	return (
		<main className="min-h-screen bg-white">
			{/* Breadcrumb Section */}
			<div className="mx-auto w-full max-w-[1840px] px-4 py-6 md:px-8">
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
				{categoryList.map((cat, index) =>
					cat.products.length > 0 ? (
						<BrandCategorySection
							key={index}
							title={cat.title}
							brands={brandsData}
							products={cat.products}
							showAllProducts
							showBrandTabs
							productsPerView={5}
						/>
					) : null
				)}
			</div>

			{/* Spacing at the bottom */}
			<div className="h-20" />
		</main>
	);
}
