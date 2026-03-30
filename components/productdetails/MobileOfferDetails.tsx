import Image from "next/image";

type MobileOfferDetailsProps = {
  specialOfferLeft: string;
  specialOfferOne: string;
  specialOfferTwo: string;
  shippingInfo: string;
  warrantyInfo: string;
  emiFacilityInfo: string;
  exchangeInfo: string;
};

function renderTextAfterColonBold(text: string) {
  const colonIndex = text.indexOf(":");

  if (colonIndex === -1) {
    return text;
  }

  const label = text.slice(0, colonIndex + 1);
  const value = text.slice(colonIndex + 1).trim();

  return (
    <>
      {`${label} `}
      <span className="font-semibold text-slate-900">{value}</span>
    </>
  );
}

export default function MobileOfferDetails({
  specialOfferLeft,
  specialOfferOne,
  specialOfferTwo,
  shippingInfo,
  warrantyInfo,
  emiFacilityInfo,
  exchangeInfo,
}: MobileOfferDetailsProps) {
  return (
    <div className="space-y-3 lg:hidden">
      <p className="flex items-start gap-3 text-[12px] text-slate-700">
        <Image src="/images/warranty.png" alt="Warranty" width={20} height={20} className="mt-0.5 h-4 w-4 object-contain" />
        <span>{renderTextAfterColonBold(warrantyInfo)}</span>
      </p>

      <button
        type="button"
        className="w-full rounded border border-[#9CB7D8] bg-[#EDF4FF] py-1.5 text-[14px] font-semibold leading-none text-[#0C73DA]"
      >
        {specialOfferLeft}
      </button>

      <div className="space-y-2 text-[13px] text-slate-800">
        <div className="flex items-center justify-between border border-slate-200 px-3 py-2">
          <span className="flex items-center gap-2">
            <Image src="/images/ebl.png" alt="EBL" width={22} height={22} className="h-5 w-5 object-contain" />
            {specialOfferOne}
          </span>
          <span>*{specialOfferOne}</span>
        </div>

        <div className="flex items-center justify-center gap-2 border border-slate-200 px-3 py-2 text-[24px] text-red-600">
          <Image src="/images/nogod.png" alt="Nagad" width={22} height={22} className="h-5 w-5 object-contain" />
        
          <span className="text-[13px] text-slate-800">{specialOfferTwo}</span>
        </div>
      </div>

      <div className="space-y-3 border-b border-slate-200 pb-3 text-[12px] text-slate-700">
        <p className="flex items-start gap-3">
          <Image src="/images/shippingtime.png" alt="Shipping time" width={20} height={20} className="mt-0.5 h-4 w-4 object-contain" />
          <span>{renderTextAfterColonBold(shippingInfo)}</span>
        </p>

        <p className="flex items-start gap-3">
          <Image src="/images/Vector.png" alt="EMI facility" width={20} height={20} className="mt-0.5 h-4 w-4 object-contain" />
          <span>{renderTextAfterColonBold(emiFacilityInfo)}</span>
        </p>

        <p className="flex items-start gap-3">
          <Image src="/images/exchange.png" alt="Exchange" width={20} height={20} className="mt-0.5 h-4 w-4 object-contain" />
          <span>
            {renderTextAfterColonBold(exchangeInfo)} <button type="button" className="font-medium text-[#0C73DA] underline">Showrooms</button>
          </span>
        </p>
      </div>
    </div>
  );
}