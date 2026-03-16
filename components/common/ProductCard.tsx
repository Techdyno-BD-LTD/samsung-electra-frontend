import { FaHeart, FaBalanceScale, FaShoppingCart, FaStar } from "react-icons/fa";
import Image from "next/image";

interface ProductCardProps {
  brand?: string;
  brandLogo?: string;
  title?: string;
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
}

const ProductCard = ({
  brand = "",
  brandLogo = "",
  title = "",
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
}: ProductCardProps) => {
  const badgeLabel = statusBadge.trim() || (isSale ? "Sale" : "");
  const normalizedBadgeLabel = badgeLabel.toLowerCase();
  const badgeClassName =
    normalizedBadgeLabel === "sale"
      ? "bg-red-600"
      : normalizedBadgeLabel === "new"
      ? "bg-emerald-600"
      : normalizedBadgeLabel === "hot"
      ? "bg-orange-500"
      : normalizedBadgeLabel === "sold out"
      ? "bg-slate-600"
      : normalizedBadgeLabel === "special"
      ? "bg-blue-600"
      : "bg-red-600";
  
  // Refined Star Renderer: Smaller (h-3) and Orange (orange-400)
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(count)
                ? "fill-orange-400 text-orange-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isBestSeller) {
    return (
      <article className="group relative w-full max-w-full overflow-hidden rounded-t-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
        {emiPercent && (
          <div
            className="absolute right-2 top-8 z-20 flex h-10 w-10 items-center justify-center bg-[#0081FF] p-1 text-center text-[9px] font-semibold leading-tight text-white sm:right-4 sm:top-14 sm:h-[64px] sm:w-[64px] sm:p-2 sm:text-[14px]"
            style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
          >
            {emiPercent} EMI
          </div>
        )}

        {badgeLabel && (
          <span className={`absolute left-0 top-0 z-10 rounded-br-2xl px-2 py-1 text-[10px] font-semibold text-white sm:px-4 sm:py-1.5 sm:text-xs ${badgeClassName}`}>
            {badgeLabel}
          </span>
        )}

        <div className="absolute right-3 top-3 z-10 hidden flex-row gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaHeart className="h-4 w-4 text-gray-600" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-md transition-colors hover:bg-gray-100">
            <FaBalanceScale className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center pb-1 pt-4 sm:pb-2 sm:pt-6">
          {brandLogo ? (
            <Image
              src={brandLogo}
              alt={brand || "Brand logo"}
              width={140}
              height={36}
              className="h-5 w-auto object-contain sm:h-9"
            />
          ) : (
            <span className="text-sm font-bold uppercase tracking-wide text-foreground sm:text-lg">
              {brand}
            </span>
          )}
        </div>

        <div className="relative mx-auto flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2">
          <Image
            src={image}
            alt={title}
            width={300}
            height={180}
            className="h-[96px] w-auto object-contain sm:h-[200px]"
          />

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

        <p className="pb-2 text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:pb-3 sm:text-[10px] sm:tracking-wider">
          Quick Look
        </p>

        <div className="flex items-start justify-between px-2 pb-1.5 sm:items-center sm:px-4 sm:pb-2">
          <div className="min-w-0 flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] font-medium text-gray-500 sm:text-xs">{type}</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="flex items-center gap-0.5 sm:hidden">
                <FaStar className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span className="text-[9px] font-medium text-[#0054A6]">{rating.toFixed(1)}</span>
              </div>
              <div className="hidden items-center gap-0.5 sm:flex">
                {renderStars(rating)}
                <span className="text-[10px] font-medium text-[#0054A6]">{ratingCount}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 sm:text-xs">
            {weight} | {color}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[36px] px-2 pb-1 text-[12px] font-semibold leading-4 sm:min-h-[40px] sm:px-4 sm:text-[16px] sm:font-medium sm:leading-relaxed">
          {title}
        </h3>

        <div className="flex items-end gap-2 px-2 pb-2 sm:px-4">
          <span className="text-[17px] font-bold text-[#0AB15A]">{price}</span>
          <span className="text-[12px] text-slate-400 line-through">{originalPrice}</span>
        </div>

        <div className="px-2 pb-1 sm:px-4">
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-1.5 w-[25.6%] rounded-full bg-[#2B7FE8]" />
          </div>
        </div>

        <div className="flex items-center justify-between px-2 pb-3 text-[11px] sm:px-4">
          <span className="text-slate-500">Sold : 25 / 36</span>
          <span className="font-semibold text-[#0AB15A]">25.60%</span>
        </div>

        <div className="px-2 pb-3 sm:hidden">
          <button className="flex mx-auto w-6/12 items-center justify-center rounded-full bg-[#0054A6] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#004487]">
            Buy Now
          </button>
        </div>

        <div className="hidden max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-[60px] sm:block">
          <div className="px-4 pb-4 pt-1">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E7EEF6] py-2.5 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-200">
              <FaShoppingCart className="h-4 w-4" />
              Add to cart
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="group relative w-full max-w-full overflow-hidden rounded-t-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
      {/* EMI Badge */}
      {emiPercent && (
        <div
          className="absolute top-8 right-2 z-20 flex h-10 w-10 items-center justify-center bg-[#0081FF] p-1 text-center text-[9px] font-semibold leading-tight text-white sm:top-14 sm:right-4 sm:h-[64px] sm:w-[64px] sm:p-2 sm:text-[14px]"
          style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
        >
          {emiPercent} EMI
        </div>
      )}

      {/* Primary Product Badge (Sale/New/Hot/Sold Out/Special) */}
      {badgeLabel && (
        <span className={`absolute top-0 left-0 z-10 rounded-br-2xl px-2 py-1 text-[10px] font-semibold text-white sm:px-4 sm:py-1.5 sm:text-xs ${badgeClassName}`}>
          {badgeLabel}
        </span>
      )}

      {/* Hover Action Buttons */}
      <div
        className="absolute right-3 top-3 z-10 hidden flex-row gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex"
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaHeart className="h-4 w-4 text-gray-600" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaBalanceScale className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Brand Header */}
      <div className="flex justify-center pt-4 pb-1 sm:pt-6 sm:pb-2">
        {brandLogo ? (
          <Image
            src={brandLogo}
            alt={brand || "Brand logo"}
            width={140}
            height={36}
            className="h-5 w-auto object-contain sm:h-9"
          />
        ) : (
          <span className="text-sm font-bold tracking-wide text-foreground uppercase sm:text-lg">
            {brand}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative mx-auto flex items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2">
        <Image
          src={image}
          alt={title}
          width={300}
          height={180}
          className="h-[96px] w-auto object-contain sm:h-[200px]"
        />

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

      <p className="pb-2 text-center text-[9px] uppercase tracking-wide text-muted-foreground sm:pb-3 sm:text-[10px] sm:tracking-wider">
        Quick Look
      </p>

      {/* Type and Rating Section (Stars are now close to the type) */}
      <div className="flex items-start justify-between px-2 pb-1.5 sm:items-center sm:px-4 sm:pb-2">
        <div className="min-w-0 flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] font-medium text-gray-500 sm:text-xs">{type}</span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="flex items-center gap-0.5 sm:hidden">
              <FaStar className="h-3 w-3 fill-orange-400 text-orange-400" />
              <span className="text-[9px] font-medium text-[#0054A6]">{rating.toFixed(1)}</span>
            </div>
            <div className="hidden items-center gap-0.5 sm:flex">
              {renderStars(rating)}
              <span className="text-[10px] font-medium text-[#0054A6]">{ratingCount}</span>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 sm:text-xs">
          {weight} | {color}
        </span>
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 min-h-[36px] px-2 pb-1 text-[12px] font-semibold leading-4 sm:min-h-[40px] sm:px-4 sm:text-[16px] sm:font-medium sm:leading-relaxed">
        {title}
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
      {emiPrice} |
    </span>
  </span>
  <button className="shrink-0 text-[10px] font-semibold text-blue-600 hover:underline sm:text-xs">
    EMI Details
  </button>
</div>

      {/* Pricing */}
      <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2 sm:gap-2 sm:px-4">
        <span className="text-[20px] font-bold text-[#0081FF] sm:text-[17px]">{price}</span>
        <span className="text-[11px] text-[#909090] line-through sm:text-[13px]">
          {originalPrice}
        </span>
        <span className="text-[10px] font-semibold text-red-600 sm:text-xs">
          {discountPercent}
        </span>
        {saveAmount && (
        <div className="">
          <span className="inline-block rounded-tl-2xl rounded-br-2xl bg-red-600 px-2 py-0.5 text-[9px] font-medium text-white uppercase sm:px-3 sm:py-1 sm:text-[10px]">
         {saveAmount}
          </span>
        </div>
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

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 px-2 pb-3 sm:gap-2 sm:px-4 sm:pb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#E7EEF6] px-2 py-1 text-[9px] font-semibold text-[#0054A6] sm:px-3 sm:text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="px-2 pb-3 sm:hidden">
        <button className="flex w-6/12 mx-auto items-center justify-center rounded-full bg-[#0054A6] py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#004487]">
          Buy Now
        </button>
      </div>

      {/* Add to Cart - show only on hover */}
      <div className="hidden overflow-hidden max-h-0 transition-all duration-300 ease-in-out group-hover:max-h-[60px] sm:block">
        <div className="px-4 pb-4 pt-1">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E7EEF6] py-2.5 text-sm font-semibold text-blue-500 transition-colors hover:bg-blue-200">
            <FaShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;