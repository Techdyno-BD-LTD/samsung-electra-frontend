import Image from "next/image";

export default function StoreBanner() {
  return (
    <div className="w-full rounded-xl overflow-hidden ">

      {/* ── DESKTOP ── */}
        <div className="hidden sm:flex items-stretch gap-4 p-3">
          {/* Left text — ~80% width */}
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-gradient-to-r from-[#0081FF] to-[#0054A6] px-6 py-6 text-white font-semibold tracking-wider xl:text-3xl 2xl:text-4xl">
          <span className="text-yellow-300 text-xl" aria-hidden>✦</span>
          Buy Global Branded Genuine Products from Authorized Online Store
        </div>

        {/* Right badge */}
          <div className="flex shrink-0 items-center gap-4 rounded-lg bg-gradient-to-r from-[#0081FF] to-[#0054A6] px-4 py-3">
            <div className="relative h-14 w-14 shrink-0">
              <Image
                src="/images/outlet.png"
                alt="Store icon"
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
            <div className="text-white leading-tight">
              <div className="flex items-end gap-2 whitespace-nowrap border-b border-white/90 pb-1">
                <span className="text-[48px] font-bold leading-[0.85]">42+</span>
                <span className="pb-1 text-[23px] font-medium leading-none">Exclusive</span>
              </div>
              <div className="pt-1 text-[48px] font-medium leading-[0.9] tracking-wide">Outlets</div>
            </div>
          </div>
      </div>

      {/* ── MOBILE ── */}
      <div className=" flex items-center justify-center gap-5 rounded-lg bg-gradient-to-r from-[#0081FF] to-[#0054A6] px-5 py-1 sm:hidden">
        <span className="text-white font-semibold text-base tracking-wide">Our Store</span>

        {/* Dashed circle */}
        <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-dashed border-white/60 text-white font-bold text-lg shrink-0">
          42+
        </div>

        <p className="text-white font-semibold text-base tracking-wide">
          Exclusive&nbsp;<span className="font-light">/</span>&nbsp;Outlets
        </p>
      </div>

    </div>
  );
}
