"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";

type ProductBadge = "New" | "Hot" | "Sold Out" | "Special" | "";

type CategoryProduct = {
	id: number;
	statusBadge?: ProductBadge | string;
	[key: string]: unknown;
};

type CategoryWiseProductsProps = {
	title: string;
	products: CategoryProduct[];
	seeMoreHref?: string;
};

const fallbackStatusBadges: ProductBadge[] = ["New", "Hot", "Sold Out", "Special", ""];

export default function CategoryWiseProducts({
	title,
	products,
	seeMoreHref = "/products",
}: CategoryWiseProductsProps) {
	const featuredProducts = products.slice(0, 8);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const updateScrollState = () => {
		const slider = sliderRef.current;
		if (!slider) {
			return;
		}

		const tolerance = 2;
		setCanScrollLeft(slider.scrollLeft > tolerance);
		setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth - tolerance);
	};

	const scrollByOneCard = (direction: 1 | -1) => {
		const slider = sliderRef.current;
		if (!slider) {
			return;
		}

		const firstCard = slider.querySelector("[data-category-card]") as HTMLDivElement | null;
		if (!firstCard) {
			return;
		}

		const sliderStyles = window.getComputedStyle(slider);
		const gap = Number.parseFloat(sliderStyles.columnGap || sliderStyles.gap || "0") || 0;
		const shift = firstCard.offsetWidth + gap;

		slider.scrollBy({
			left: shift * direction,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) {
			return;
		}

		const onScroll = () => updateScrollState();
		const onResize = () => updateScrollState();

		slider.scrollLeft = 0;
		updateScrollState();
		slider.addEventListener("scroll", onScroll);
		window.addEventListener("resize", onResize);

		return () => {
			slider.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
		};
	}, [featuredProducts.length]);

	return (
		<section className="mx-auto space-y-6">
			<div className="flex flex-row items-center justify-between gap-4">
				<div className="flex-1">
					<h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">{title}</h2>
					<div className="mt-2 sm:mt-5 h-[2px] w-full max-w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:max-w-[380px]" />
				</div>

				<Link
					href={seeMoreHref}
					className="inline-flex flex-shrink-0 items-center rounded-full border border-[#2F73BD] px-4 py-1.5 text-xs font-medium text-[#2F73BD] transition hover:bg-[#2F73BD] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
				>
					See More
				</Link>
			</div>

			<div className="relative">
				<button
					type="button"
					onClick={() => scrollByOneCard(-1)}
					disabled={!canScrollLeft}
					aria-label={`Show previous ${title} product`}
					className="absolute left-2 top-[220px] z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 sm:top-[235px] lg:top-[250px]"
				>
					<FaChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
				</button>

				<button
					type="button"
					onClick={() => scrollByOneCard(1)}
					disabled={!canScrollRight}
					aria-label={`Show next ${title} product`}
					className="absolute right-2 top-[220px] z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 sm:top-[235px] lg:top-[250px]"
				>
					<FaChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
				</button>

				<div
					ref={sliderRef}
					className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
				>
					{featuredProducts.map((product, index) => (
						<div
							key={product.id}
							data-category-card
							className="min-w-[48%] snap-start sm:min-w-[48%] lg:min-w-[31.5%] xl:min-w-[24%] 2xl:min-w-[19%]"
						>
							<ProductCard
								{...product}
								statusBadge={String(product.statusBadge || fallbackStatusBadges[index] || "")}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
