import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import BrandProductCarouselSection from "@/components/brand/BrandProductCarouselSection";
import { withDynamicMetadata } from "@/lib/metadata";
import { toProductSlug } from "@/lib/productSlug";

import brandsData from "@/database/brands.json";
import washingMachineProducts from "@/database/washingmachineproducts.json";
import refrigeratorProducts from "@/database/refrigeratorproducts.json";
import airConditionerProducts from "@/database/airconditionerproducts.json";
import microwaveProducts from "@/database/microwaveproducts.json";
import flashDealsData from "@/database/flashdeals.json";

type PageProps = {
	params: {
		slug: string;
	};
};

type BrandCategory = {
	id: number;
	name: string;
	categoryLogo: string;
	image: string;
};

type BrandItem = {
	id: number;
	name: string;
	tabLogo: string;
	categories?: BrandCategory[];
};

type CategoryProduct = {
	id: number;
	brand: string;
	[key: string]: unknown;
};

type TvDealProduct = {
	id: number;
	brand: string;
	title?: string;
	[key: string]: unknown;
};

type BrandSection = {
	id: string;
	title: string;
	tabLabel: string;
	products: CategoryProduct[];
};

const typedBrands = brandsData as BrandItem[];
const typedWashingMachineProducts = washingMachineProducts as CategoryProduct[];
const typedRefrigeratorProducts = refrigeratorProducts as CategoryProduct[];
const typedAirConditionerProducts = airConditionerProducts as CategoryProduct[];
const typedMicrowaveProducts = microwaveProducts as CategoryProduct[];
const tvDealSource = flashDealsData.specialDeals?.products ?? [];
const typedTvDealProducts = tvDealSource as TvDealProduct[];

function byBrand(products: CategoryProduct[], brandName: string) {
	return products.filter(
		(product) => product.brand.toLowerCase() === brandName.toLowerCase()
	);
}

function getBrandBySlug(slug: string) {
	return typedBrands.find((brand) => toProductSlug(brand.name) === slug);
}

function normalizeCategoryLabel(name: string, brandName: string) {
	const trimmed = name
		.replace(new RegExp(`^${brandName}\\s*`, "i"), "")
		.trim()
		.toLowerCase();

	if (trimmed.includes("tv")) {
		return "Television";
	}
	if (trimmed.includes("refrigerator") || trimmed.includes("fridge")) {
		return "Refrigerator";
	}
	if (trimmed.includes("deep freezer") || trimmed.includes("freezer")) {
		return "Freezer";
	}
	if (trimmed.includes("ac") || trimmed.includes("air")) {
		return "Air Conditional";
	}
	if (trimmed.includes("washing")) {
		return "Washing Machine";
	}

	return "Microwave";
}

export function generateStaticParams() {
	return typedBrands.map((brand) => ({
		slug: toProductSlug(brand.name),
	}));
}

export const generateMetadata = withDynamicMetadata<PageProps>(
	"products",
	async ({ params }) => {
		const brand = getBrandBySlug(params.slug);
		if (!brand) {
			return {
				title: "Brand Not Found | Electra",
				description: "The requested brand page could not be found.",
			};
		}

		return {
			title: `${brand.name} | Electra`,
			description: `Explore ${brand.name} products category-wise on Electra.`,
		};
	}
);

export default function BrandSlugPage({ params }: PageProps) {
	const brand = getBrandBySlug(params.slug);

	if (!brand) {
		notFound();
	}

	const tvProducts = typedTvDealProducts.filter(
		(product) =>
			(product.title || "").toLowerCase().includes("tv") &&
			product.brand.toLowerCase() === brand.name.toLowerCase()
	);

	const categoryList: BrandSection[] = [
		{
			id: "television",
			title: "Television",
			tabLabel: "Television",
			products: tvProducts,
		},
		{
			id: "refrigerator",
			title: "Refrigerator (mc) products",
			tabLabel: "Refrigerator",
			products: byBrand(typedRefrigeratorProducts, brand.name),
		},
		{
			id: "freezer",
			title: "Freezer products",
			tabLabel: "Freezer",
			products: byBrand(typedRefrigeratorProducts, brand.name),
		},
		{
			id: "air-conditional",
			title: "Air Conditional products",
			tabLabel: "Air Conditional",
			products: byBrand(typedAirConditionerProducts, brand.name),
		},
		{
			id: "washing-machine",
			title: "Washing Machine",
			tabLabel: "Washing Machine",
			products: byBrand(typedWashingMachineProducts, brand.name),
		},
		{
			id: "microwave",
			title: "Microwave",
			tabLabel: "Microwave",
			products: byBrand(typedMicrowaveProducts, brand.name),
		},
	].filter((section) => section.products.length > 0);

	const tabLabelsFromBrand = (brand.categories ?? []).map((category) =>
		normalizeCategoryLabel(category.name, brand.name)
	);

	const tabLabels = Array.from(
		new Set([...tabLabelsFromBrand, ...categoryList.map((section) => section.tabLabel)])
	);

	const orderedTabs = [
		"Television",
		"Refrigerator",
		"Freezer",
		"Air Conditional",
		"Washing Machine",
		"Microwave",
	].filter((tab) => tabLabels.includes(tab));

	return (
		<main className=" mt-20">
			<section className="mx-auto w-full max-w-[1840px] px-4 pt-4 md:px-8">
				<div className="relative aspect-[1840/400] w-full overflow-hidden rounded-md">
					<Image
						src="/images/shoppage.png"
						alt={`${brand.name} hero banner`}
						fill
						priority
						className="object-cover"
					/>
				</div>
			</section>

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
					<div className="relative mx-auto h-10 w-52 md:h-12 md:w-60">
						<Image
							src={brand.tabLogo}
							alt={brand.name}
							fill
							priority
							className="object-contain"
						/>
					</div>
				</div>
			</section>

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
