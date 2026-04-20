"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";

interface Brand {
	id: number;
	name: string;
	tabLogo: string;
}

interface CategoryProduct {
	id: number;
	brand: string;
	[key: string]: unknown;
}

interface BrandCategorySectionProps {
	title: string;
	brands: Brand[];
	products: CategoryProduct[];
	showAllProducts?: boolean;
	showBrandTabs?: boolean;
	productsPerView?: number;
}

export default function BrandCategorySection({
	title,
	brands,
	products,
	showAllProducts = false,
	showBrandTabs = true,
	productsPerView,
}: BrandCategorySectionProps) {
	const [activeBrand, setActiveBrand] = useState<string>(brands[0]?.name || "");
	const sliderRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const filteredProducts = showAllProducts
		? products
		: products.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase());

	const visibleProducts = productsPerView
		? filteredProducts.slice(0, productsPerView)
		: filteredProducts;

	const updateScrollState = () => {
		const slider = sliderRef.current;
		if (!slider) return;

		const tolerance = 2;
		setCanScrollLeft(slider.scrollLeft > tolerance);
		setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance);
	};

	const scrollByAmount = (direction: number) => {
		const slider = sliderRef.current;
		if (!slider) return;

		const scrollAmount = slider.clientWidth * 0.8 * direction;
		slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
	};

	useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) return;

		const onScroll = () => updateScrollState();
		updateScrollState();
		slider.addEventListener("scroll", onScroll);
		window.addEventListener("resize", onScroll);

		return () => {
			slider.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [visibleProducts.length]);

	return (
		<section className="mx-auto w-full max-w-[1840px] px-4 py-12 md:px-8">
			{/* Category Title */}
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-semibold text-gray-900 md:text-3xl lg:text-4xl">{title}</h2>
			</div>

			<div className="mb-8 border-t border-gray-300" />

			{/* Brand Tabs */}
			{showBrandTabs && (
				<div className="mb-10 flex flex-wrap justify-center gap-4">
					{brands.map((brand) => (
						<button
							key={brand.id}
							onClick={() => setActiveBrand(brand.name)}
							className={`group relative flex min-w-[140px] items-center justify-center rounded-full border-2 px-6 py-2 transition-all duration-300 md:min-w-[180px] lg:min-w-[220px] ${
								activeBrand.toLowerCase() === brand.name.toLowerCase()
									? "border-[#215A9B] bg-white shadow-lg"
									: "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
							}`}
						>
							<div className="relative h-6 w-24 md:h-8 md:w-32">
								<Image
									src={brand.tabLogo}
									alt={brand.name}
									fill
									className="object-contain grayscale group-hover:grayscale-0"
									style={{
										filter:
											activeBrand.toLowerCase() === brand.name.toLowerCase()
												? "none"
												: "grayscale(100%)",
									}}
								/>
							</div>
						</button>
					))}
				</div>
			)}

			{/* Product Carousel */}
			<div className="relative group/carousel">
				{/* Navigation Buttons */}
				<button
					onClick={() => scrollByAmount(-1)}
					disabled={!canScrollLeft}
					className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:text-[#215A9B] disabled:opacity-0 group-hover/carousel:flex md:flex"
				>
					<FaChevronLeft className="h-5 w-5" />
				</button>

				<button
					onClick={() => scrollByAmount(1)}
					disabled={!canScrollRight}
					className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white p-3 text-gray-600 shadow-md transition-all hover:bg-gray-50 hover:text-[#215A9B] disabled:opacity-0 group-hover/carousel:flex md:flex"
				>
					<FaChevronRight className="h-5 w-5" />
				</button>

				{/* Products Slider */}
				<div
					ref={sliderRef}
					className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-4"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{visibleProducts.length > 0 ? (
						visibleProducts.map((product) => (
							<div
								key={product.id}
								className="w-[85%] flex-shrink-0 sm:w-[48%] md:w-[32%] lg:w-[calc((100%-3rem)/4)] 2xl:w-[calc((100%-4rem)/5)]"
							>
								<ProductCard {...product} />
							</div>
						))
					) : (
						<div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-50 text-gray-500">
							{showAllProducts
								? "No products found in this category."
								: `No products found for ${activeBrand} in this category.`}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
