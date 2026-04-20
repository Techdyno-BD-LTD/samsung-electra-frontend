import Image from "next/image";
import { notFound } from "next/navigation";
import { FaHeart, FaMinus, FaPlus, FaRegShareSquare, FaStar } from "react-icons/fa";
// FaBolt
import { withDynamicMetadata } from "@/lib/metadata";
import { toProductSlug } from "@/lib/productSlug";
import productDetails from "@/database/productdetails.json";
import popularProducts from "@/database/popularproducts.json";
import products from "@/database/products.json";
import bestsellingProducts from "@/database/bestselling.json";
import washingMachineProducts from "@/database/washingmachineproducts.json";
import airconditionerProducts from "@/database/airconditionerproducts.json";
import refrigeratorProducts from "@/database/refrigeratorproducts.json";
import microwaveProducts from "@/database/microwaveproducts.json";

import ProductDetailsTabs from "@/components/productdetails/ProductDetailsTabs";
import MobileProductGallery from "@/components/productdetails/MobileProductGallery";
import MobileStickyPurchaseBar from "@/components/productdetails/MobileStickyPurchaseBar";
import MobileOfferDetails from "@/components/productdetails/MobileOfferDetails";
import MobileMadeInFeatures from "@/components/productdetails/MobileMadeInFeatures";
import MobileBackButton from "@/components/productdetails/MobileBackButton";
import FooterBreadcrumbPortal from "@/components/productdetails/FooterBreadcrumbPortal";

type PageProps = {
  params: { slug: string };
};

type CatalogProduct = {
  title?: string;
  brand?: string;
  image?: string;
  rating?: number;
  ratingCount?: string;
  price?: string | number;
  originalPrice?: string;
  discountPercent?: string;
  saveAmount?: string;
  emiPrice?: string;
  category?: string;
  color?: string;
  weight?: string;
};

type ProductDetailsEntry = {
  slug: string;
  category: string;
  title: string;
  brand: string;
  brandLogo: string;
  rating: number;
  ratingCount: string;
  model: string;
  sku: string;
  availability: string;
  price: string;
  originalPrice: string;
  discountLabel: string;
  saveLabel: string;
  offersLabel: string;
  emiText: string;
  emiDetailsLabel: string;
  capacities: string[];
  colorLabel: string;
  colorSwatches: string[];
  features: string[];
  descriptionHtml?: string;
  specificationsHtml?: string;
  featuresHtml?: string;
  policyHtml?: string;
  flashTitle: string;
  flashTime: string;
  flashTimeLabels: string;
  coupon: string;
  gallery: string[];
  mainImage: string;
  warrantyBadgeImage: string;
  specialOfferLeft: string;
  specialOfferOne: string;
  specialOfferTwo: string;
  shippingInfo: string;
  warrantyInfo: string;
  emiFacilityInfo: string;
  exchangeInfo: string;
  madeInText: string;
};

const typedProductDetails = productDetails as ProductDetailsEntry[];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFeatureHtml(product: ProductDetailsEntry): string {
  const sections = [
    {
      title: product.features[2] ?? "Powerful bubbles",
      subtitle: product.features[0] ?? "Eco Bubble",
      description:
        "Enjoy efficient cleaning, even at low temperatures with advanced wash technology. Detergent is turned into bubbles quickly to penetrate fabric and remove dirt while saving energy.",
      image: product.gallery[1] ?? product.mainImage,
    },
    {
      title: "Wash in 49 minutes",
      subtitle: product.features[1] ?? "Drum Clean",
      description:
        "Cut your laundry time and get clothes thoroughly clean by selecting a faster wash mode. The rinsing cycle is shortened by combining a speed spray with efficient spin performance.",
      image: product.gallery[2] ?? product.mainImage,
    },
  ];

  const sectionHtml = sections
    .map(
      (section) => `
        <article>
          <h3>${escapeHtml(section.title)}</h3>
          <h4>${escapeHtml(section.subtitle)}</h4>
          <p>${escapeHtml(section.description)}</p>
          <img src="${escapeHtml(section.image)}" alt="${escapeHtml(section.title)}" />
        </article>
      `
    )
    .join("");

  return `
    <div>
      <h2>Features</h2>
      ${sectionHtml}
    </div>
  `;
}

function buildDescriptionHtml(product: ProductDetailsEntry): string {
  return `
    <p>
      Experience powerful, hygienic, and energy-efficient washing with ${escapeHtml(product.title)}. Designed for modern households, this washer combines smart technology with superior fabric care to deliver spotless results while saving water and electricity.
    </p>
    <p>
      The ${escapeHtml(product.model)} is built for convenience, hygiene, and efficiency. Whether you are washing everyday wear or delicate fabrics, its advanced technology ensures excellent cleaning results while caring for your clothes and the environment.
    </p>
  `;
}

function buildSpecificationsHtml(product: ProductDetailsEntry): string {
  const specRows = [
    ["Loading", "Front Loading"],
    ["Energy Efficiency Class", "A+++"],
    ["Child Lock", "Yes"],
    ["Auto Resume", "Yes"],
    ["Time Delay Function", "Yes"],
    ["Water Overflow Lock", "Yes"],
    ["Number Of Washing Programs", "23"],
    ["Preset Wash Programs", "18"],
    ["Height", "840 MM"],
    ["Width", "600 MM"],
    ["Depth", "550 MM"],
    ["Capacity", escapeHtml(product.capacities[0] ?? "8 KG")],
    ["RPM", "1200"],
    ["Motor Type", "BLDC Inverter Motor"],
  ];

  const rowsHtml = specRows
    .map(([key, value]) => `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<table><tbody>${rowsHtml}</tbody></table>`;
}

function buildPolicyHtml(product: ProductDetailsEntry): string {
  return `
    <h3>Product Policy</h3>
    <p>${escapeHtml(product.title)}</p>
    <p>Model: ${escapeHtml(product.model)}</p>

    <h4>Warranty Policy</h4>
    <ul>
      <li>Motor Warranty: Up to 10 Years (Digital Inverter Motor)</li>
      <li>Parts Warranty: 1 Year (as per Samsung official policy)</li>
      <li>Service Warranty: 1 Year free service from the date of purchase</li>
      <li>Warranty is valid only with an official warranty card and purchase invoice</li>
    </ul>

    <h4>Delivery Policy</h4>
    <ul>
      <li>Inside City: Home delivery available within 2-5 working days</li>
      <li>Outside City: Delivery time may vary depending on location</li>
      <li>Product will be delivered in factory-sealed packaging</li>
    </ul>

    <h4>Installation Policy</h4>
    <ul>
      <li>Free installation provided by authorized Samsung service engineers</li>
      <li>Installation request must be placed after product delivery</li>
      <li>Customer must ensure proper electricity, water inlet, and drainage setup</li>
    </ul>

    <h4>Replacement Policy</h4>
    <ul>
      <li>Replacement applicable within 7 days of delivery</li>
      <li>Product must be unused, uninstalled, and in original packaging</li>
      <li>Replacement allowed only for manufacturing defects</li>
      <li>Physical damage or damage caused by improper handling is not eligible</li>
    </ul>

    <h4>Non-Warranty Coverage</h4>
    <ul>
      <li>Physical or electrical damage</li>
      <li>Use of improper voltage or unauthorized accessories</li>
      <li>Unauthorized repair or modification</li>
      <li>Damage caused by water leakage, fire, or natural disasters</li>
    </ul>

    <h4>Return Policy</h4>
    <ul>
      <li>Returns are accepted only if approved after technical inspection</li>
      <li>Refunds are not applicable once the product is installed or used</li>
    </ul>

    <h4>Required Documents</h4>
    <ul>
      <li>Original invoice</li>
      <li>Warranty card</li>
      <li>Product serial number must match company records</li>
    </ul>
  `;
}


const catalogProducts = [
  ...(popularProducts as CatalogProduct[]),
  ...(products as CatalogProduct[]),
  ...(bestsellingProducts as CatalogProduct[]),
  ...(washingMachineProducts as CatalogProduct[]),
  ...(airconditionerProducts as CatalogProduct[]),
  ...(refrigeratorProducts as CatalogProduct[]),
  ...(microwaveProducts as CatalogProduct[]),
];

const fallbackProductsBySlug = new Map<string, CatalogProduct>();
for (const item of catalogProducts) {
  if (!item.title) {
    continue;
  }

  const key = toProductSlug(item.title);
  if (!fallbackProductsBySlug.has(key)) {
    fallbackProductsBySlug.set(key, item);
  }
}

function createFallbackProduct(slug: string, catalogItem: CatalogProduct): ProductDetailsEntry {
  const basePrice = typeof catalogItem.price === "string" ? catalogItem.price : `৳${catalogItem.price ?? 0}`;
  const baseOriginalPrice = catalogItem.originalPrice ?? basePrice;
  const brandName = (catalogItem.brand ?? "SAMSUNG").toUpperCase();
  const brandLogoMap: Record<string, string> = {
    SAMSUNG: "/images/samsung.png",
    HAIER: "/images/whirpool.png",
    WHIRPOOL: "/images/whirpool.png",
    PHILLIPS: "/images/phillips.png",
  };

  return {
    slug,
    category: (catalogItem.category ?? "Washing machine").toLowerCase(),
    title: catalogItem.title ?? "Electra Product",
    brand: brandName,
    brandLogo: brandLogoMap[brandName] ?? "/images/electra.png",
    rating: catalogItem.rating ?? 4,
    ratingCount: catalogItem.ratingCount ?? "(4.0)",
    model: "N/A",
    sku: "N/A",
    availability: "In-stock",
    price: String(basePrice),
    originalPrice: String(baseOriginalPrice),
    discountLabel: (catalogItem.discountPercent ?? "10% Off").replace("-", ""),
    saveLabel: catalogItem.saveAmount ?? "Save : ৳5,000",
    offersLabel: "View available Offer's",
    emiText: catalogItem.emiPrice ?? "EMI Available",
    emiDetailsLabel: "See EMI Details",
    capacities: [catalogItem.weight ?? "8-KG", "10-KG", "12-KG"],
    colorLabel: "Color",
    colorSwatches: [catalogItem.image ?? "/images/wm2.png", "/images/bl2.png", "/images/electrawm.png"],
    features: [
      "Digital Inverter Technology",
      "Drum Clean",
      "Eco Bubble",
      "Hygiene Steam",
      "Bubble Soak",
    ],
    flashTitle: "Flash Sales Ends in",
    flashTime: "01 : 04 : 32 : 56",
    flashTimeLabels: "d : h : m : s",
    coupon: "EL05",
    gallery: [
      catalogItem.image ?? "/images/wm2.png",
      "/images/electrawm.png",
      "/images/bl2.png",
      "/images/fr2.png",
      catalogItem.image ?? "/images/wm2.png",
    ],
    mainImage: catalogItem.image ?? "/images/wm2.png",
    warrantyBadgeImage: "/images/warrantybadge.png",
    specialOfferLeft: "Special Offer",
    specialOfferOne: "EBL Cashback 10%",
    specialOfferTwo: "Nagad Cashback 10%",
    shippingInfo: "Estimated Shipping Time : ( Sat, Dec 13 - Wed 17 Dec ) -Ship From Dhaka",
    warrantyInfo: "Warranty : DIT Motor-20 years, spare parts & after sales service - 1 year",
    emiFacilityInfo: "EMI Facility : 0% EMI Facility For 6 Months & Available EMI 36 Month For this Item",
    exchangeInfo: "Exchange : Yes / No | Not Available for this item / Get Exchange Up to 4000 Tk Available From Available Showrooms",
    madeInText: "-Made In Vietnam Assamble By Thailand",
  };
}

function getProductBySlug(slug: string): ProductDetailsEntry | null {
  const fromDedicatedData = typedProductDetails.find((item) => item.slug === slug);
  if (fromDedicatedData) {
    return fromDedicatedData;
  }

  const fallbackItem = fallbackProductsBySlug.get(slug);
  if (!fallbackItem) {
    return null;
  }

  return createFallbackProduct(slug, fallbackItem);
}

export const generateMetadata = withDynamicMetadata<{ params: { slug: string } }>(
  "product-detail",
  ({ params }) => {
    const product = getProductBySlug(params.slug);

    if (!product) {
      return {
        title: "Product not found | Electra",
        description: "We can't locate the requested product right now.",
      };
    }

    return {
      title: `${product.title} | Electra`,
      description: `${product.title} at ${product.price}. ${product.features.join(", ")}.`,
      image: product.mainImage,
    };
  }
);

export async function generateStaticParams() {
  const staticSlugs = new Set<string>();

  for (const item of typedProductDetails) {
    staticSlugs.add(item.slug);
  }

  fallbackProductsBySlug.forEach((_value, slug) => {
    staticSlugs.add(slug);
  });

  return Array.from(staticSlugs).map((slug) => ({ slug }));
}

export default function ProductDetailPage({ params }: PageProps) {


  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const breadcrumbCategory = product.category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const flatOfferPercent = product.discountLabel.match(/\d+%/)?.[0] ?? "10%";

  return (
    <div className="pb-[118px] md:pb-0">
      {/* Product Image and Buy now Section */}
      <section className="  mt-10  ">
        <div className="mb-3 px-4 lg:hidden">
          <MobileBackButton />
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 hidden lg:flex items-center gap-2 lg:text-sm text-[12px] leading-none text-slate-500 px-4 md:px-0"
        >
          <span>Home</span>
          <span className="text-slate-400">›</span>
          <span>{breadcrumbCategory}</span>
          <span className="text-slate-400">›</span>
          <span className="text-slate-700">Washing Machine details</span>
        </nav>

        <div className="mx-auto mt-2 w-11/12">
          <div className="flex flex-col gap-2 lg:gap-6 lg:flex-row">
            <div className="w-full space-y-3 lg:w-[53%]">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-4">
                <button
                  type="button"
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500"
                >
                  <FaPlus className="h-3 w-3" />
                </button>

                <div className="relative mx-auto min-h-[250px] max-w-[520px] sm:min-h-[320px] md:min-h-[700px]">
                  <MobileProductGallery
                    images={product.gallery}
                    title={product.title}
                    warrantyBadgeImage={product.warrantyBadgeImage}
                  />

                  <div className="hidden items-center justify-center md:flex md:min-h-[700px]">
                    <Image
                      src={product.mainImage}
                      alt={product.title}
                      width={520}
                      height={520}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>

                  <Image
                    src={product.warrantyBadgeImage}
                    alt="Official warranty"
                    width={120}
                    height={120}
                    className="absolute bottom-2 left-2 hidden h-28 w-28 object-contain md:block"
                  />
                </div>
              </div>

              <div className="hidden grid-cols-5 gap-2 md:grid">
                {product.gallery.map((item, index) => (
                  <button
                    key={`${item}-${index}`}
                    type="button"
                    className={`rounded-2xl border p-2 ${index === 0 ? "border-slate-700 bg-slate-100" : "border-slate-200 bg-white"}`}
                  >
                    <Image
                      src={item}
                      alt={`${product.title} preview ${index + 1}`}
                      width={92}
                      height={92}
                      className="mx-auto h-20 w-20 object-contain md:h-28 md:w-28"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full lg:space-y-3 space-y-2  lg:w-[47%]">
              <p className="text-[12px] lg:text-[18px]  text-slate-600">{product.category}</p>
              <h1 className="text-[16px] lg:text-3xl font-semibold leading-tight text-slate-900">{product.title}</h1>

              <div className="space-y-1 text-[12px] text-slate-500 lg:hidden">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Image src={product.brandLogo} alt={product.brand} width={60} height={24} className="h-4 w-auto object-contain" />
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5 text-slate-300" />
                    <span className="ml-0.5 text-slate-500">{product.ratingCount}</span>
                  </div>
                  <span>|</span>
                  <span>Model : {product.model}</span>
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span>SKU : {product.sku}</span>
                  <span>|</span>
                  <span className="text-[#0A67C8]">{product.availability}</span>
                </div>
              </div>

              <div className="hidden flex-wrap items-center gap-3 text-sm text-slate-500 lg:flex">
                <Image src={product.brandLogo} alt={product.brand} width={60} height={24} className="h-6 w-auto object-contain" />
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3 text-slate-300" />
                  <span className="ml-1 text-slate-500">{product.ratingCount}</span>
                </div>
                <span>|</span>
                <span>Model : {product.model}</span>
                <span>|</span>
                <span>SKU : {product.sku}</span>
                <span>|</span>
                <span className="text-[#0A67C8]">{product.availability}</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
                <p className="text-[22px] font-medium leading-none text-[#0C73DA]">{product.price}</p>
                <div className="flex flex-col items-center leading-none">
                  <p className="text-[8px] font-semibold text-[#15A85B]">{product.discountLabel}</p>
                  <p className="text-[10px] text-slate-400 line-through">{product.originalPrice}</p>
                </div>
                <span className="rounded-tl-3xl rounded-br-3xl bg-[#F13D36] px-3 py-1 text-[8px] font-semibold leading-none text-white">{product.saveLabel}</span>
                <button type="button" className="text-[8px] font-semibold leading-none text-[#0C73DA]">
                  {product.offersLabel}
                </button>
              </div>

              <div className="hidden flex-wrap items-center gap-8 lg:flex">
                <p className="text-4xl font-medium text-[#0C73DA]">{product.price}</p>
                <div className="flex flex-col items-center" >
                  <p className="text-base font-semibold text-[#15A85B]">{product.discountLabel}</p>
                  <p className="text-md text-slate-400 line-through">{product.originalPrice}</p>
                </div>
                <span className="rounded-tl-3xl rounded-br-3xl bg-[#F13D36]  px-6 py-1 text-sm font-semibold text-white">{product.saveLabel}</span>
                <button type="button" className="text-sm font-semibold text-[#0C73DA]">
                  {product.offersLabel}
                </button>
              </div>

              <div className="flex items-center  gap-2 border-b border-slate-200 pb-3 text-[12px] lg:text-[16px] text-slate-700">
                <Image src="/images/EMI.png" alt="EMI" width={20} height={20} className="lg:h-5 h-4 w-4 lg:w-5 object-contain" />
                <span >{product.emiText}</span>
                <button type="button" className="font-semibold text-[#0C73DA]">
                  | {product.emiDetailsLabel}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[12px] lg:text-sm">
                  <span className="text-slate-700">Capacity :</span>
                  {product.capacities.map((capacity, index) => (
                    <button
                      key={capacity}
                      type="button"
                      className={`min-w-16 rounded border lg:px-4 lg:py-1.5 lg:text-xs px-2 py-0.5 text-[10px] ${index === 0 ? "border-slate-500 bg-slate-100 text-slate-900" : "border-slate-200 text-slate-600"}`}
                    >
                      {capacity}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[12px] lg:text-sm">
                  <span className="text-slate-700">{product.colorLabel} :</span>
                  {product.colorSwatches.map((colorImage, index) => (
                    <button
                      key={`${colorImage}-${index}`}
                      type="button"
                      className={`rounded border p-1 ${index === 0 ? "border-slate-600" : "border-slate-200"}`}
                    >
                      <Image src={colorImage} alt="Color option" width={36} height={36} className="lg:h-9 lg:w-9 w-6 h-6 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[14px] text-slate-700 hidden lg:block">
                {product.features.map((feature, index) => (
                  <p key={feature}>
                    • {feature}
                    {index === product.features.length - 1 && (
                      <button type="button" className="ml-3 text-[12px] font-semibold text-[#0C73DA]">
                        See More
                      </button>
                    )}
                  </p>
                ))}
              </div>

              {/* <div className="flex items-center justify-between border-y border-slate-200 py-3">
              <div>
                <p className="flex items-center gap-1 text-[18px] font-semibold text-slate-800">
                  <FaBolt className="text-orange-500" />
                  {product.flashTitle}
                </p>
                <p className="ml-5 text-[22px] font-bold text-[#0C73DA]">{product.flashTime}</p>
                <p className="ml-5 text-xs text-slate-500">{product.flashTimeLabels}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Use Coupon :</p>
                <button type="button" className="mt-1 rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {product.coupon}
                </button>
              </div>
            </div> */}

              {/* Mobile-only offer/actions layout */}
              <div className="flex items-start gap-2 lg:hidden">
                <div className="relative h-[55px] w-[65px] overflow-hidden rounded-lg">
                  <Image
                    src="/images/flatoffers.jpeg"
                    alt={`Flat ${flatOfferPercent} off`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0.5 right-3 flex flex-col justify-end p-2 text-white">
                    <p className="mt-1 text-[8px] tracking-wide">Flat</p>
                    <div className="flex items-center gap-1">
                      <div><p className="text-[15px] font-black leading-none"> {flatOfferPercent?.replace('%', '')}</p></div>
                      <div className="space-y-0.5">
                        <div>
                          <p className="text-[8px] font-black uppercase leading-none">%</p>
                        </div>
                        <div><p className="text-[6px] font-black uppercase leading-none">OFF</p></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <button type="button" className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium tracking-wide text-[#0C73DA] leading-none">
                    <Image src="/images/shop.png" alt="Showroom" width={12} height={12} className="h-3 w-3 object-contain" />
                    Book in showroom Get 5% Off
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-3 rounded-md border border-slate-300 px-7 py-1">
                      <button type="button" className="text-slate-600">
                        <FaMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-[11px] text-slate-700">01</span>
                      <button type="button" className="text-slate-600">
                        <FaPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button type="button" className="text-slate-600">
                      <FaHeart className="h-5 w-5" />
                    </button>
                    <button type="button" className="text-slate-600">
                      <FaRegShareSquare className="h-5 w-5" />
                    </button>
                    <button type="button" className="text-[11px] text-slate-600 leading-none">
                      Share
                    </button>
                  </div>


                </div>
              </div>

              <div className="hidden lg:flex lg:flex-row lg:items-stretch gap-3">
                <div className="relative h-[88px] w-[112px] overflow-hidden rounded-lg lg:flex-shrink-0">
                  <Image
                    src="/images/flatoffers.jpeg"
                    alt={`Flat ${flatOfferPercent} off`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute -bottom-1 right-2  flex flex-col justify-end p-3 text-white">
                    <p className="text-[12px] mt-1 tracking-wide">Flat</p>
                    <div className="flex items-center gap-1">
                      <div><p className=" text-[38px] font-black leading-none"> {flatOfferPercent?.replace('%', '')}</p></div>
                      <div className="space-y-1">
                        <div>
                          <p className="text-[20px] font-black uppercase leading-none">%</p>
                        </div>
                        <div>  <p className=" text-[14px] font-black uppercase leading-none">OFF</p></div>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
                    <div className="flex items-center gap-4 rounded-xl border border-slate-300 px-4 py-2 text-base">
                      <button type="button" className="text-slate-600">
                        <FaMinus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center">01</span>
                      <button type="button" className="text-slate-600">
                        <FaPlus className="h-4 w-4" />
                      </button>
                    </div>

                    <button type="button" className="text-slate-600">
                      <FaHeart className="h-6 w-6" />
                    </button>
                    <button type="button" className="text-slate-600">
                      <FaRegShareSquare className="h-6 w-6" />
                    </button>
                    <button type="button" className="text-[16px] text-slate-600 leading-none">
                      Share
                    </button>
                    <button type="button" className="whitespace-nowrap text-[16px] font-semibold text-[#0C73DA] leading-none">
                      Book in showroom Get 5% Off
                    </button>
                  </div>

                  <div className="sm:grid gap-3 sm:grid-cols-2 hidden ">
                    <button type="button" className="rounded-full bg-[#2F7FE8] py-1 text-[14px] font-semibold leading-none text-white">
                      Buy Now
                    </button>
                    <button type="button" className="flex items-center justify-center gap-3 rounded-full border border-[#9CB7D8] py-1 text-[14px] font-semibold leading-none text-slate-900">
                      <Image src="/images/shopping-cart.png" alt="Cart" width={24} height={24} className="h-6 w-6 object-contain" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              <MobileOfferDetails
                specialOfferLeft={product.specialOfferLeft}
                specialOfferOne={product.specialOfferOne}
                specialOfferTwo={product.specialOfferTwo}
                shippingInfo={product.shippingInfo}
                warrantyInfo={product.warrantyInfo}
                emiFacilityInfo={product.emiFacilityInfo}
                exchangeInfo={product.exchangeInfo}
              />

              <MobileMadeInFeatures madeInText={product.madeInText} features={product.features} />

              <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-x-3 lg:gap-y-2 lg:py-1 lg:text-md lg:text-slate-600">
                <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                  <Image src="/images/freedelivery.png" alt="Free delivery" width={20} height={20} className="h-5 w-5 object-contain" />
                  Free Delivery
                </p>
                <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                  <Image src="/images/freeinstalation.png" alt="Free installation" width={20} height={20} className="h-5 w-5 object-contain" />
                  Free Installation
                </p>
                <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                  <Image src="/images/cashondelivery.png" alt="Cash on delivery" width={20} height={20} className="h-5 w-5 object-contain" />
                  Cash on delivery
                </p>
                <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                  <Image src="/images/salesservice.png" alt="After sales service" width={20} height={20} className="h-5 w-5 object-contain" />
                  After sales service
                </p>
              </div>

              <div className="hidden lg:inline-flex lg:w-fit lg:max-w-full lg:flex-wrap lg:items-center lg:gap-2 lg:rounded-lg lg:border lg:border-[#2F7FE8] lg:px-3 lg:py-2 lg:text-sm lg:text-slate-900">
                <span className="whitespace-nowrap text-[15px] font-semibold text-[#0C73DA] md:text-sm">*{product.specialOfferLeft} =</span>

                <span className="h-6 w-px bg-slate-500/60" aria-hidden="true" />

                <span className="flex items-center gap-2 whitespace-nowrap text-[15px] md:text-sm">
                  <Image src="/images/ebl.png" alt="EBL" width={40} height={24} className="h-6 w-auto object-contain" />
                  {product.specialOfferOne}
                </span>

                <span className="h-6 w-px bg-slate-500/60" aria-hidden="true" />

                <span className="flex items-center gap-2 whitespace-nowrap text-[15px] md:text-sm">
                  <Image src="/images/nogod.png" alt="Nagad" width={40} height={24} className="h-6 w-auto object-contain" />
                  {product.specialOfferTwo}
                </span>
              </div>

              <div className="hidden lg:block lg:space-y-2 lg:border-b lg:border-slate-200 lg:pb-3 lg:text-xs lg:text-slate-600 lg:md:text-sm">
                <p className="flex items-center gap-5">
                  <Image src="/images/shippingtime.png" alt="Shipping time" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                  {product.shippingInfo}
                </p>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-5">
                    <Image src="/images/warranty.png" alt="Warranty" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                    {product.warrantyInfo}
                  </span>
                  <button type="button" className="whitespace-nowrap text-[#0C73DA] text-xs md:text-sm font-medium hover:underline">View policy</button>
                </p>
                <p className="flex items-center gap-5">
                  <Image src="/images/Vector.png" alt="EMI facility" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                  {product.emiFacilityInfo}
                </p>
                <p className="flex flex-wrap items-start gap-2">
                  <Image src="/images/exchange.png" alt="Exchange" width={24} height={24} unoptimized className="h-7 w-7 object-contain flex-shrink-0" />
                  <span className="flex-1 pt-0.5">{product.exchangeInfo}</span>
                  <button type="button" className="whitespace-nowrap text-[#0C73DA] text-xs md:text-sm font-medium hover:underline flex-shrink-0">Available Showrooms</button>
                </p>
              </div>

              <p className="hidden rounded bg-slate-100 py-1 text-center text-lg font-medium text-[#0C73DA] lg:block">
                {product.madeInText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Product Details */}

      <ProductDetailsTabs
        title={`${product.title} | ${product.model}`}
        descriptionHtml={product.descriptionHtml ?? buildDescriptionHtml(product)}
        specificationsHtml={product.specificationsHtml ?? buildSpecificationsHtml(product)}
        featureHtml={product.featuresHtml ?? buildFeatureHtml(product)}
        policyHtml={product.policyHtml ?? buildPolicyHtml(product)}
      />

      <MobileStickyPurchaseBar
        availability={product.availability}
        price={product.price}
        discountLabel={product.discountLabel}
        originalPrice={product.originalPrice}
        saveLabel={product.saveLabel}
        emiText={product.emiText}
        emiDetailsLabel={product.emiDetailsLabel}
      />

      <FooterBreadcrumbPortal>
        <div className="">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[12px] leading-none text-slate-500"
          >
            <span>Home</span>
            <span className="text-slate-400">›</span>
            <span>{breadcrumbCategory}</span>
            <span className="text-slate-400">›</span>
            <span className="text-slate-700">Washing Machine details</span>
          </nav>
        </div>
      </FooterBreadcrumbPortal>

    </div>
  );
}
