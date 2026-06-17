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
  slug?: string;
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

type RecentViewedProductCardProps = {
  product: RecentViewedProduct;
};

export default function RecentViewedProductCard({ product }: RecentViewedProductCardProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productSlug = product.slug || toProductSlug(product.title ?? "product");
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
      <Link href={productHref} className="grid grid-cols-[110px_1fr] gap-3 rounded-[10px] group transition-transform hover:-translate-y-0.5">
        <div className="relative overflow-hidden rounded-[8px] border border-slate-300 bg-white h-[110px] flex flex-col justify-between py-2">
          <span className="absolute left-0 top-0 rounded-br-[8px] bg-[#1976D2] px-2 py-0.5 text-[9px] font-semibold text-white">
            Sale
          </span>
          <span className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1296F3] text-center text-[8px] font-bold leading-tight text-white shadow-sm">
            36
            <br />
            EMI
          </span>

          <div className="mb-1 mt-3 flex justify-center">
            <Image
              src={product.brandLogo || "/images/electra.png"}
              alt="Brand"
              width={50}
              height={12}
              className="h-3 w-auto object-contain"
            />
          </div>

          <div className="block flex-1 flex items-center justify-center">
            <Image
              src={product.image || "/images/wm2.png"}
              alt={product.title || "Product"}
              width={100}
              height={60}
              className="mx-auto h-[55px] w-auto object-contain px-1"
            />
          </div>
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

          <h4 className="mb-2 line-clamp-2 text-[13px] font-semibold leading-[1.25] text-slate-900 xl:text-[14px] group-hover:text-[#0C73DA] transition-colors">
            {product.title || "Samsung 85\" Neo QLED 8K Tizen OS Smart TV - QA85QN900DRSER"}
          </h4>

          <p className="mb-2.5 mt-1.5 flex items-center gap-1.5 text-[10px] leading-none text-slate-600 xl:gap-2">
            <Image src="/images/EMI.png" alt="EMI" width={16} height={16} className="h-3 w-3 object-contain" />
            {product.emiPrice || "EMI From 14330 Tk/Month"}
          </p>

          <div className="mb-2.5 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 xl:mb-3 xl:gap-x-3">
            <span className="text-[14px] font-semibold leading-none text-[#0C73DA] xl:text-[16px]">{product.price || "৳ 1,50,000"}</span>
            {hasDiscount(product.discountPercent, product.price, product.originalPrice) && (
              <>
                <span className="text-[10px] leading-none text-slate-400 line-through">{product.originalPrice || "৳ 1,80,000"}</span>
                <span className="text-[10px] leading-none  text-[#F03A34]">{product.discountPercent || "-10% Off"}</span>
                <span className="rounded-tl-3xl rounded-br-3xl bg-[#F03A34] px-2 py-1 text-[10px] font-semibold leading-none text-white xl:px-3">{product.saveAmount || "Save : ৳30,00"}</span>
              </>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5 xl:gap-2">
            {(product.tags || ["Cash On Delivery", "0% EMI", "Free Delivery"]).slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-[#E7EFF9] px-2.5 py-1 text-[10px] leading-none text-[#0E5AAA] xl:px-4">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>

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
