"use client";

import { useRouter } from "next/navigation";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";

interface HelpTicketSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpTicketSuccessModal({
  isOpen,
  onClose,
}: HelpTicketSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[450px] rounded-3xl bg-white px-8 py-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out border border-slate-100">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 blur-xl opacity-50"></div>
            <FaRegCheckCircle className="h-20 w-20 text-[#15b259] relative z-10" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Ticket Submitted!
          </h2>
          
          <p className="text-slate-500 mb-8 max-w-[300px]">
            Your help ticket has been successfully submitted. Our team will get back to you shortly.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => {
                onClose();
                router.push("/");
              }}
              className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              Go to Home
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
