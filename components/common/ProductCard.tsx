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
}: ProductCardProps) => {
  
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

  return (
    <div className="group relative w-full max-w-[355px] sm:max-w-full rounded-t-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg overflow-hidden">
      {/* EMI Badge */}
      {emiPercent && (
        <div
          className="absolute top-7 right-4 z-20 flex h-[64px] w-[64px] items-center justify-center bg-[#0081FF] p-2 text-center text-[14px] font-semibold leading-tight text-white"
          style={{ clipPath: "polygon(50% 0%, 61% 18%, 80% 8%, 82% 28%, 100% 38%, 84% 50%, 100% 62%, 82% 72%, 80% 92%, 61% 82%, 50% 100%, 39% 82%, 20% 92%, 18% 72%, 0% 62%, 16% 50%, 0% 38%, 18% 28%, 20% 8%, 39% 18%)" }}
        >
          {emiPercent} EMI
        </div>
      )}

      {/* Sale Badge */}
      {isSale && (
        <span className="absolute top-0 left-0 z-10 rounded-br-2xl bg-red-600 px-4 py-1.5 text-xs font-semibold text-white">
          Sale
        </span>
      )}

      {/* Hover Action Buttons */}
      <div
        className={`absolute right-3 z-10 flex flex-row gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
          emiPercent ? "top-20" : "top-3"
        }`}
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaHeart className="h-4 w-4 text-gray-600" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border transition-colors hover:bg-gray-100">
          <FaBalanceScale className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Brand Header */}
      <div className="flex justify-center pt-6 pb-2">
        {brandLogo ? (
          <Image
            src={brandLogo}
            alt={brand || "Brand logo"}
            width={140}
            height={36}
            className="h-9 w-auto object-contain"
          />
        ) : (
          <span className="text-lg font-bold tracking-wide text-foreground uppercase">
            {brand}
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative mx-auto flex items-center justify-center px-3 py-2">
        <Image
          src={image}
          alt={title}
          width={300}
          height={180}
          className="h-[140px] w-auto object-contain"
        />

        {hasWarranty && (
          <div className="absolute -bottom-6 left-5">
            <Image
              src={warrantyBadgeImage}
              alt="Warranty badge"
              width={64}
              height={64}
              className="h-20 w-20 object-contain"
            />
          </div>
        )}
      </div>

      <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground pb-3">
        Quick Look
      </p>

      {/* Type and Rating Section (Stars are now close to the type) */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">{type}</span>
          <div className="flex items-center gap-1">
            {renderStars(rating)}
            <span className="text-[10px] text-[#0054A6] font-medium">
              {ratingCount}
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-600">
          {weight} | {color}
        </span>
      </div>

      {/* Title */}
      <h3 className="px-4 pb-1 text-sm font-medium leading-relaxed  line-clamp-2 min-h-[40px]">
        {title}
      </h3>

      {/* EMI Info */}
     <div className="flex items-center gap-1 px-4 pb-1">
  <span className="flex items-center gap-1 text-xs text-muted-foreground">
    {/* Icon Image Tag */}
    <Image 
      src="/images/EMI.png" // Tomar icon er file path ekhane hobe
      alt="EMI Icon"
      width={14}  // Size tulo-namulok bhabe choto rakha hoyeche text er sathe milate
      height={14}
      className="object-contain"
    />
    {emiPrice} |
  </span>
  <button className="text-xs font-semibold text-blue-600 hover:underline">
    EMI Details
  </button>
</div>

      {/* Pricing */}
      <div className="flex items-center gap-2 px-4 pb-2 flex-wrap">
        <span className="text-[17px] font-bold text-[#0081FF]">{price}</span>
        <span className="text-[13px] text-[#909090] line-through">
          {originalPrice}
        </span>
        <span className="text-xs font-semibold text-red-600">
          {discountPercent}
        </span>
        {saveAmount && (
        <div className="">
          <span className="inline-block rounded-tl-2xl rounded-br-2xl bg-red-600 px-3 py-1 text-[10px] font-medium text-white uppercase">
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
      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#E7EEF6] px-3 py-1 text-[10px] font-semibold text-[#0054A6]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Add to Cart - Slide up effect */}
      <div className="overflow-hidden max-h-0 transition-all duration-300 ease-in-out group-hover:max-h-[60px]">
        <div className="px-4 pb-4">
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