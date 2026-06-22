"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/common/ProductCard";
import Skeleton from "@/components/common/Skeleton";
import { Product } from "@/types/product";

type ProductBadge = "New" | "Hot" | "Sold Out" | "Special" | "";

type CategoryWiseProductsProps = {
	title: string;
	subtitle?: string;
	products?: Product[];
	categorySlug?: string;
	seeMoreHref?: string;
};

const fallbackStatusBadges: ProductBadge[] = ["New", "Hot", "Sold Out", "Special", ""];

export default function CategoryWiseProducts({
	title,
	subtitle,
	products = [],
	categorySlug,
	seeMoreHref = "/products",
}: CategoryWiseProductsProps) {
	const [dynamicProducts, setDynamicProducts] = useState<Product[]>(products);
	const [loading, setLoading] = useState(!!categorySlug);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	useEffect(() => {
		if (!categorySlug) return;

		async function fetchProducts() {
			try {
				const res = await fetch(`/api/products/category/${categorySlug}`);
				const data = await res.json();
				if (data.success) {
					setDynamicProducts(data.data);
				}
			} catch (error) {
				console.error(`Error fetching products for category ${categorySlug}:`, error);
			} finally {
				setLoading(false);
			}
		}
		fetchProducts();
	}, [categorySlug]);

	const featuredProducts = dynamicProducts.slice(0, 8);

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

	const finalSeeMoreHref = categorySlug ? `/category/${categorySlug}` : seeMoreHref;

	return (
		<section className="mx-auto space-y-6">
			<div className="flex flex-row items-center justify-between gap-4">
				<div className="flex-1">
					<Link href={finalSeeMoreHref} className="group inline-block">
						<h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem] transition group-hover:text-[#2F73BD]">
							{title}
						</h2>
					</Link>
					{subtitle ? <p className="mt-1 text-sm text-slate-500 sm:mt-2 sm:text-base">{subtitle}</p> : null}
					<div className="mt-2 sm:mt-5 h-[2px] w-full max-w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:max-w-[380px]" />
				</div>

				<Link
					href={finalSeeMoreHref}
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
					className="absolute left-1 top-[120px] lg:left-5 sm:top-[220px] lg:top-[250px] z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:left-0 sm:h-11 sm:w-11 sm:-translate-x-1/2 "
				>
					<FaChevronLeft className="h-2 w-2 sm:h-4 sm:w-4" />
				</button>

				<button
					type="button"
					onClick={() => scrollByOneCard(1)}
					disabled={!canScrollRight}
					aria-label={`Show next ${title} product`}
					className="absolute right-1 top-[120px] lg:right-7 sm:top-[220px] lg:top-[250px] z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1D3C61] shadow-md transition hover:border-[#2F73BD] hover:text-[#2F73BD] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 sm:right-0 sm:h-11 sm:w-11 sm:translate-x-1/2 "
				>
					<FaChevronRight className="h-2 w-2 sm:h-4 sm:w-4" />
				</button>

				<div
					ref={sliderRef}
					className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
				>
					{loading ? (
						<div className="flex w-full items-center justify-center py-20">
							<Skeleton className="h-64 w-full rounded-2xl" />
						</div>
					) : featuredProducts.length === 0 ? (
						<div className="flex w-full items-center justify-center py-20 text-slate-500">
							No products found in this category.
						</div>
					) : (
						featuredProducts.map((product, index) => (
							<div
								key={product.id}
								data-category-card
								className="w-[65%] sm:w-[48%] lg:w-[31.5%] xl:w-[24%] 2xl:w-[19%] shrink-0 snap-start"
							>
								<ProductCard
									productData={product}
									statusBadge={String(product.statusBadge || fallbackStatusBadges[index] || "")}
								/>
							</div>
						))
					)}
				</div>
			</div>
		</section>
	);
}
