type MobileMadeInFeaturesProps = {
  productData?: {
    brand?: {
      name?: string;
    };
    tags?: string[];
  };
  madeInText?: string;
  features?: string[];
};

export default function MobileMadeInFeatures({ 
  productData,
  madeInText = productData?.brand?.name ? `Brand: ${productData.brand.name}` : "Product information", 
  features = productData?.tags || [] 
}: MobileMadeInFeaturesProps) {
  const mobileFeatures = features.slice(0, 4);

  return (
    <div className="space-y-3 lg:hidden">
      <p className="rounded bg-slate-100 py-2 text-center text-[14px] font-medium leading-none text-[#0C73DA]">
        {madeInText}
      </p>

      <div className="px-2 text-slate-500">
        {mobileFeatures.length > 0 ? (
          mobileFeatures.map((feature) => (
            <p key={feature} className="text-[10px] leading-3">
              • {feature}
            </p>
          ))
        ) : (
          <p className="text-[10px] leading-3 text-slate-400">No features available</p>
        )}
      </div>

      {mobileFeatures.length > 0 && (
        <div className="text-center">
          <button type="button" className="text-[10px] font-semibold text-[#0C73DA]">
            See More
          </button>
        </div>
      )}
    </div>
  );
}