import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";

type MobileStickyPurchaseBarProps = {
  productData?: {
    current_stock?: number;
    main_price?: string;
    stroked_price?: string;
    discount?: string;
    emi_start?: string;
    emi_facility?: {
      text?: string;
      link_label?: string | null;
    };
    higher_sale?: boolean;
    down_payment?: number;
    monthly_installment?: number;
  };
  availability?: string;
  price?: string;
  discountLabel?: string;
  originalPrice?: string;
  saveLabel?: string;
  emiText?: string;
  emiDetailsLabel?: string;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onApplyForInstallment?: () => void;
};

export default function MobileStickyPurchaseBar({
  productData,
  availability = (productData?.current_stock ?? 0) > 0 ? "In Stock" : "Out of Stock",
  price = productData?.main_price || "Price",
  discountLabel = productData?.discount || "0% Off",
  originalPrice = productData?.stroked_price || "Price",
  saveLabel = productData?.discount ? `Save ${productData.discount}` : "Save Amount",
  emiText = productData?.emi_start || "EMI Available",
  emiDetailsLabel = productData?.emi_facility?.text || "See details",
  onAddToCart,
  onBuyNow,
  onApplyForInstallment,
}: MobileStickyPurchaseBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-100 bg-white px-3 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] md:hidden">
      <div className="mx-auto w-full max-w-[640px]">

        {/* SECTION 1: Status Row */}
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[13px] font-medium text-[#00619E]">{availability}</span>
          <span className="text-[13px] text-gray-500">Free Delivery</span>
        </div>
        <div className="flex justify-between ">
          {/* SECTION 2: Pricing & Buttons Row */}
          <div className="flex flex-col items-start justify-around ">
            {/* Price & Badge Group */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[22px] font-semibold tracking-tight text-[#0081FF] whitespace-nowrap">
                {price}
              </span>

              {discountLabel && originalPrice && (
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-[10px] font-medium text-[#10B981] whitespace-nowrap">{discountLabel}</span>
                  <span className="text-[10px] text-gray-400 line-through whitespace-nowrap">{originalPrice}</span>
                </div>
              )}

              {/* Red Save Badge */}
              {!productData?.higher_sale && saveLabel && (
                <div className="flex  items-center justify-center rounded-tl-2xl rounded-br-2xl bg-[#FF2D2D] px-1.5 py-0.5 leading-none text-white shrink-0">
                  <span className="text-[7px] font-medium">{saveLabel}</span>
                </div>
              )}
            </div>

            {/* Buttons Group */}
            <div className="flex items-center gap-1.5 shrink-0">
              {productData?.higher_sale ? (
                <button
                  type="button"
                  onClick={onApplyForInstallment}
                  className="h-[34px] rounded-full bg-[#0081FF] px-6 text-[12px] font-medium text-white whitespace-nowrap active:bg-[#006ED9]"
                >
                  Apply for Kisti
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onAddToCart}
                    className="flex h-[34px] items-center justify-center gap-1.5 rounded-full bg-[#F3F4F6] px-4 text-[12px] font-medium text-gray-800"
                  >
                    <FaShoppingCart className="text-[14px] text-gray-600" />
                    <span className="whitespace-nowrap">Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={onBuyNow}
                    className="h-[34px] rounded-full bg-[#0081FF] px-4 text-[12px] font-medium text-white whitespace-nowrap active:bg-[#006ED9]"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>
          </div>

          {/* SECTION 3: EMI Row */}
          {emiText && (
            <div className="mt-2.5 flex flex-col items-end gap-1.5 px-1 text-[11px] text-gray-600">
              <div className="relative h-3.5 w-4">
                <Image
                  src="/images/EMI.png"
                  alt="EMI"
                  fill
                  className="object-contain opacity-80"
                />
              </div>
              <span className="whitespace-nowrap">{emiText}</span>

              <button type="button" className="font-medium text-[#00619E]">
                {emiDetailsLabel}
              </button>
            </div>
          )}

        </div>


      </div>
    </div>
  );
}