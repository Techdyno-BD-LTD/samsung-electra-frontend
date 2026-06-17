"use client";

import { useState } from "react";
import AddToCartModal, { ProductData } from "./AddToCartModal";
import { FaHeart, FaBalanceScale, FaShoppingCart, FaStar, FaEye, FaGavel } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToWishlistAsync, removeFromWishlistAsync, WishlistItem } from "@/store/features/wishlist/wishlistSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import { toggleCompare } from "@/store/features/compare/compareSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toProductSlug } from "@/lib/productSlug";
import BankEmiModal from "../productdetails/BankEmiModal";

interface ProductCardProps {
  cardVariant?: "default" | "flashDeal" | "specialDeal";
  category?: string;
  brand?: string;
  brandLogo?: string;
  title?: string;
  slug?: string;
  image?: string;
  rating?: number;
  ratingCount?: string;
  type?: string;
  weight?: string;
  color?: string;
  price?: string;
  originalPrice?: string;
  discountPercent?: string;
  saveAmount?: string;
  emiPrice?: string;
  emiPercent?: string;
  emiMonths?: number;
  isSale?: boolean;
  hasWarranty?: boolean;
  warrantyBadgeImage?: string;
  tags?: string[];
  statusBadge?: string;
  isBestSeller?: boolean;
  dealLabel?: string;
  stockLabel?: string;
  quickDetailsLabel?: string;
  dealDays?: string;
  dealHours?: string;
  dealMinutes?: string;
  dealSeconds?: string;
  bidsCount?: string;
  viewsCount?: string;
  startingFrom?: string;
  bidButtonLabel?: string;
  dealImageHeight?: string;
  productData?: ProductData;
}

const hasDiscount = (
  discountStr?: string | null,
  mainPrice?: string | number | null,
  strokedPrice?: string | number | null
) => {
  if (discountStr) {
    const cleanDiscount = String(discountStr).replace(/[^\d.]/g, '');
    if (parseFloat(cleanDiscount) === 0) {
      return false;
    }
  }
  if (mainPrice && strokedPrice) {
    const parsePrice = (priceStr?: string | number | null) => {
      if (priceStr === null || priceStr === undefined) return 0;
      const normalized = String(priceStr).replace(/[^\d.]/g, '');
      return parseFloat(normalized) || 0;
    };
    const main = parsePrice(mainPrice);
    const stroked = parsePrice(strokedPrice);
    if (stroked <= main) {
      return false;
    }
    return true;
  }
  if (mainPrice && !strokedPrice) {
    return false;
  }
  return !!discountStr;
};

const ProductCard = ({
  cardVariant = "default",
  category = "",
  brand = "",
  brandLogo = "",
  title = "",
  slug = "",
  image = "",
  rating = 0,
  ratingCount = "",
  type = "",
  weight = "",
  color = "",
  price = "",
  originalPrice = "",
  discountPercent = "",
  saveAmount = "",
  emiPrice = "",
  emiPercent = "",
  isSale = false,
  hasWarranty = false,
  warrantyBadgeImage = "",
  tags = [],
  statusBadge = "",
  isBestSeller = false,
  dealLabel = "Hurray Up",
  stockLabel = "Limit stock",
  quickDetailsLabel = "Quick Details",
  dealDays = "01",
  dealHours = "14",
  dealMinutes = "20",
  dealSeconds = "04",
  bidsCount = "08",
  viewsCount = "1,326",
  startingFrom = "৳ 56,500",
  dealImageHeight = "180px",
  productData,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);

  const productSlug = productData?.slug || slug || toProductSlug(title);
  const wishlistItemId = productSlug || title;
  const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.id === wishlistItemId));
  const isCompared = useAppSelector((state) => state.compare.slots.some((slot) => slot?.id === wishlistItemId));

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productSlug));
    } else {
      const item: WishlistItem = {
        id: productSlug,
        productId: Number(productData?.id || 0),
        title,
        brand,
        image,
        price,
        originalPrice,
        discountLabel: discountPercent,
        saveAmount,
        color,
        type,
        weight,
        rating,
        ratingCount,
        brandLogo,
        emiPrice,
        emiPercent,
        tags,
      };
      dispatch(addToWishlistAsync(item)).then((result) => {
        if (addToWishlistAsync.fulfilled.match(result)) {
          dispatch(showToast({
            message: "Added to Wishlist!",
            type: 'success',
            productName: title,
            productImage: image,
            productPrice: price,
            actionLabel: "View Wishlist",
            actionLink: "/dashboard/wishlist"
          }));
        }
      });
    }
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleCompare({
        id: wishlistItemId,
        slug: productSlug,
        title,
        brand,
        brandLogo,
        image,
        price,
        originalPrice,
        discountPercent,
        saveAmount,
        category,
        type,
        weight,
        color,
        rating,
        ratingCount,
      })
    );
  };

  const productHref = `/products/${productSlug}`;
  const displayBadgeLabel = productData?.badge_value || statusBadge.trim() || (isSale ? "Sale" : "");
  const badgeStyleTag = productData?.badge_tag || statusBadge.trim() || (isSale ? "Sale" : "");
  const normalizedBadgeTag = badgeStyleTag.toLowerCase();

  const badgeClassName =
    normalizedBadgeTag === "sale"
      ? "bg-red-600"
      : normalizedBadgeTag === "new"
        ? "bg-emerald-600"
        : normalizedBadgeTag === "hot"
          ? "bg-orange-500"
          : normalizedBadgeTag === "sold out"
            ? "bg-slate-600"
            : normalizedBadgeTag === "special"
              ? "bg-blue-600"
              : normalizedBadgeTag === "hurry up"
                ? "bg-red-500"
                : normalizedBadgeTag === "popular"
                  ? "bg-indigo-600"
                  : "bg-red-600";

  // Refined Star Renderer: Smaller (h-3) and Orange (orange-400)
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            className={`h-3 w-3 ${i < Math.floor(count)
              ? "fill-orange-400 text-orange-400"
              : "fill-gray-200 text-gray-200"
              }`}
          />
        ))}
      </div>
    );
  };

  if (cardVariant === "flashDeal") {
    const dealBadgeBg = dealLabel.toLowerCase() === "cashback" ? "bg-red-600" : "bg-[#2B7FE8]";
    return (
      <article className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <span className={`absolute left-0 top-0 rounded-br-2xl rounded-tl-2xl px-4 py-1 text-sm font-medium text-white ${dealBadgeBg}`}>
          {dealLabel}
        </span>

        <span
          className="absolute right-4 top-10 flex h-14 w-14 items-center justify-center bg-[#2B7FE8] px-1 text-center text-xs font-semibold leading-[1.05] text-white"
          style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
        >
          {stockLabel}
        </span>

        <div className="pt-7">
          <div className="mb-2 flex justify-center">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt={brand || "Brand logo"}
                width={130}
                height={34}
                className="h-5 w-auto object-contain"
              />
            ) : (
              <span className="text-sm font-bold uppercase tracking-wide text-slate-800">{brand}</span>
            )}
          </div>

          <Link href={productHref} className="mb-2 flex items-center justify-center rounded-md" style={{ height: dealImageHeight }}>
            <Image src={image} alt={title} width={230} height={150} style={{ height: dealImageHeight }} className="w-auto object-contain" />
          </Link>

          <Link href={productHref} className="mx-auto mb-4 block text-xs text-slate-500 underline">
            {quickDetailsLabel}
          </Link>

          <h3 className="line-clamp-2 min-h-[56px] text-[18px] font-medium leading-7 text-slate-900">
            <Link href={productHref}>{title}</Link>
          </h3>

          <div className=" grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end gap-1 text-center text-[#1B57A6]">
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8]  py-1 text-[18px] lg:text-[25px] font-semibold leading-none">{dealDays}</div>
              <p className="mt-1 text-xs text-slate-500">Days</p>
            </div>
            <span className="pb-4 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8]  py-1 text-[18px] lg:text-[25px] font-semibold leading-none">{dealHours}</div>
              <p className="mt-1 text-xs text-slate-500">Hour</p>
            </div>
            <span className="pb-4 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8]  py-1 text-[18px] lg:text-[25px] font-semibold leading-none">{dealMinutes}</div>
              <p className="mt-1 text-xs text-slate-500">Minute</p>
            </div>
            <span className="pb-4 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8]  py-1 text-[18px] lg:text-[25px] font-semibold leading-none">{dealSeconds}</div>
              <p className="mt-1 text-xs text-slate-500">Second</p>
            </div>
          </div>

          {/* Stats or Add to Cart on Hover */}
          <div className="relative min-h-[90px] overflow-hidden mt-3">
            {/* Stats - fades out on hover */}
            <div className="w-full transition-all duration-300 ease-in-out group-hover:pointer-events-none group-hover:-translate-y-4 group-hover:opacity-0">
              <div className="flex items-center justify-between text-[12px] lg:text-[15px]">
                <p className="flex items-center gap-2 text-[#EF9B2E]">
                  <FaGavel className="h-4 w-4 text-slate-500" />
                  Bids : {bidsCount}
                </p>
                <span className="text-slate-300">|</span>
                <p className="flex items-center gap-2 text-[#FF3D3D]">
                  <FaEye className="h-4 w-4 text-slate-500" />
                  Views : {viewsCount}
                </p>
              </div>

              <div className="mt-3 rounded-md bg-[#efefef] px-3 py-2 text-[12px] lg:text-[15px] font-semibold text-slate-900">
                Starting From : {startingFrom}
              </div>
            </div>

            {/* Add to cart - slides up and fades in on hover */}
            <div className="absolute inset-0 flex items-center opacity-0 translate-y-10 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C5AA6] py-2.5 text-[18px] font-medium text-white transition-all hover:bg-[#15458a]"
              >
                <FaShoppingCart className="h-5 w-5" />
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productData={productData}
          title={title} brand={brand} price={price} originalPrice={originalPrice}
          image={image} category={category} discountLabel={discountPercent}
          saveLabel={saveAmount} weight={weight} color={color} slug={slug}
        />
      </article>
    );
  }

  if (cardVariant === "specialDeal") {
    const specialBadgeBg = dealLabel.toLowerCase() === "cashback" ? "bg-red-600" : "bg-[#2B7FE8]";
    return (
      <article className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-300 hover:shadow-lg">
        <span className={`absolute left-0 top-0 rounded-br-2xl rounded-tl-2xl px-4 py-1 text-sm font-medium text-white ${specialBadgeBg}`}>
          {dealLabel}
        </span>

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button type="button" onClick={handleToggleWishlist} aria-label="Toggle wishlist" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaHeart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-gray-600"}`} />
          </button>
          <button type="button" onClick={handleToggleCompare} aria-label="Toggle compare" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaBalanceScale className={`h-4 w-4 ${isCompared ? "text-[#2b7fe8]" : "text-gray-600"}`} />
          </button>
        </div>

        <div className="pt-7">
          <div className="mb-3 flex justify-center">
            {brandLogo ? (
              <Image src={brandLogo} alt={brand || "Brand logo"} width={130} height={34} className="h-5 w-auto object-contain" />
            ) : (
              <span className="text-sm font-bold uppercase tracking-wide text-slate-800">{brand}</span>
            )}
          </div>

          <Link href={productHref} className="mb-2 flex items-center justify-center rounded-md" style={{ height: dealImageHeight }}>
            <Image src={image} alt={title} width={380} height={260} style={{ height: dealImageHeight }} className="w-auto object-contain" />
          </Link>

          <Link href={productHref} className="mx-auto mb-3 block text-xs text-slate-500 underline opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {quickDetailsLabel}
          </Link>

          {type && <p className="mb-2 text-sm text-slate-500">{type}</p>}

          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-end gap-1 text-center text-[#1B57A6]">
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8] py-1 text-[25px] font-semibold leading-none">{dealDays}</div>
              <p className="mt-1 text-xs text-slate-500">Days</p>
            </div>
            <span className="pb-5 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8] py-1 text-[25px] font-semibold leading-none">{dealHours}</div>
              <p className="mt-1 text-xs text-slate-500">Hour</p>
            </div>
            <span className="pb-5 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8] py-1 text-[25px] font-semibold leading-none">{dealMinutes}</div>
              <p className="mt-1 text-xs text-slate-500">Minute</p>
            </div>
            <span className="pb-5 text-[28px] text-slate-800">:</span>
            <div>
              <div className="rounded-b-xl border-b border-[#2B7FE8] py-1 text-[25px] font-semibold leading-none">{dealSeconds}</div>
              <p className="mt-1 text-xs text-slate-500">Second</p>
            </div>
          </div>

          <h3 className="mt-3 line-clamp-2 min-h-[56px] text-[18px] font-medium leading-7 text-slate-900">
            <Link href={productHref}>{title}</Link>
          </h3>

          {/* Prices or Buy Now on Hover */}
          <div className="relative min-h-[44px] overflow-hidden mt-2">
            {/* Prices - fades out and slides up on hover */}
            <div className="flex flex-wrap items-center gap-2 text-sm transition-all duration-300 ease-in-out group-hover:pointer-events-none group-hover:-translate-y-4 group-hover:opacity-0">
              <span className="text-lg font-bold text-slate-900">{price}</span>
              {hasDiscount(discountPercent, price, originalPrice) && (
                <>
                  {originalPrice && <span className="text-slate-400 line-through text-xs">{originalPrice}</span>}
                  {saveAmount && <span className="rounded bg-[#1B57A6] px-2 py-0.5 text-xs text-white">{saveAmount}</span>}
                  {discountPercent && <span className="text-xs text-red-500 font-medium">{discountPercent}</span>}
                </>
              )}
            </div>

            {/* Buy Now - slides up and fades in on hover */}
            <div className="absolute inset-0 flex items-center opacity-0 translate-y-10 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C5AA6] py-2 text-[16px] font-medium text-white transition-all hover:bg-[#15458a]"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productData={productData}
          title={title} brand={brand} price={price} originalPrice={originalPrice}
          image={image} category={category} discountLabel={discountPercent}
          saveLabel={saveAmount} weight={weight} color={color} slug={slug}
        />
      </article>
    );
  }

  if (isBestSeller) {
    const title = productData?.name || "";
    const image = productData?.thumbnail_image || "";
    const brandName = productData?.brand?.name || brand;
    const brandLogoUrl = productData?.brand?.logo || brandLogo;
    const currentPrice = productData?.main_price || price;
    const oldPrice = productData?.stroked_price || originalPrice;
    const ratingValue = productData?.rating ?? rating;
    const ratingCountValue = productData?.rating_count ?? ratingCount;
    const categoryName = productData?.category?.name || type;
    // const weightValue = productData?.weight ? `${productData.weight}kg` : weight;
    const variantLabel = productData?.variants?.[0]?.variant || "No Variant";

    return (
      <article className="group relative w-full max-w-full overflow-hidden rounded-t-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
        {displayBadgeLabel && (
          <div
            className="absolute top-8 right-2 z-20 flex h-12 w-12 items-center justify-center bg-[#0081FF] p-1 text-center text-[9px] font-semibold leading-tight text-white sm:top-14 sm:right-6 sm:h-[70px] sm:w-[70px] sm:p-2 sm:text-[12px]"
            style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
          >
            {displayBadgeLabel}
          </div>
        )}

        {/* Primary Product Badge (Sale/New/Hot/Sold Out/Special) */}
        {badgeStyleTag && (
          <span className={`absolute top-0 left-0 z-10 rounded-br-2xl px-2 py-1 text-[10px] font-semibold text-white sm:px-4 sm:py-1.5 sm:text-xs ${badgeClassName}`}>
            {badgeStyleTag}
          </span>
        )}

        <div className="absolute right-3 top-3 z-10 hidden flex-row gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
          <button onClick={handleToggleWishlist} aria-label="Toggle wishlist" className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaHeart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-gray-600"}`} />
          </button>
          <button onClick={handleToggleCompare} aria-label="Toggle compare" className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaBalanceScale className={`h-4 w-4 ${isCompared ? "text-[#2b7fe8]" : "text-gray-600"}`} />
          </button>
        </div>

        <div className="flex justify-center pb-1 pt-4 sm:pb-2 sm:pt-6">
          {brandLogoUrl ? (
            <Image
              src={brandLogoUrl}
              alt={brandName || "Brand logo"}
              width={140}
              height={36}
              className="h-4 w-auto object-contain sm:h-7"
            />
          ) : (
            <span className="text-sm font-bold uppercase tracking-wide text-foreground sm:text-lg">
              {brandName}
            </span>
          )}
        </div>

        <div className="relative mx-auto flex items-center justify-center overflow-hidden px-2 py-1.5 sm:px-3 sm:py-2">
          <Link href={productHref}>
            <Image
              src={image}
              alt={title}
              width={300}
              height={180}
              className="h-[96px] w-auto object-contain sm:h-[200px]"
            />
          </Link>

          {/* Add to cart removed from here as per user request */}

          {hasWarranty && (
            <div className="absolute -bottom-2 left-2 sm:-bottom-6 sm:left-5">
              <Image
                src={warrantyBadgeImage}
                alt="Warranty badge"
                width={64}
                height={64}
                className="h-8 w-8 object-contain sm:h-20 sm:w-20"
              />
            </div>
          )}
        </div>

        <p className="hidden sm:block pb-2 text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:pb-3 sm:text-[10px] sm:tracking-wider">
          <Link href={productHref}>Quick Look</Link>
        </p>

        <div className="flex items-start justify-between px-2 pb-1.5 sm:items-center sm:px-4 sm:pb-2">
          <div className="min-w-0 flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] font-medium text-gray-500 sm:text-xs">{categoryName}</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="flex items-center gap-0.5 sm:hidden">
                <FaStar className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="text-[9px] font-medium text-[#0054A6]">{Number(ratingValue).toFixed(1)}</span>
              </div>
              <div className="hidden items-center gap-0.5 sm:flex">
                {renderStars(Number(ratingValue))}
                <span className="text-[10px] font-medium text-[#0054A6]">{ratingCountValue}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 sm:text-xs">
            {variantLabel}
          </span>
        </div>

        <h3 className="line-clamp-2 h-[32px] overflow-hidden px-2 text-[12px] font-semibold leading-4 sm:h-auto sm:min-h-[40px] sm:px-4 sm:pb-1 sm:text-[16px] sm:font-medium sm:leading-relaxed">
          <Link href={productHref}>{title}</Link>
        </h3>

        <div className="flex items-end gap-2 px-2 pb-2 sm:px-4">
          <span className="text-[14px] sm:text-[17px] font-bold text-[#0AB15A]">{currentPrice}</span>
          {hasDiscount(productData?.discount || discountPercent, currentPrice, oldPrice) && oldPrice && (
            <span className="text-[12px] text-slate-400 line-through">{oldPrice}</span>
          )}
        </div>

        <div className="px-2 pb-1 sm:px-4">
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="h-1.5 rounded-full bg-[#2B7FE8]"
              style={{ width: `${Math.min(100, Math.max(0, ((productData?.product_sold || 0) / (productData?.current_stock || 1)) * 100))}%` }}
            />
          </div>
        </div>
        {/* Sold Info or Add to Cart on Hover */}
        <div className="relative min-h-[50px] overflow-hidden">
          {/* Sold Info - visible by default, hidden on hover */}
          <div className="flex items-center justify-between px-2 pb-3 text-[11px] sm:px-4 transition-all duration-300 ease-in-out group-hover:pointer-events-none group-hover:-translate-y-4 group-hover:opacity-0">
            <span className="text-slate-500">Sold : {productData?.product_sold || 0} / {productData?.current_stock || 0}</span>
            <span className="font-semibold text-[#0AB15A]">
              {((productData?.product_sold || 0) / (productData?.current_stock || 1) * 100).toFixed(2)}%
            </span>
          </div>

          {/* Add to cart - slides up and fades in on hover */}
          <div className="absolute inset-x-2 bottom-3 flex opacity-0 translate-y-10 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4 sm:bottom-3">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0054A6] py-1.5 text-[12px] font-semibold text-white transition-all hover:bg-[#004487]"
            >
              <FaShoppingCart className="h-3.5 w-3.5" />
              Add to cart
            </button>
          </div>
        </div>

        <div className="px-2 pb-3 sm:hidden">
          <button onClick={handleAddToCart} className="flex mx-auto w-6/12 items-center justify-center rounded-xl bg-[#0054A6] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#004487]">
            Buy Now
          </button>
        </div>

        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productData={productData}
          title={title} brand={brand} price={price} originalPrice={originalPrice}
          image={image} category={category} discountLabel={discountPercent}
          saveLabel={saveAmount} weight={weight} color={color} slug={slug}
        />
      </article>
    );
  }

  return (
    <div className="group relative w-full max-w-full overflow-hidden rounded-t-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
      {/* EMI Badge */}
      {displayBadgeLabel && (
        <div
          className="absolute top-8 right-2 z-20 flex h-12 w-12 items-center justify-center bg-[#0081FF] p-1 text-center text-[9px] font-semibold leading-tight text-white sm:top-14 sm:right-6 sm:h-[70px] sm:w-[70px] sm:p-2 sm:text-[12px]"
          style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
        >
          {displayBadgeLabel}
        </div>
      )}

      {/* Primary Product Badge (Sale/New/Hot/Sold Out/Special) */}
      {badgeStyleTag && (
        <span className={`absolute top-0 left-0 z-10 rounded-br-2xl px-2 py-1 text-[10px] font-semibold text-white sm:px-4 sm:py-1.5 sm:text-xs ${badgeClassName}`}>
          {badgeStyleTag}
        </span>
      )}

      {/* Hover Action Buttons */}
      <div
        className="absolute right-3 top-3 z-10 hidden flex-row gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex"
      >
        <button onClick={handleToggleWishlist} aria-label="Toggle wishlist" className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaHeart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-gray-600"}`} />
        </button>
        <button onClick={handleToggleCompare} aria-label="Toggle compare" className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaBalanceScale className={`h-4 w-4 ${isCompared ? "text-[#2b7fe8]" : "text-gray-600"}`} />
        </button>
      </div>

      {/* Brand Header */}
      <div className="flex justify-center pt-4 pb-1 sm:pt-6 sm:pb-2">
        {(productData?.brand?.logo || brandLogo) ? (
          <Image
            src={productData?.brand?.logo || brandLogo || ""}
            alt={productData?.brand?.name || brand || "Brand logo"}
            width={140}
            height={36}
            className="h-4 w-auto object-contain sm:h-7"
          />
        ) : (
          <span className="text-sm font-bold tracking-wide text-foreground uppercase sm:text-lg">
            {productData?.brand?.name || brand}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative mx-auto flex items-center justify-center overflow-hidden px-2 py-1.5 sm:px-3 sm:py-2">
        <Link href={productHref}>
          <Image
            src={productData?.thumbnail_image || image || ""}
            alt={title}
            width={300}
            height={180}
            className="h-[96px] w-auto object-contain sm:h-[200px]"
          />
        </Link>

        {/* Add to cart removed from here as per user request */}

        {hasWarranty && (
          <div className="absolute -bottom-2 left-2 sm:-bottom-6 sm:left-5">
            <Image
              src={warrantyBadgeImage}
              alt="Warranty badge"
              width={64}
              height={64}
              className="h-8 w-8 object-contain sm:h-20 sm:w-20"
            />
          </div>
        )}
      </div>

      <p className="hidden sm:block pb-2 text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:pb-3 sm:text-[10px] sm:tracking-wider">
        <Link href={productHref}>Quick Look</Link>
      </p>

      {/* Type and Rating Section (Stars are now close to the type) */}
      <div className="flex items-start justify-between px-2 pb-1.5 sm:items-center sm:px-4 sm:pb-2">
        <div className="min-w-0 flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] font-medium text-gray-500 sm:text-xs">{productData?.category?.name || type}</span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="flex items-center gap-0.5 sm:hidden">
              <FaStar className="h-3 w-3 fill-orange-400 text-orange-400" />
              <span className="text-[9px] font-medium text-[#0054A6]">{Number(productData?.rating ?? rating).toFixed(1)}</span>
            </div>
            <div className="hidden items-center gap-0.5 sm:flex">
              {renderStars(Number(productData?.rating ?? rating))}
              <span className="text-[10px] font-medium text-[#0054A6]">{productData?.rating_count ?? ratingCount}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 sm:text-xs">
          {productData?.variants?.[0]?.variant || "No Variant"}
        </span>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 h-[32px] overflow-hidden px-2 text-[12px] font-semibold leading-4 sm:h-auto sm:min-h-[40px] sm:px-4 sm:pb-1 sm:text-[16px] sm:font-medium sm:leading-relaxed">
        <Link href={productHref}>{productData?.name || title}</Link>
      </h3>

      {/* EMI Info */}
      <div className="flex items-start justify-between gap-1 px-2 pb-1 sm:items-center sm:px-4">
        <span className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground sm:text-xs">
          {/* Icon Image Tag */}
          <Image
            src="/images/EMI.png" // Tomar icon er file path ekhane hobe
            alt="EMI Icon"
            width={12}  // Size tulo-namulok bhabe choto rakha hoyeche text er sathe milate
            height={12}
            className="object-contain"
          />
          <span className="line-clamp-2 leading-4 sm:line-clamp-1">
            EMI From {productData?.emi_start || emiPrice} Tk/Month
          </span>
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEmiModalOpen(true);
          }}
          className="shrink-0 text-[10px] font-semibold text-blue-600 hover:underline sm:text-xs"
        >
          EMI Details
        </button>
      </div>

      {/* Pricing */}
      <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2 sm:gap-2 sm:px-4">
        <span className="text-[14px] font-bold text-[#0081FF] sm:text-[17px]">
          {productData?.main_price || price}
        </span>
        {hasDiscount(productData?.discount || discountPercent, productData?.main_price || price, productData?.stroked_price || originalPrice) && (
          <>
            {(productData?.stroked_price || originalPrice) && (
              <span className="text-[11px] text-[#909090] line-through sm:text-[13px]">
                {productData?.stroked_price || originalPrice}
              </span>
            )}
            {(productData?.discount || discountPercent) && (
              <span className="text-[10px] font-semibold text-red-600 sm:text-xs">
                {productData?.discount || discountPercent}
              </span>
            )}

            <div>
              {(() => {
                const parsePrice = (priceStr?: string | number) => {
                  if (priceStr === null || priceStr === undefined) return 0;
                  const normalized = String(priceStr).replace(/[^\d.]/g, '');
                  return parseFloat(normalized) || 0;
                };

                const original = parsePrice(productData?.stroked_price || originalPrice);
                const current = parsePrice(productData?.main_price || price);
                const savings = original - current;

                if (savings <= 0) return null;

                return (
                  <span className="inline-block rounded-tl-2xl rounded-br-2xl bg-red-600 px-2 py-0.5 text-[9px] font-medium text-white uppercase sm:px-3 sm:py-1 sm:text-[10px]">
                    Save: {savings.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                );
              })()}
            </div>
          </>
        )}
      </div>


      {/* Savings Badge */}
      {/* {saveAmount && (
        <div className="px-4 pb-3">
          <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold text-white uppercase">
         {saveAmount}
          </span>
        </div>
      )} */}

      {/* Tags or Add to Cart on Hover */}
      <div className="relative lg:min-h-[52px] overflow-hidden px-2 pb-3 sm:px-4 sm:pb-4">
        {/* Tags - fades out and slides up on hover */}
        <div className="w-full hidden lg:block transition-all duration-300 ease-in-out group-hover:pointer-events-none group-hover:-translate-y-4 group-hover:opacity-0">
          {(() => {
            interface TagObject {
              value?: string;
              label?: string;
            }
            let displayTags: string | (string | TagObject)[] = (productData?.tags as string[] | undefined) || tags || [];

            // Handle string cases from API
            if (typeof displayTags === 'string') {
              try {
                displayTags = JSON.parse(displayTags as string);
              } catch {
                // Fallback to comma separated or single tag
                displayTags = (displayTags as string).split(',').map((t: string) => t.trim()).filter(Boolean);
              }
            }

            if (!Array.isArray(displayTags) || displayTags.length === 0) return null;

            return (
              <div
                className="grid gap-1.5"
                style={{
                  gridTemplateColumns: `repeat(${displayTags.length}, 1fr)`,
                }}
              >
                {displayTags.map((tag, index) => {
                  try {
                    // If tag is already an object, use it directly
                    if (typeof tag === 'object' && tag !== null) {
                      const tagObj = tag as TagObject;
                      return (
                        <span key={index} className="rounded-full bg-[#E7EEF6] py-1 text-center text-[9px] font-semibold text-[#0054A6] sm:text-[10px]">
                          {tagObj.value || tagObj.label || JSON.stringify(tag)}
                        </span>
                      );
                    }

                    // Otherwise try to parse as JSON string
                    const cleanedTag = String(tag).replace(/^\[|\]$/g, "");
                    const tagObj = JSON.parse(cleanedTag);
                    return (
                      <span
                        key={index}
                        className="rounded-full bg-[#E7EEF6] py-1 text-center text-[9px] font-semibold text-[#0054A6] sm:text-[10px]"
                      >
                        {tagObj.value || tagObj.label || tagObj}
                      </span>
                    );
                  } catch {
                    // Fallback to raw string
                    return (
                      <span key={index} className="rounded-full bg-[#E7EEF6] py-1 text-center text-[9px] font-semibold text-[#0054A6] sm:text-[10px]">
                        {typeof tag === 'object' ? (tag as { value?: string, label?: string }).value || (tag as { value?: string, label?: string }).label || 'Tag' : String(tag)}
                      </span>
                    );
                  }
                })}
              </div>
            );
          })()}
        </div>

        {/* Add to cart / See Details - slides up and fades in on hover */}
        <div className="absolute inset-x-2 bottom-3 flex opacity-0 translate-y-10 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 sm:inset-x-4 sm:bottom-4">
          {productData?.higher_sale ? (
            <Link
              href={productHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0054A6] py-2 text-sm font-semibold text-white transition-all hover:bg-[#004487]"
            >
              <FaEye className="h-4 w-4" />
              See Details
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0054A6] py-2 text-sm font-semibold text-white transition-all hover:bg-[#004487]"
            >
              <FaShoppingCart className="h-4 w-4" />
              Add to cart
            </button>
          )}
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="px-2 pb-3 sm:hidden">
        {productData?.higher_sale ? (
          <Link href={productHref} className="flex w-6/12 mx-auto items-center justify-center rounded-xl bg-[#0054A6] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#004487]">
            See Details
          </Link>
        ) : (
          <button onClick={handleAddToCart} className="flex w-6/12 mx-auto items-center justify-center rounded-xl bg-[#0054A6] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#004487]">
            Buy Now
          </button>
        )}
      </div>

      {/* Add to Cart - show only on hover */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productData={productData}
        title={title} brand={brand} price={price} originalPrice={originalPrice}
        image={image} category={category} discountLabel={discountPercent}
        saveLabel={saveAmount} weight={weight} color={color} slug={slug}
      />
      <BankEmiModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        emiPlans={productData?.emi_plans || []}
        productName={productData?.name || title}
        productSlug={productSlug}
      />
    </div>
  );
};

export default ProductCard;