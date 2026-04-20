"use client";

import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function MobileBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1 text-[13px] font-medium text-slate-600 hover:text-slate-900"
    >
      <FaChevronLeft className="h-3 w-3" />
      Back
    </button>
  );
}
