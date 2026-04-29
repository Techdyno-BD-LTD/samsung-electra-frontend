"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import CartSuccessModal from "@/components/common/CartSuccessModal";
import { toProductSlug } from "@/lib/productSlug";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  brand?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  category?: string;
  discountLabel?: string;
  saveLabel?: string;
  weight?: string;
  color?: string;
  slug?: string;
  productData?: any;
}

const toComparable = (value?: string) => value?.trim().toLowerCase() ?? "";
const isHexColor = (value?: string | null) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value ?? "");

export default function AddToCartModal({
  isOpen,
  onClose,
  title = "",
  brand = "",
  price = "",
  originalPrice = "",
  image = "",
  category = "",
  discountLabel = "",
  saveLabel = "",
  weight = "",
  color = "",
  slug = "",
  productData,
}: AddToCartModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [fullProductData, setFullProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedColorName, setSelectedColorName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isHidingModal, setIsHidingModal] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 150;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fetch full product data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const targetSlug = productData?.slug || slug || toProductSlug(productData?.name || title);
        if (!targetSlug) {
          setFullProductData(productData);
          return;
        }
        
        const response = await fetch(`/api/products/${targetSlug}`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          setFullProductData(data.data[0]);
        } else {
          setFullProductData(productData);
        }
      } catch {
        setFullProductData(productData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, slug, productData, title]);

  useEffect(() => {
    if (!isOpen || !fullProductData) return;

    const nextSelectedAttributes: Record<string, string> = {};
    (fullProductData.attributes ?? []).forEach((attribute: any) => {
      const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
      const firstValue = attribute.values?.[0];
      if (attributeKey && firstValue) {
        nextSelectedAttributes[attributeKey] = firstValue;
      }
    });

    setSelectedAttributes(nextSelectedAttributes);
    setSelectedColorName(fullProductData.color_details?.[0]?.name ?? color);
    setQuantity(1);
    setActiveImageIndex(0);
  }, [isOpen, fullProductData, color]);

  const sourceData = fullProductData || productData;

  const attributesForUi = (sourceData?.attributes ?? []).filter((attribute: any) => {
    return (attribute.values?.length ?? 0) > 0;
  });

  const variants = sourceData?.variants ?? [];
  const fallbackColorDetails = (sourceData?.colors ?? []).map((c: string) => ({
    name: c,
    code: isHexColor(c) ? c : null,
  }));
  const colorsForUi = (sourceData?.color_details?.length ?? 0) > 0
    ? (sourceData?.color_details ?? [])
    : fallbackColorDetails;

  const colorOptions = colorsForUi.map((c: any, index: number) => {
    const colorName = c.name ?? c.code ?? `Color ${index + 1}`;
    const colorNameComparable = toComparable(c.name);
    const matchedVariant = variants.find((variant: any) => {
      const variantName = toComparable(variant.variant);
      if (!variantName || !colorNameComparable) return false;
      return variantName === colorNameComparable || variantName.startsWith(`${colorNameComparable}-`);
    });

    return {
      key: `${colorName}-${index}`,
      name: colorName,
      code: c.code,
      image: matchedVariant?.image ?? sourceData?.thumbnail_image ?? image ?? "/images/wm2.png",
    };
  });

  const activeColorName = selectedColorName || colorOptions[0]?.name || color || "";
  const selectedVariant = variants.find((variant: any) => {
    const variantName = toComparable(variant.variant);
    if (!variantName) return false;

    const comparableColor = toComparable(activeColorName);
    if (comparableColor && !(variantName === comparableColor || variantName.startsWith(`${comparableColor}-`))) {
      return false;
    }

    return attributesForUi.every((attribute: any) => {
      const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
      const selectedValue = selectedAttributes[attributeKey];
      if (!selectedValue) return true;
      return variantName.includes(toComparable(selectedValue));
    });
  });

  const finalTitle = sourceData?.name || title;
  const finalBrand = sourceData?.brand?.name || brand;
  const finalCategory = sourceData?.category_info?.category_name || sourceData?.category?.name || category;

  // Use API main_price directly, as variant.price does not include discounts
  const displayPrice = sourceData?.main_price || price || `৳${selectedVariant?.price?.toLocaleString()}`;
  
  const displayOriginalPrice = sourceData?.stroked_price || originalPrice;
  const displayDiscountLabel = sourceData?.discount || discountLabel;

  const displayGallery = useMemo(() => {
    const images = new Set<string>();
    const thumb = sourceData?.thumbnail_image || image || "/images/wm2.png";
    if (thumb) images.add(thumb);
    
    sourceData?.photos?.forEach((p: any) => {
      const img = p.path || p.photo;
      if (img) images.add(img);
    });
    
    variants?.forEach((v: any) => {
      if (v.image) images.add(v.image);
    });
    
    return Array.from(images);
  }, [sourceData, image, variants]);

  useEffect(() => {
    if (!isOpen || displayGallery.length === 0) return;
    const selectedMainImage = selectedVariant?.image || colorOptions.find((c: any) => toComparable(c.name) === toComparable(activeColorName))?.image;
    if (selectedMainImage) {
      const idx = displayGallery.indexOf(selectedMainImage);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [activeColorName, selectedVariant, displayGallery, isOpen, colorOptions]);

  const finalImage = displayGallery[activeImageIndex] || displayGallery[0];
  const stockAvailable = selectedVariant?.qty ?? sourceData?.current_stock ?? 0;
  const displayStock = sourceData ? stockAvailable : 10;
  
  const handleIncrement = () => {
    if (quantity < displayStock) setQuantity(prev => prev + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const getCleanPrice = (p: string) => {
    if (!p) return 0;
    const match = p.match(/[\d,.]+/);
    if (!match) return 0;
    const s = match[0];
    return parseFloat(s.replace(/,/g, '')) || 0;
  };

  const totalPrice = getCleanPrice(displayPrice) * quantity;
  const formattedTotalPrice = `৳${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const buildCartPayload = () => {
    const finalSlug = sourceData?.slug || slug || toProductSlug(finalTitle);
    const variantName = selectedVariant?.variant || activeColorName || "";
    const uniqueId = variantName ? `${finalSlug}-${variantName}` : finalSlug;
    
    return {
      id: uniqueId,
      slug: finalSlug,
      title: finalTitle,
      brand: finalBrand,
      image: selectedVariant?.image || finalImage,
      price: displayPrice,
      originalPrice: displayOriginalPrice,
      discountPercent: displayDiscountLabel,
      saveAmount: saveLabel,
      color: activeColorName,
      variant: selectedVariant?.variant || "",
      type: finalCategory,
      weight: sourceData?.weight ? `${sourceData.weight}kg` : weight,
      quantity: quantity,
    };
  };

  const onAddToCartClick = () => {
    dispatch(addToCart(buildCartPayload()));
    setIsHidingModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 1000);
  };

  const onBuyNowClick = () => {
    dispatch(addToCart(buildCartPayload()));
    onClose();
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300 ${isHidingModal || showSuccessModal ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}>
        <div 
          className="relative flex w-full max-w-[700px] flex-col md:flex-row overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
          >
            <FaTimes className="text-sm" />
          </button>

          {/* Left Side: Images */}
          <div className="w-full bg-white p-4 md:w-5/12 border-r border-slate-100">
            <div className="relative mb-3 flex aspect-square w-full items-center justify-center rounded-lg border border-slate-100 p-2">
              {finalImage ? (
                <Image 
                  src={finalImage} 
                  alt={finalTitle} 
                  fill 
                  className="object-contain p-2" 
                  sizes="(max-width: 768px) 100vw, 300px"
                />
            ) : (
              <div className="text-slate-300">No Image</div>
            )}
          </div>
          
          {displayGallery.length > 1 && (
            <div className="relative mt-2 flex items-center group">
              {displayGallery.length > 5 && (
                <button
                  type="button"
                  onClick={() => scrollThumbnails('left')}
                  className="absolute left-0 z-10 -ml-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronLeft className="h-3 w-3 text-slate-600" />
                </button>
              )}
              <div 
                ref={thumbnailContainerRef}
                className="flex w-full gap-2 overflow-x-hidden scroll-smooth pb-1 px-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {displayGallery.map((img: string, idx: number) => (
                  <button
                    key={`thumb-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white ${activeImageIndex === idx ? 'border-blue-500' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
              {displayGallery.length > 5 && (
                <button
                  type="button"
                  onClick={() => scrollThumbnails('right')}
                  className="absolute right-0 z-10 -mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronRight className="h-3 w-3 text-slate-600" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full flex flex-col p-4 md:w-7/12 max-h-[85vh] overflow-y-auto">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 pr-6 leading-snug mb-3">
            {finalTitle} {activeColorName ? `| ${activeColorName}` : ''}
          </h2>

          <div className="grid grid-cols-[80px_1fr] items-center gap-y-2 mb-4 border-b border-slate-100 pb-4">
            {displayOriginalPrice && getCleanPrice(displayOriginalPrice) > getCleanPrice(displayPrice) && (
              <>
                <span className="text-xs font-medium text-slate-500">Price:</span>
                <span className="text-sm font-medium text-slate-400 line-through">
                  {displayOriginalPrice.split('/')[0]}
                </span>
              </>
            )}

            <span className="text-xs font-medium text-slate-500">
              {displayOriginalPrice && getCleanPrice(displayOriginalPrice) > getCleanPrice(displayPrice) ? 'Discount Price:' : 'Price:'}
            </span>
            <span className="text-xl font-bold text-[#247dfa]">
              {displayPrice.split('/')[0]}
            </span>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">Loading details...</div>
          ) : (
            <>
              {attributesForUi.length > 0 && attributesForUi.map((attribute: any) => {
                const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
                const selectedValue = selectedAttributes[attributeKey];
                return (
                  <div key={attributeKey} className="grid grid-cols-[80px_1fr] items-start gap-y-1 mb-3">
                    <span className="text-xs font-medium text-slate-500 pt-1">{attribute.name || "Capacity"}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(attribute.values ?? []).map((value: string) => (
                        <button
                          key={`${attributeKey}-${value}`}
                          onClick={() => setSelectedAttributes(prev => ({ ...prev, [attributeKey]: value }))}
                          className={`rounded border px-2.5 py-0.5 text-[11px] transition-all ${
                            selectedValue === value 
                              ? "border-[#247dfa] bg-[#247dfa]/10 text-[#247dfa] font-medium" 
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {colorOptions.length > 0 && (
                <div className="grid grid-cols-[80px_1fr] items-start gap-y-1 mb-4">
                  <span className="text-xs font-medium text-slate-500 pt-1">Color:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {colorOptions.map((color: any) => {
                      const isSelected = toComparable(color.name) === toComparable(activeColorName);
                      return (
                        <button
                          key={color.key}
                          onClick={() => setSelectedColorName(color.name)}
                          className={`rounded border p-0.5 transition-all ${isSelected ? "border-[#247dfa] ring-1 ring-[#247dfa]" : "border-slate-200 hover:border-slate-300"}`}
                          title={color.name}
                        >
                          <span className="flex items-center gap-1">
                            <Image src={color.image} alt={color.name} width={24} height={24} className="h-6 w-6 object-contain" />
                            <span className="text-[10px] text-slate-700 font-medium pr-1">{color.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-[80px_1fr] items-center gap-y-1 mb-4 border-b border-slate-100 pb-4">
            <span className="text-xs font-medium text-slate-500">Quantity:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded border border-slate-200 bg-white">
                <button 
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isLoading}
                  className="flex h-7 w-7 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FaMinus className="text-[10px]" />
                </button>
                <div className="flex h-7 w-10 items-center justify-center bg-[#e4ebf5] text-xs font-semibold text-[#247dfa]">
                  {quantity}
                </div>
                <button 
                  onClick={handleIncrement}
                  disabled={quantity >= displayStock || isLoading}
                  className="flex h-7 w-7 items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FaPlus className="text-[10px]" />
                </button>
              </div>
              <span className="text-xs text-slate-400">
                ({displayStock} available)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[80px_1fr] items-center gap-y-1 mb-6">
            <span className="text-xs font-medium text-slate-500">Total Price:</span>
            <span className="text-lg font-bold text-[#247dfa]">
              {formattedTotalPrice}
            </span>
          </div>

          <div className="mt-auto flex gap-2">
            <button
              onClick={onAddToCartClick}
              disabled={displayStock === 0 || isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-[#247dfa] px-4 py-1 text-sm font-semibold text-white hover:bg-blue-600 disabled:bg-slate-300 shadow-sm"
            >
              <FaShoppingCart className="text-xs" />
              Add to cart
            </button>
            <button
              onClick={onBuyNowClick}
              disabled={displayStock === 0 || isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded border-2 border-[#247dfa] bg-white px-4 py-1 text-sm font-semibold text-[#247dfa] hover:bg-[#f0f6ff] disabled:border-slate-300 disabled:text-slate-400 shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      </div>

      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        productName={finalTitle}
        productImage={finalImage}
        productPrice={displayPrice}
      />
    </>
  );
}
