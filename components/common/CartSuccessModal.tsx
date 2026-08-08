"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";

interface CartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  productPrice: string | number;
  productOriginalPrice?: string | number;
}

export default function CartSuccessModal({
  isOpen,
  onClose,
  productName,
  productImage,
  productPrice,
  productOriginalPrice,
}: CartSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10  p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[450px] rounded-md bg-white px-6 py-8 shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <FaRegCheckCircle className="h-12 w-12 text-[#15b259] mb-2" />
          <h2 className="text-[22px] font-normal text-[#15b259]">
            Item added to your cart!
          </h2>
        </div>

        <div className="flex items-center gap-6 mb-8 px-4">
          <div className="relative h-20 w-16 flex-shrink-0">
            <Image
              src={productImage || "/images/wm2.png"}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-3">
              {productName}
            </h3>
            <p className="text-[13px] text-slate-500 flex items-center flex-wrap">
              Price: <span className="ml-4 font-bold text-[#1a56db] text-base">{productPrice}</span>
              {productOriginalPrice && String(productOriginalPrice).trim() !== "" && (
                <span className="ml-2 text-xs text-slate-400 line-through">
                  {productOriginalPrice}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded border border-[#1a56db] bg-white px-5 py-2 text-[14px] text-[#1a56db] transition-colors hover:bg-slate-50"
          >
            Back to shopping
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/cart");
            }}
            className="rounded bg-[#1a56db] px-8 py-2 text-[14px] text-white transition-colors hover:bg-blue-700"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
