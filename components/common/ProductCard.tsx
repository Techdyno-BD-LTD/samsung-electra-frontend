"use client";

import { useState, useEffect } from "react";
import AddToCartModal, { ProductData } from "./AddToCartModal";
import CartSuccessModal from "@/components/common/CartSuccessModal";
import { FaHeart, FaBalanceScale, FaShoppingCart, FaStar, FaEye, FaGavel } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToWishlistAsync, removeFromWishlistAsync, WishlistItem } from "@/store/features/wishlist/wishlistSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import { toggleCompare } from "@/store/features/compare/compareSlice";
import { addToCart } from "@/store/features/cart/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toProductSlug } from "@/lib/productSlug";
import BankEmiModal from "../productdetails/BankEmiModal";
import { pushToDataLayer } from "@/lib/gtm";
import { BiGitCompare } from "react-icons/bi";

interface ProductCardProps {
  cardVariant?: "default" | "flashDeal" | "specialDeal" | "auction";
  category?: string;
  brand?: string;
  brandLogo?: string;
  title?: string;
  slug?: string;
  image?: string;
  userBidAmount?:number;
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
  startingBid?: number;
  highestBid?: number;
  totalBids?: number;
  auctionStartDate?: number;
  auctionEndDate?: number;
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

const parsePriceNum = (priceStr?: string | number | null) => {
  if (priceStr === null || priceStr === undefined) return 0;
  const normalized = String(priceStr).replace(/[^\d.]/g, '');
  return parseFloat(normalized) || 0;
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
  startingBid,
  highestBid,
  totalBids,
  auctionStartDate,
  auctionEndDate,
  userBidAmount,
}: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);

  // Auction Countdown State & Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, hasEnded: false, isUpcoming: false });

  useEffect(() => {
    if (cardVariant !== "auction" || !auctionEndDate) return;

    const calculateTimeLeft = () => {
      const nowMs = Date.now();
      const startMs = auctionStartDate ? auctionStartDate * 1000 : 0;
      const endMs = auctionEndDate * 1000;

      if (nowMs < startMs) {
        // Upcoming
        const diff = startMs - nowMs;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, hasEnded: false, isUpcoming: true });
      } else if (nowMs >= endMs) {
        // Ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, hasEnded: true, isUpcoming: false });
      } else {
        // Active
        const diff = endMs - nowMs;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, hasEnded: false, isUpcoming: false });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [cardVariant, auctionStartDate, auctionEndDate]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedItemDetails, setAddedItemDetails] = useState<{
    title: string;
    image: string;
    price: string;
    originalPrice?: string;
  } | null>(null);

  const productSlug = productData?.slug || slug || toProductSlug(title);
  const wishlistItemId = productSlug || title;
  const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.id === wishlistItemId));
  const isCompared = useAppSelector((state) => state.compare.slots.some((slot) => slot?.id === wishlistItemId));

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSelectItem = () => {
    pushToDataLayer({
      event: "select_item",
      ecommerce: {
        item_list_name: cardVariant === "flashDeal" ? "Flash Deals" : cardVariant === "specialDeal" ? "Special Deals" : "Standard Grid",
        items: [{
          id: productData?.id ? String(productData.id) : productSlug,
          item_id: productData?.id ? String(productData.id) : productSlug,
          item_name: productData?.name || title || "Product",
          currency: "BDT",
          price: parsePriceNum(productData?.main_price || price),
          item_brand: productData?.brand?.name || brand || "Brand",
          item_category: productData?.category_info?.parent_category_name || productData?.category?.name || type || "Category",
          item_category2: productData?.category_info?.parent_category_name ? (productData?.category?.name || type || "Category") : undefined,
          item_variant: productData?.variants?.[0]?.variant || "",
          quantity: 1,
        }]
      }
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the product has variants
    const hasVariants = !!(
      productData?.variants &&
      productData.variants.length > 0 &&
      productData.variants.some((v) => {
        const name = v.variant?.trim().toLowerCase();
        return name && name !== "no variant" && name !== "";
      })
    );

    if (hasVariants) {
      setIsModalOpen(true);
    } else {
      const mainPriceNum = parsePriceNum(productData?.main_price || price);
      const strokedPriceNum = parsePriceNum(productData?.stroked_price || originalPrice);
      const savings = Math.max(0, strokedPriceNum - mainPriceNum);
      const saveLabel = savings > 0 ? `Save : ৳ ${savings.toLocaleString('en-US')}` : "Save : ৳ 0";

      const cartItem = {
        id: productSlug,
        slug: productSlug,
        title: productData?.name || title || "Product",
        brand: productData?.brand?.name || brand || "Brand",
        image: productData?.thumbnail_image || image || "",
        price: String(productData?.main_price || price).split('/')[0].trim(),
        originalPrice: String(productData?.stroked_price || originalPrice || "").split('/')[0].trim(),
        discountPercent: productData?.discount || discountPercent || "0%",
        saveAmount: saveLabel,
        color: color || "",
        variant: "",
        type: productData?.category?.name || type || "Category",
        weight: (weight || productData?.weight) ? `${weight || productData?.weight}kg` : "N/A",
        quantity: 1,
        productId: Number(productData?.id || 0),
      };

      dispatch(addToCart(cartItem));

      pushToDataLayer({
        event: "add_to_cart",
        ecommerce: {
          currency: "BDT",
          value: mainPriceNum,
          items: [{
            id: productData?.id ? String(productData.id) : productSlug,
            item_id: productData?.id ? String(productData.id) : productSlug,
            item_name: productData?.name || title || "Product",
            currency: "BDT",
            price: mainPriceNum,
            item_brand: productData?.brand?.name || brand || "Brand",
            item_category: productData?.category_info?.parent_category_name || productData?.category?.name || type || "Category",
            item_category2: productData?.category_info?.parent_category_name ? (productData?.category?.name || type || "Category") : undefined,
            item_variant: "",
            quantity: 1,
          }]
        }
      });

      setAddedItemDetails({
        title: cartItem.title,
        image: cartItem.image,
        price: cartItem.price,
        originalPrice: cartItem.originalPrice,
      });
      setShowSuccessModal(true);
    }
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

    const compareTitle = productData?.name || title;
    const compareBrand = productData?.brand?.name || brand;
    const compareBrandLogo = productData?.brand?.logo || brandLogo;
    const compareImage = productData?.thumbnail_image || image;
    const comparePrice = productData?.main_price || price;
    const compareOriginalPrice = productData?.stroked_price || originalPrice;
    const compareDiscountPercent = productData?.discount || discountPercent;
    const compareCategory = productData?.category_info?.category_name || productData?.category?.name || category;
    const compareType = productData?.category?.name || type;
    const compareRating = productData?.rating ?? rating;
    const compareRatingCount = productData?.rating_count?.toString() || ratingCount;

    // Calculate savings
    const parsePrice = (priceStr?: string | number | null) => {
      if (priceStr === null || priceStr === undefined) return 0;
      const normalized = String(priceStr).replace(/[^\d.]/g, '');
      return parseFloat(normalized) || 0;
    };
    const main = parsePrice(comparePrice);
    const stroked = parsePrice(compareOriginalPrice);
    const savings = Math.max(0, stroked - main);
    const compareSaveAmount = savings > 0 ? `Save : ৳ ${savings.toLocaleString('en-US')}` : saveAmount;

    dispatch(
      toggleCompare({
        id: wishlistItemId,
        slug: productSlug,
        title: compareTitle,
        brand: compareBrand,
        brandLogo: compareBrandLogo,
        image: compareImage,
        price: comparePrice,
        originalPrice: compareOriginalPrice,
        discountPercent: compareDiscountPercent,
        saveAmount: compareSaveAmount,
        category: compareCategory,
        type: compareType,
        weight: productData?.weight ? String(productData.weight) : weight,
        color: color,
        rating: compareRating,
        ratingCount: compareRatingCount,
      })
    );

    if (!isCompared) {
      dispatch(
        showToast({
          message: "Added to Compare!",
          type: "success",
          productName: compareTitle,
          productImage: compareImage,
          productPrice: comparePrice,
          actionLabel: "View Compare",
          actionLink: "/compare",
        })
      );
    } else {
      dispatch(
        showToast({
          message: "Removed from Compare!",
          type: "success",
          productName: compareTitle,
          productImage: compareImage,
          productPrice: comparePrice,
        })
      );
    }
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

  if (cardVariant === "auction") {
    const isUpcoming = timeLeft.isUpcoming;
    const isEnded = timeLeft.hasEnded;

    const statusLabel = isEnded
      ? "Closed"
      : isUpcoming
      ? "Upcoming"
      : "Live Bid";

    const badgeBg = isEnded
      ? "bg-slate-500"
      : isUpcoming
      ? "bg-amber-500"
      : "bg-emerald-600";

    const displayPrice = highestBid && highestBid > 0 ? highestBid : (startingBid || 0);
    const priceLabel = highestBid && highestBid > 0 ? "Highest Bid" : "Starting Bid";

    const padZero = (n: number) => String(n).padStart(2, "0");

    return (
      <article className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between min-h-[460px]">
        {/* Wishlist on Hover */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button type="button" onClick={handleToggleWishlist} aria-label="Toggle wishlist" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaHeart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-gray-600"}`} />
          </button>
        </div>

        {/* Live / Status Badge */}
        <span className={`absolute left-0 top-0 rounded-br-2xl rounded-tl-2xl px-4 py-1 text-xs font-semibold text-white tracking-wide uppercase ${badgeBg}`}>
          {statusLabel}
        </span>

        <div className="pt-6 flex flex-col flex-1">
          {/* Brand Logo */}
          <div className="mb-3 flex justify-center">
            {brandLogo ? (
              <Image src={brandLogo} alt={brand || "Brand logo"} width={100} height={25} className="h-5 w-auto object-contain" />
            ) : (
              <span className="text-xs font-bold uppercase tracking-wide text-slate-800">{brand}</span>
            )}
          </div>

          {/* Product Image */}
          <Link href={`/bidding/${productSlug}`} className="mb-4 flex items-center justify-center rounded-md h-[180px] overflow-hidden">
            <Image src={image || "/images/wm2.png"} alt={title} width={200} height={180} className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
          </Link>

          {/* Product Title */}
          <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-semibold leading-6 text-slate-900 mb-2">
            <Link href={`/bidding/${productSlug}`} className="hover:text-[#2B7FE8] transition-colors">{title}</Link>
          </h3>

          {/* Countdown timer */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 text-center">
              {isEnded ? "Auction Status" : isUpcoming ? "Auction Starts In" : "Time Remaining"}
            </p>
            {isEnded ? (
              <div className="rounded-xl bg-slate-100 py-2.5 text-center text-sm font-semibold text-slate-600 border border-slate-200">
                Auction Ended
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1 text-center text-[#2B7FE8]">
                <div className="bg-blue-50/50 rounded-lg p-1 border border-blue-100">
                  <div className="text-[16px] font-bold leading-none">{padZero(timeLeft.days)}</div>
                  <p className="text-[9px] text-slate-500 mt-0.5">Days</p>
                </div>
                <div className="bg-blue-50/50 rounded-lg p-1 border border-blue-100">
                  <div className="text-[16px] font-bold leading-none">{padZero(timeLeft.hours)}</div>
                  <p className="text-[9px] text-slate-500 mt-0.5">Hours</p>
                </div>
                <div className="bg-blue-50/50 rounded-lg p-1 border border-blue-100">
                  <div className="text-[16px] font-bold leading-none">{padZero(timeLeft.minutes)}</div>
                  <p className="text-[9px] text-slate-500 mt-0.5">Mins</p>
                </div>
                <div className="bg-blue-50/50 rounded-lg p-1 border border-blue-100">
                  <div className="text-[16px] font-bold leading-none">{padZero(timeLeft.seconds)}</div>
                  <p className="text-[9px] text-slate-500 mt-0.5">Secs</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price & Bids stats */}
        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1.5">
              <FaGavel className="h-3.5 w-3.5 text-slate-400" />
              Bids: <strong className="text-slate-800 font-semibold">{totalBids || 0}</strong>
            </span>
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              {priceLabel}
            </span>
          </div>

          <div className="text-lg font-bold text-slate-900 mb-3 flex items-baseline gap-1">
            <span className="text-sm font-medium">৳</span>
            <span>{displayPrice.toLocaleString('en-US')}</span>
          </div>

          {userBidAmount && (
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-3">
              <span className="text-slate-500">Your Bid:</span>
              <span className="text-slate-800">৳ {userBidAmount.toLocaleString()}</span>
              {highestBid && userBidAmount >= highestBid ? (
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] font-bold">Winning</span>
              ) : (
                <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[9px] font-bold">Outbid</span>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          {isEnded ? (
            <button
              type="button"
              disabled
              className="w-full rounded-xl bg-red-100 py-2.5 text-[14px] font-semibold text-red-500 cursor-not-allowed border border-red-200"
            >
              Bid Closed
            </button>
          ) : (
            <Link
              href={`/bidding/${productSlug}`}
              className="block w-full text-center rounded-xl bg-[#2B7FE8] py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#1a66c4] hover:shadow-md shadow-sm"
            >
              Place Bid
            </Link>
          )}
        </div>
      </article>
    );
  }

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

          <Link href={productHref} onClick={handleSelectItem} className="mb-2 flex items-center justify-center rounded-md" style={{ height: dealImageHeight }}>
            <Image src={image} alt={title} width={230} height={150} style={{ height: dealImageHeight }} className="w-auto object-contain" />
          </Link>

          <Link href={productHref} onClick={handleSelectItem} className="mx-auto mb-4 block text-xs text-slate-500 underline">
            {quickDetailsLabel}
          </Link>

          <h3 className="line-clamp-2 min-h-[56px] text-[18px] font-medium leading-7 text-slate-900">
            <Link href={productHref} onClick={handleSelectItem}>{title}</Link>
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
        <CartSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          productName={addedItemDetails?.title || title}
          productImage={addedItemDetails?.image || image}
          productPrice={addedItemDetails?.price || price}
          productOriginalPrice={addedItemDetails?.originalPrice || originalPrice}
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

          <Link href={productHref} onClick={handleSelectItem} className="mb-2 flex items-center justify-center rounded-md" style={{ height: dealImageHeight }}>
            <Image src={image} alt={title} width={380} height={260} style={{ height: dealImageHeight }} className="w-auto object-contain" />
          </Link>

          <Link href={productHref} onClick={handleSelectItem} className="mx-auto mb-3 block text-xs text-slate-500 underline opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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

          <h3 className="mt-3 line-clamp-2 min-h-[56px] text-[14px] lg:text-[18px] font-medium leading-7 text-slate-900">
            <Link href={productHref} onClick={handleSelectItem}>{title}</Link>
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
        <CartSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          productName={addedItemDetails?.title || title}
          productImage={addedItemDetails?.image || image}
          productPrice={addedItemDetails?.price || price}
          productOriginalPrice={addedItemDetails?.originalPrice || originalPrice}
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
          <Link href={productHref} onClick={handleSelectItem}>
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="hover:underline"
          >
            Quick Look
          </button>
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

        <h3 className="line-clamp-2 h-[32px] mb-2 overflow-hidden px-2 text-[12px] font-semibold leading-4 sm:h-[48px] sm:leading-6 sm:px-4 sm:pb-1 sm:text-[16px] sm:font-medium">
          <Link href={productHref} onClick={handleSelectItem}>{title}</Link>
        </h3>

        <div className="flex items-end gap-2 px-2 pb-3 sm:px-4">
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
        <CartSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          productName={addedItemDetails?.title || title}
          productImage={addedItemDetails?.image || image}
          productPrice={addedItemDetails?.price || price}
          productOriginalPrice={addedItemDetails?.originalPrice || originalPrice}
        />
      </article>
    );
  }

  return (
    <div className="group/card relative w-full max-w-full overflow-hidden rounded-2xl border-2 border-sky-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[340px] sm:min-h-[400px]">
      
      {/* Top half with light background */}
      <div className="relative w-full p-2 sm:p-3 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[265px]">
        {/* Top Left Badges: Discount percentage & NEW/Status Badges stacked */}
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1 sm:gap-1.5 items-start">
          {hasDiscount(productData?.discount || discountPercent, productData?.main_price || price, productData?.stroked_price || originalPrice) && (
            <span className="bg-[#2563eb] text-white px-2 py-0.5 sm:px-4 sm:py-1 rounded-2xl text-[10px] sm:text-[14px] font-semibold tracking-wide">
              {productData?.discount || discountPercent}
            </span>
          )}
          {displayBadgeLabel && (
            <span className={`${
              displayBadgeLabel.toLowerCase() === "new" ? "bg-black" :
              displayBadgeLabel.toLowerCase() === "hot" ? "bg-[#e53e3e]" :
              displayBadgeLabel.toLowerCase() === "top rated" ? "bg-[#dd6b20]" :
              "bg-black"
            } text-white px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-2xl text-[8px] sm:text-[12px] font-semibold tracking-wide uppercase`}>
              {displayBadgeLabel}
            </span>
          )}
        </div>

        {/* Top Right Actions: Shopping Cart, Heart, Compare stacked */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity duration-300">
          <button 
            type="button" 
            onClick={handleToggleWishlist} 
            aria-label="Toggle wishlist" 
            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#EDF2FB] shadow-sm border border-gray-100 transition-colors"
          >
            <FaHeart className={`h-3 w-3 sm:h-4 sm:w-4 ${isWishlisted ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-gray-600"}`} />
          </button>
          <button 
            type="button" 
            onClick={handleToggleCompare} 
            aria-label="Toggle compare" 
            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#EDF2FB] shadow-sm border border-gray-100 transition-colors"
          >
            <BiGitCompare className={`h-3 w-3 sm:h-4 sm:w-4 ${isCompared ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`} />
          </button>
        </div>

        {/* Top Center Brand name/logo */}
        <div className="mt-1 flex justify-center">
          {(productData?.brand?.logo || brandLogo) ? (
            <Image
              src={productData?.brand?.logo || brandLogo || ""}
              alt={productData?.brand?.name || brand || "Brand logo"}
              width={100}
              height={24}
              className="h-6 sm:h-10 w-auto object-contain"
            />
          ) : (
            <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-slate-800 uppercase">
              {productData?.brand?.name || brand}
            </span>
          )}
        </div>

        {/* Centered Product Image */}
        <div className="relative w-full h-28 sm:h-64 flex items-center justify-center p-1">
          <Link href={productHref} onClick={handleSelectItem} className="block hover:scale-[1.02] transition-transform duration-200">
            <Image
              src={productData?.thumbnail_image || image || ""}
              alt={title}
              width={220}
              height={180}
              className="h-[100px] w-[100px] sm:h-[220px] sm:w-[220px] object-contain"
            />
          </Link>
        </div>

        {/* Quick View Bar */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-0 left-0 right-0 bg-[#e7ebf1] hover:bg-[#dce2ec] text-slate-800 font-semibold py-1 sm:py-1.5 text-center text-xs sm:text-sm tracking-wide transition-colors"
        >
          Quick View
        </button>
      </div>

      {/* Model & EMI below Quick View on Mobile */}
      <div className="flex sm:hidden items-center justify-center gap-1.5 text-[8px] xs:text-[9px] text-gray-500 border-b border-gray-100 py-1.5 px-2 bg-gray-50/70 w-full text-center">
        <span className="truncate">Model: {productData?.model_number || "N/A"}</span>
        <span className="text-gray-300">|</span>
        <span className="truncate">
          EMI Starts From <span className="font-semibold text-blue-600">৳{productData?.emi_start || "N/A"}</span>
        </span>
      </div>

      {/* Bottom half with white background */}
      <div className="w-full bg-white p-2  pb-0 flex flex-col justify-between flex-1 relative">
        <div>
          {/* Category */}
          <p className="text-[10px] sm:text-[14px] font-semibold text-gray-400 text-center uppercase tracking-wider mb-0.5 sm:mb-1 mt-0.5 sm:mt-1">
            {productData?.category_info?.category_name || productData?.category?.name || category || type || "Category"}
          </p>

          {/* Title */}
          <h3 className="line-clamp-2 text-center text-[12px] sm:text-[14px] font-medium text-gray-700 leading-tight mb-1.5 sm:mb-2 tracking-tight min-h-[28px] sm:min-h-[32px] px-1 sm:px-2">
            <Link href={productHref} onClick={handleSelectItem} className="hover:text-[#2563eb] transition-colors">
              {productData?.name || title}
            </Link>
          </h3>

          {/* Price Center */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-[11px] sm:text-[18px] font-medium text-[#000000]">
              BDT.
            </span>

            <span className="text-[16px] sm:text-[26px] font-bold text-[#2563eb]">
              {(() => {
                const pr = productData?.main_price || price;
                if (!pr) return "";
                const clean = String(pr).replace(/[^\d]/g, "");
                return Number(clean).toLocaleString("en-US");
              })()}
            </span>

            {hasDiscount(
              productData?.discount || discountPercent,
              productData?.main_price || price,
              productData?.stroked_price || originalPrice
            ) && (
              <span className="text-[11px] sm:text-[18px] text-gray-400 line-through">
                {(() => {
                  const pr = productData?.stroked_price || originalPrice;
                  if (!pr) return "";
                  const clean = String(pr).replace(/[^\d]/g, "");
                  return Number(clean).toLocaleString("en-US");
                })()}
              </span>
            )}
          </div>
        </div>

        {/* Divider and Sliding Action Area */}
        <div className="mt-auto">
          {/* Desktop divider */}
          <div className="hidden sm:block border-t border-gray-100 "></div>
          
          {/* Desktop Hover Sliding Area */}
          <div className="hidden sm:flex relative overflow-hidden h-[44px] w-[calc(100%+24px)] -mx-3 items-center">
            {/* Default State: Model & EMI */}
            <div className="flex items-center justify-between text-[11px] text-black w-full transition-all duration-300 ease-in-out group-hover/card:-translate-y-full group-hover/card:opacity-0 px-3 pb-1">
              <span>Model: {productData?.model_number || "N/A"}</span>
              <span>
                EMI Starts From <span className="font-semibold text-blue-600">৳{productData?.emi_start || "N/A"}</span>
              </span>
            </div>

            {/* Hover State: Add to Cart Button */}
            <div className="absolute inset-0 opacity-0 translate-y-full transition-all duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex w-full h-full items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[14px] transition-colors"
              >
                <FaShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Mobile Always-Visible Add to Cart Button */}
          <div className="block sm:hidden w-[calc(100%+16px)] -mx-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[12px] py-2 transition-colors"
            >
              <FaShoppingCart className="h-3 w-3" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productData={productData}
        title={title} brand={brand} price={price} originalPrice={originalPrice}
        image={image} category={category} discountLabel={discountPercent}
        saveLabel={saveAmount} weight={weight} color={color} slug={slug}
      />
      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={addedItemDetails?.title || title}
        productImage={addedItemDetails?.image || image}
        productPrice={addedItemDetails?.price || price}
        productOriginalPrice={addedItemDetails?.originalPrice || originalPrice}
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