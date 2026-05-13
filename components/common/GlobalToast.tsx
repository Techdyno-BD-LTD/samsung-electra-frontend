"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegCheckCircle, FaTimes, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideToast } from "@/store/features/toast/toastSlice";

export default function GlobalToast() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOpen, message, type, productName, productImage, productPrice, actionLabel, actionLink } = useAppSelector((state) => state.toast);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error': return <FaExclamationCircle className="h-12 w-12 text-red-500 mb-2" />;
      case 'info': return <FaInfoCircle className="h-12 w-12 text-blue-500 mb-2" />;
      default: return <FaRegCheckCircle className="h-12 w-12 text-[#15b259] mb-2" />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'info': return 'text-blue-500';
      default: return 'text-[#15b259]';
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[450px] rounded-md bg-white px-6 py-8 shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        <button
          onClick={() => dispatch(hideToast())}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          {getIcon()}
          <h2 className={`text-[22px] font-normal ${getTitleColor()}`}>
            {message}
          </h2>
        </div>

        {productName && (
          <div className="flex items-center gap-6 mb-8 px-4">
            <div className="relative h-20 w-16 flex-shrink-0">
              <Image
                src={typeof productImage === 'string' && (productImage.startsWith('/') || productImage.startsWith('http')) ? productImage : "/images/wm2.png"}
                alt={productName}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-3">
                {productName}
              </h3>
              {productPrice && (
                <p className="text-[13px] text-slate-500 flex items-center">
                  Price: <span className="ml-4 font-bold text-[#1a56db] text-base">{productPrice}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={() => dispatch(hideToast())}
            className="rounded border border-[#1a56db] bg-white px-5 py-2 text-[14px] text-[#1a56db] transition-colors hover:bg-slate-50"
          >
            Close
          </button>
          {actionLabel && actionLink && (
            <button
              onClick={() => {
                dispatch(hideToast());
                router.push(actionLink);
              }}
              className="rounded bg-[#1a56db] px-8 py-2 text-[14px] text-white transition-colors hover:bg-blue-700"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
