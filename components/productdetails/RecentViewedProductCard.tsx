"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import { toProductSlug } from "@/lib/productSlug";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToWishlistAsync, removeFromWishlistAsync, WishlistItem } from "@/store/features/wishlist/wishlistSlice";
import { toggleCompare } from "@/store/features/compare/compareSlice";
import { useRouter } from "next/navigation";
import { showToast } from "@/store/features/toast/toastSlice";
import AddToCartModal from "@/components/common/AddToCartModal";

type RecentViewedProduct = {
  title?: string;
  image?: string;
  brandLogo?: string;
  type?: string;
  rating?: number;
  ratingCount?: string;
  weight?: string;
  color?: string;
  emiPrice?: string;
  price?: string;
  originalPrice?: string;
  discountPercent?: string;
  saveAmount?: string;
  tags?: string[];
  id?: string | number;
};

type RecentViewedProductCardProps = {
  product: RecentViewedProduct;
};

export default function RecentViewedProductCard({ product }: RecentViewedProductCardProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productSlug = toProductSlug(product.title ?? "product");
  const productHref = `/products/${productSlug}`;
  const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.id === productSlug));
  const isCompared = useAppSelector((state) => state.compare.slots.some((slot) => slot?.id === productSlug));

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productSlug));
    } else {
      const item: WishlistItem = {
        id: productSlug,
        productId: Number(product.id || 0),
        title: product.title ?? "Product",
        brand: product.brandLogo ? "Brand" : "",
        image: product.image ?? "/images/wm2.png",
        price: product.price ?? "0",
        originalPrice: product.originalPrice,
        discountLabel: product.discountPercent,
        saveAmount: product.saveAmount,
        color: product.color,
        type: product.type,
        weight: product.weight,
        rating: product.rating,
        ratingCount: product.ratingCount,
        brandLogo: product.brandLogo,
        emiPrice: product.emiPrice,
        tags: product.tags,
      };
      dispatch(addToWishlistAsync(item)).then((result) => {
        if (addToWishlistAsync.fulfilled.match(result)) {
          dispatch(showToast({
            message: "Added to Wishlist!",
            type: 'success',
            productName: item.title,
            productImage: item.image,
            productPrice: String(item.price),
            actionLabel: "View Wishlist",
            actionLink: "/dashboard/wishlist"
          }));
        }
      });
    }
  };

  const handleToggleCompare = () => {
    dispatch(
      toggleCompare({
        id: productSlug,
        slug: productSlug,
        title: product.title ?? "Product",
        brand: product.brandLogo ? "Brand" : "",
        brandLogo: product.brandLogo,
        image: product.image ?? "/images/wm2.png",
        price: product.price ?? "৳ 1,50,000",
        originalPrice: product.originalPrice ?? "৳ 1,80,000",
        discountPercent: product.discountPercent ?? "-10% Off",
        saveAmount: product.saveAmount ?? "Save : ৳30,00",
        category: "",
        type: product.type,
        weight: product.weight,
        color: product.color,
        rating: product.rating,
        ratingCount: product.ratingCount,
      })
    );
  };

  return (
    <>
      <article className="grid grid-cols-[minmax(150px,38%)_minmax(0,1fr)] gap-2 rounded-[10px] xl:grid-cols-[minmax(170px,40%)_minmax(0,1fr)] 2xl:grid-cols-[200px_1fr]">
        <div className="relative overflow-hidden rounded-[8px] border border-slate-300 bg-white">
          <span className="absolute left-0 top-0 rounded-br-[16px] bg-[#1976D2] px-4 py-1 text-xs font-medium text-white xl:rounded-br-[18px] xl:px-6 xl:text-sm">
            Sale
          </span>
          <span className="absolute right-2 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1296F3] text-center text-[11px] font-semibold leading-tight text-white shadow-sm xl:right-3 xl:top-7 xl:h-11 xl:w-11 xl:text-xs">
            36
            <br />
            EMI
          </span>

          <div className="mb-1.5 mt-6 flex justify-center xl:mb-2 xl:mt-7">
            <Image
              src={product.brandLogo || "/images/electra.png"}
              alt="Brand"
              width={76}
              height={20}
              className="h-4 w-auto object-contain xl:h-5"
            />
          </div>

          <Link href={productHref} className="block">
            <Image
              src={product.image || "/images/wm2.png"}
              alt={product.title || "Product"}
              width={236}
              height={132}
              className="mx-auto h-[102px] w-full object-contain px-1 xl:h-[116px] 2xl:h-[132px]"
            />
          </Link>
        </div>

        <div className="min-w-0 pt-0.5">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 xl:gap-x-2.5">
            <p className="text-[11px] leading-none text-slate-500 xl:text-[12px]">{product.type || "Front Loading"}</p>
            <div className="flex items-center gap-0.5 text-[#FFA11C]">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} className="h-2 w-2" />
              ))}
              <span className="text-[11px] leading-none text-[#0E5AAA] xl:text-[12px]">{product.ratingCount || "(3.0)"}</span>
            </div>

            <span className="text-[11px] font-semibold leading-none text-[#0E5AAA] xl:text-[12px]">{product.weight || "85KG"} | {product.color || "White"}</span>
          </div>

          <Link href={productHref} className="mb-2 line-clamp-2 text-[13px] font-semibold leading-[1.25] text-slate-900 xl:text-[14px]">
            {product.title || "Samsung 85\" Neo QLED 8K Tizen OS Smart TV - QA85QN900DRSER"}
          </Link>

          <p className="mb-2.5 mt-1.5 flex items-center gap-1.5 text-[10px] leading-none text-slate-600 xl:gap-2">
            <Image src="/images/EMI.png" alt="EMI" width={16} height={16} className="h-3 w-3 object-contain" />
            {product.emiPrice || "EMI From 14330 Tk/Month"}
          </p>

          <div className="mb-2.5 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 xl:mb-3 xl:gap-x-3">
            <span className="text-[14px] font-semibold leading-none text-[#0C73DA] xl:text-[16px]">{product.price || "৳ 1,50,000"}</span>
            <span className="text-[10px] leading-none text-slate-400 line-through">{product.originalPrice || "৳ 1,80,000"}</span>
            <span className="text-[10px] leading-none  text-[#F03A34]">{product.discountPercent || "-10% Off"}</span>
            <span className="rounded-tl-3xl rounded-br-3xl bg-[#F03A34] px-2 py-1 text-[10px] font-semibold leading-none text-white xl:px-3">{product.saveAmount || "Save : ৳30,00"}</span>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 xl:gap-2">
            {(product.tags || ["Cash On Delivery", "0% EMI", "Free Delivery"]).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-[#E7EFF9] px-2.5 py-1 text-[10px] leading-none text-[#0E5AAA] xl:px-4">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 xl:gap-2">
            <button type="button" onClick={handleAddToCart} className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#0054A6] px-2.5 py-2 text-[13px] font-semibold leading-none text-white xl:gap-2 xl:px-4 xl:text-[14px]">
              <FaShoppingCart className="h-4 w-4" />
              <span className="truncate">Add to cart</span>
            </button>
            <button type="button" onClick={handleToggleWishlist} className="rounded-[8px] bg-slate-100 p-2 xl:p-2.5" aria-label="Toggle wishlist">
              <FaHeart className={`h-4 w-4 xl:h-5 xl:w-5 ${isWishlisted ? "text-red-500" : "text-slate-700"}`} />
            </button>
            <button type="button" onClick={handleToggleCompare} className="rounded-[8px] bg-slate-100 p-2 xl:p-2.5" aria-label="Toggle compare">
              <HiOutlineArrowsRightLeft className={`h-4 w-4 xl:h-5 xl:w-5 ${isCompared ? "text-[#2b7fe8]" : "text-slate-700"}`} />
            </button>
          </div>
        </div>
      </article>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slug={productSlug}
        title={product.title}
        price={product.price}
        originalPrice={product.originalPrice}
        image={product.image}
        category={product.type}
        discountLabel={product.discountPercent}
        saveLabel={product.saveAmount}
        weight={product.weight}
        color={product.color}
      />
    </>
  );
}
