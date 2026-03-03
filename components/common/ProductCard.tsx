import { FaHeart, FaBalanceScale, FaShoppingCart, FaStar, FaShieldAlt } from "react-icons/fa";

interface ProductCardProps {
  brand?: string;
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
  emiMonths?: number;
  isSale?: boolean;
  hasWarranty?: boolean;
  tags?: string[];
}

const ProductCard = ({
  brand = "Whirlpool",
  title = "Haier Front Loading Washing Machine - HW90-BP14959S8 | 9KG",
  image = "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=250&fit=crop",
  rating = 3.0,
  ratingCount = "(3.0)",
  type = "Front Loading",
  weight = "85KG",
  color = "White",
  price = "৳ 1,50,000",
  originalPrice = "৳ 1,80,000",
  discountPercent = "-10% Off",
  saveAmount = "Save : ৳30,00%",
  emiPrice = "EMI From 14330 Tk/month",
  emiMonths = 36,
  isSale = true,
  hasWarranty = true,
  tags = ["Cash On Delivery", "0% EMI", "Free Delivery"],
}: ProductCardProps) => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(count)
              ? "fill-accent text-accent"
              : "fill-muted text-muted"
          }`}
        />
    ));
  };

  return (
    <div className="group relative w-full max-w-[340px] rounded-lg border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl overflow-hidden">
      {isSale && (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-sale px-3 py-1 text-xs font-semibold text-sale-foreground">
          Sale
        </span>
      )}

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-md border border-border transition-colors hover:bg-secondary">
          <FaHeart className="h-4 w-4 text-muted-foreground" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-md border border-border transition-colors hover:bg-secondary">
          <FaBalanceScale className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex justify-center pt-4 pb-1">
        <span className="text-sm font-bold tracking-wide text-primary">
          {brand}
        </span>
      </div>

      <div className="relative mx-auto flex items-center justify-center px-6 py-2">
        {emiMonths && (
          <div className="absolute top-0 right-6 z-10 flex h-10 w-10 flex-col items-center justify-center rounded-full bg-emi text-emi-foreground shadow-md">
            <span className="text-xs font-bold leading-none">{emiMonths}</span>
            <span className="text-[9px] leading-none">EMI</span>
          </div>
        )}
        <img
          src={image}
          alt={title}
          className="h-[180px] w-auto object-contain"
        />
      </div>

      {hasWarranty && (
        <div className="flex items-center gap-1.5 px-4 pb-1">
          <FaShieldAlt className="h-5 w-5 text-primary fill-primary/10" />
          <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent">
            Official
          </span>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground pb-1">
        Quick Look
      </p>

      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-xs text-muted-foreground">{type}</span>
        <div className="flex items-center gap-0.5">
          {renderStars(rating)}
          <span className="ml-1 text-xs text-accent">{ratingCount}</span>
        </div>
        <span className="text-xs font-medium text-primary">
          {weight} | {color}
        </span>
      </div>

      <h3 className="px-4 pb-2 text-sm font-semibold leading-tight text-card-foreground line-clamp-2">
        {title}
      </h3>

      <div className="flex items-center gap-2 px-4 pb-2">
        <span className="text-xs text-muted-foreground">💳 {emiPrice}|</span>
        <button className="text-xs font-semibold text-primary hover:underline">
          EMI Details
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-1 flex-wrap">
        <span className="text-xl font-bold text-price">{price}</span>
        <span className="text-sm text-price-old line-through">
          {originalPrice}
        </span>
        <span className="text-xs font-semibold text-discount">
          {discountPercent}
        </span>
      </div>

      {saveAmount && (
        <div className="px-4 pb-3">
          <span className="inline-block rounded-full bg-save/10 px-3 py-0.5 text-xs font-semibold text-save">
            {saveAmount}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="overflow-hidden max-h-0 transition-all duration-300 ease-in-out group-hover:max-h-20">
        <div className="px-4 pb-4 animate-slide-up">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <FaShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
