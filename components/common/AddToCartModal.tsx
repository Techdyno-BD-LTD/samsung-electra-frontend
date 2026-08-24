"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes, FaHeart, FaRegShareSquare, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/features/cart/cartSlice";
import { addToWishlistAsync, removeFromWishlistAsync, WishlistItem } from "@/store/features/wishlist/wishlistSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import { useRouter } from "next/navigation";
import CartSuccessModal from "@/components/common/CartSuccessModal";
import BankEmiModal from "../productdetails/BankEmiModal";
import { toProductSlug } from "@/lib/productSlug";
import { formatCurrency } from "@/lib/currencyUtils";
import { pushToDataLayer } from "@/lib/gtm";
import { FiShoppingCart } from "react-icons/fi";

const toComparable = (value?: string) => value?.trim().toLowerCase() ?? "";
const isHexColor = (value?: string | null) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value ?? "");

export interface ProductData {
  id?: number | string;
  slug?: string;
  name?: string;
  description?: string;
  category_id?: number;
  category?: { name?: string; slug?: string };
  category_info?: {
    category_name?: string;
    parent_category_name?: string;
    parent_category_slug?: string;
    category_slug?: string;
  };
  brand?: { id?: number; name?: string; slug?: string; logo?: string };
  thumbnail_image?: string;
  photos?: Array<{ photo?: string; path?: string; variant?: string }>;
  main_price?: string;
  stroked_price?: string;
  discount?: string;
  has_discount?: boolean;
  current_stock?: number;
  unit?: string;
  rating?: number;
  rating_count?: number;
  sales?: number;
  calculable_price?: number;
  price_high_low?: string;
  connection_type?: string;
  model_number?: string;
  variants?: Array<{
    variant?: string;
    price?: number;
    sku?: string;
    qty?: number;
    image?: string | null;
  }>;
  links?: {
    details?: string;
  };
  emi_start?: string;
  book_in_showroom_title?: string;
  made_in_text?: string;
  other_features?: string;
  tags?: string[];
  special_offer_title?: string;
  special_offers?: Array<{ text?: string; image?: string | null }>;
  featured_specs?: Array<{ title?: string; text?: string | null; icon?: string | null }>;
  emi_plans?: Array<{
    bank_id?: number;
    bank_name?: string;
    max_month?: number;
    plans?: Array<{
      months?: number;
      interest_rate?: number;
      product_price?: number;
      effective_price?: number;
      monthly_payable?: number;
    }>;
  }>;
  emi_facility?: { text?: string; link?: string | null; link_label?: string | null };
  warranty?: { text?: string; warranty_type?: string; link?: string | null; link_label?: string | null };
  exchange?: { text?: string; link?: string | null; link_label?: string | null };
  estimated_shipping_text?: string;
  weight?: string | number;
  attributes?: Array<{
    attribute_id?: number | string;
    name?: string;
    values?: string[];
  }>;
  color_details?: Array<{
    name?: string;
    code?: string;
  }>;
  colors?: string[];
  badge_tag?: string;
  badge_value?: string;
  product_sold?: number;
  higher_sale?: boolean;
  down_payment?: number;
  monthly_installment?: number;
  [key: string]: unknown;
}

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug?: string;
  productData?: ProductData;
  // Fallback props passed from ProductCard
  title?: string;
  brand?: string;
  brandLogo?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  category?: string;
  discountLabel?: string;
  saveLabel?: string;
  weight?: string;
  color?: string;
}



export default function AddToCartModal({
  isOpen,
  onClose,
  slug: initialSlug,
  productData: initialData,
  title: fallbackTitle,
  brand: fallbackBrand,
  brandLogo: fallbackBrandLogo,
  image: fallbackImage,
  category: fallbackCategory,
  weight: fallbackWeight,
  color: fallbackColor
}: AddToCartModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [productData, setProductData] = useState<ProductData | null>(initialData || null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedColorName, setSelectedColorName] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isHidingModal, setIsHidingModal] = useState(false);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === 'demo';

  const title = fallbackTitle || productData?.name || initialData?.name || (isDemoMode ? "Product Title" : "");
  const brandLogo = fallbackBrandLogo || productData?.brand?.logo || "/images/samsung.png";
  const ratingCount = productData?.rating_count?.toString() || "0";
  const model = productData?.model_number || (isDemoMode ? "Model" : "");
  const sku = productData?.variants?.[0]?.sku || (isDemoMode ? "SKU" : "");

  const productSlug = initialSlug || initialData?.slug || (title ? toProductSlug(title) : "");
  const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.id === productSlug));

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 150;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    if (!isOpen) return;
    setIsHidingModal(false);
    setShowSuccessModal(false);
    const targetSlug = initialSlug || initialData?.slug || (initialData?.name ? toProductSlug(initialData.name) : "");
    if (!targetSlug) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${targetSlug}`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setProductData(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product for modal", err);
      }
    };
    fetchProduct();
  }, [isOpen, initialSlug, initialData]);

  useEffect(() => {
    if (!productData) return;
    const nextSelectedAttributes: Record<string, string> = {};
    let attrs = productData.attributes || [];
    if (typeof attrs === 'string') {
      try {
        attrs = JSON.parse(attrs);
      } catch {
        attrs = [];
      }
    }
    (Array.isArray(attrs) ? attrs : []).forEach((attribute: { attribute_id?: number | string; name?: string; values?: string[] }) => {
      const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
      const firstValue = attribute.values?.[0];
      if (attributeKey && firstValue) {
        nextSelectedAttributes[attributeKey] = firstValue;
      }
    });
    setSelectedAttributes(nextSelectedAttributes);
    setSelectedColorName(productData.color_details?.[0]?.name ?? "");
    setQuantity(1);
    setActiveImageIndex(0);
  }, [productData]);
  const emiText = productData?.emi_start || (isDemoMode ? "EMI Available" : "");
  const emiDetailsLabel = productData?.emi_facility?.link_label || "See details";
  const colorLabel = "Color";
  const mainImage = fallbackImage || productData?.thumbnail_image || "/images/wm2.png";
  const warrantyBadgeImage = "/images/warrantybadge.png";
  const specialOfferLeft = productData?.special_offer_title || (isDemoMode ? "Special Offer" : "");
  const specialOfferOne = productData?.special_offers?.[0]?.text || (isDemoMode ? "Offer 1" : "");
  const specialOfferTwo = productData?.special_offers?.[1]?.text || (isDemoMode ? "Offer 2" : "");
  const showroomTitle = productData?.book_in_showroom_title || (isDemoMode ? "Book in showroom Get 5% Off" : "");
  const shippingInfo = productData?.estimated_shipping_text || (isDemoMode ? "Shipping information" : "");
  const warrantyInfo = productData?.warranty?.text || (productData?.warranty?.warranty_type ? `Warranty: ${productData.warranty.warranty_type}` : (isDemoMode ? "Warranty information" : ""));
  const warrantyLinkLabel = productData?.warranty?.link_label || "View policy";
  const emiFacilityInfo = productData?.emi_facility?.text || (isDemoMode ? "EMI information" : "");
  const emiLinkLabel = productData?.emi_facility?.link_label || "See EMI Details";
  const madeInText = productData?.made_in_text || (isDemoMode ? "Product information" : "");

  const brandName = fallbackBrand || productData?.brand?.name || "Brand";
  const categoryName = fallbackCategory || productData?.category_info?.category_name ||
    (typeof productData?.category === 'object' ? productData.category?.name : productData?.category) ||
    "Category";


  const attributesForUi = useMemo(() => {
    let attrs = productData?.attributes || [];
    if (typeof attrs === 'string') {
      try {
        attrs = JSON.parse(attrs);
      } catch {
        attrs = [];
      }
    }
    return (Array.isArray(attrs) ? attrs : []).filter((attribute) => (attribute.values?.length ?? 0) > 0);
  }, [productData?.attributes]);

  const variants = useMemo(() => {
    let v = productData?.variants || [];
    if (typeof v === 'string') {
      try {
        v = JSON.parse(v);
      } catch {
        v = [];
      }
    }
    return Array.isArray(v) ? v : [];
  }, [productData]);

  const fallbackColorDetails = useMemo(() => {
    let cols = productData?.colors || [];
    if (typeof cols === 'string') {
      const colString = cols as string;
      try {
        cols = JSON.parse(colString);
      } catch {
        cols = colString.split(',').map(c => c.trim()).filter(Boolean);
      }
    }
    return (Array.isArray(cols) ? cols : []).map((color: string | { name?: string; value?: string; code?: string }) => ({
      name: typeof color === 'string' ? color : color.name || color.value || 'Color',
      code: typeof color === 'string' ? (isHexColor(color) ? color : null) : color.code || color.value || null,
    }));
  }, [productData?.colors]);

  const colorsForUi = useMemo(() => {
    let colorDetails = productData?.color_details || [];
    if (typeof colorDetails === 'string') {
      try {
        colorDetails = JSON.parse(colorDetails);
      } catch {
        colorDetails = [];
      }
    }
    return (Array.isArray(colorDetails) && colorDetails.length > 0)
      ? colorDetails
      : fallbackColorDetails;
  }, [productData?.color_details, fallbackColorDetails]);

  const colorOptions = useMemo(() => {
    return colorsForUi.map((color, index) => {
      const colorName = color.name ?? color.code ?? `Color ${index + 1}`;
      const colorNameComparable = toComparable(color.name);
      const matchedVariant = variants.find((variant) => {
        const variantName = toComparable(variant.variant);
        if (!variantName || !colorNameComparable) return false;
        return variantName === colorNameComparable || variantName.startsWith(`${colorNameComparable}-`);
      });
      return {
        key: `${colorName}-${index}`,
        name: colorName,
        code: color.code,
        image: matchedVariant?.image ?? productData?.thumbnail_image ?? mainImage,
      };
    });
  }, [colorsForUi, variants, productData?.thumbnail_image, mainImage]);

  const activeColorName = selectedColorName || colorOptions[0]?.name || fallbackColor || "";
  const selectedVariant = variants.find((variant) => {
    const variantName = toComparable(variant.variant);
    if (!variantName) return false;
    const comparableColor = toComparable(activeColorName);
    if (comparableColor && !(variantName === comparableColor || variantName.startsWith(`${comparableColor}-`))) return false;
    return attributesForUi.every((attribute) => {
      const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
      const selectedValue = selectedAttributes[attributeKey];
      if (!selectedValue) return true;
      const normalizedValue = toComparable(selectedValue).replace(/[\s-]/g, "");
      const normalizedVariant = variantName.replace(/[\s-]/g, "");
      return normalizedVariant.includes(normalizedValue);
    });
  });

  const selectedSku = selectedVariant?.sku || sku;
  const selectedAvailability = (selectedVariant?.qty ?? productData?.current_stock ?? 0) > 0 ? "In Stock" : "Out of Stock";

  // Dynamic Pricing Logic
  const discountValue = Number(productData?.discount_value || 0);
  const discountType = (productData?.discount_type as string) || "percent";

  const basePriceNum = selectedVariant ? Number(selectedVariant.price) : Number(productData?.calculable_price || 0);

  let finalPriceNum = basePriceNum;
  let originalPriceNum = basePriceNum;
  let saveAmountNum = 0;

  if (discountValue > 0) {
    if (discountType === "percent") {
      if (selectedVariant) {
        saveAmountNum = basePriceNum * (discountValue / 100);
        finalPriceNum = basePriceNum - saveAmountNum;
        originalPriceNum = basePriceNum;
      } else {
        finalPriceNum = Number(productData?.calculable_price || 0);
        const stroked = productData?.stroked_price ? Number(String(productData.stroked_price).replace(/[^0-9.-]+/g, "")) : 0;
        originalPriceNum = stroked || (finalPriceNum / (1 - discountValue / 100));
        saveAmountNum = originalPriceNum - finalPriceNum;
      }
    } else {
      if (selectedVariant) {
        saveAmountNum = discountValue;
        finalPriceNum = basePriceNum - discountValue;
        originalPriceNum = basePriceNum;
      } else {
        finalPriceNum = Number(productData?.calculable_price || 0);
        saveAmountNum = discountValue;
        originalPriceNum = finalPriceNum + discountValue;
      }
    }
  }

  const price = formatCurrency(finalPriceNum);
  const originalPrice = formatCurrency(originalPriceNum);
  const discountLabel = productData?.discount || (discountValue > 0 ? (discountType === "percent" ? `${discountValue}% Off` : `${formatCurrency(discountValue)} Off`) : "0% Off");
  const saveLabel = `Save : ${formatCurrency(saveAmountNum)}`;

  const displayGallery = useMemo(() => {
    const images = new Set<string>();
    const thumb = productData?.thumbnail_image || mainImage || "/images/wm2.png";
    if (thumb) images.add(thumb);

    let photos = productData?.photos || [];
    if (typeof photos === 'string') {
      try {
        photos = JSON.parse(photos);
      } catch {
        photos = [];
      }
    }

    (Array.isArray(photos) ? photos : []).forEach((p: { path?: string; photo?: string }) => {
      const img = p.path || p.photo || (typeof p === 'string' ? p : null);
      if (img) images.add(img);
    });

    let variantsData = productData?.variants || [];
    if (typeof variantsData === 'string') {
      try {
        variantsData = JSON.parse(variantsData);
      } catch {
        variantsData = [];
      }
    }
    (Array.isArray(variantsData) ? variantsData : []).forEach((v: { image?: string | null }) => {
      if (v.image) images.add(v.image);
    });
    return Array.from(images);
  }, [productData, mainImage]);

  useEffect(() => {
    if (displayGallery.length === 0) return;
    const selectedImage = selectedVariant?.image || colorOptions.find((color) => toComparable(color.name) === toComparable(activeColorName))?.image;
    if (selectedImage) {
      const idx = displayGallery.indexOf(selectedImage);
      if (idx !== -1) setActiveImageIndex(idx);
    }
  }, [activeColorName, selectedVariant, displayGallery, colorOptions]);

  const finalMainImage = displayGallery[activeImageIndex] || displayGallery[0];

  const buildCartPayload = () => {
    const targetSlug = initialSlug || productData?.slug || (title ? toProductSlug(title) : "product");
    const variantName = selectedVariant?.variant || activeColorName || "";
    const uniqueId = variantName ? `${targetSlug}-${variantName}` : targetSlug;
    return {
      id: uniqueId,
      slug: targetSlug,
      title: title || "Product",
      brand: brandName || "Brand",
      image: selectedVariant?.image || finalMainImage || "",
      price: price ? String(price).split('/')[0].trim() : "0",
      originalPrice: originalPrice ? String(originalPrice).split('/')[0].trim() : "0",
      discountPercent: discountLabel || "0%",
      saveAmount: saveLabel || "0",
      color: activeColorName,
      variant: selectedVariant?.variant || "",
      type: categoryName,
      weight: (fallbackWeight || productData?.weight) ? `${fallbackWeight || productData?.weight}kg` : "N/A",
      quantity: quantity,
      productId: Number(productData?.id || 0),
    };
  };

  const handleAddToCart = () => {
    if (!productData && !initialData) return;
    const cartPayload = buildCartPayload();
    dispatch(addToCart(cartPayload));

    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: finalPriceNum * quantity,
        items: [{
          id: String(cartPayload.productId),
          item_id: String(cartPayload.productId),
          item_name: cartPayload.title,
          currency: "BDT",
          price: finalPriceNum,
          item_brand: cartPayload.brand,
          item_category: productData?.category_info?.parent_category_name || cartPayload.type,
          item_category2: productData?.category_info?.parent_category_name ? cartPayload.type : undefined,
          item_variant: cartPayload.variant,
          quantity: cartPayload.quantity,
        }]
      }
    });

    setIsHidingModal(true);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  const handleBuyNow = () => {
    if (!productData && !initialData) return;
    const cartPayload = buildCartPayload();
    dispatch(addToCart(cartPayload));

    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: finalPriceNum * quantity,
        items: [{
          id: String(cartPayload.productId),
          item_id: String(cartPayload.productId),
          item_name: cartPayload.title,
          currency: "BDT",
          price: finalPriceNum,
          item_brand: cartPayload.brand,
          item_category: productData?.category_info?.parent_category_name || cartPayload.type,
          item_category2: productData?.category_info?.parent_category_name ? cartPayload.type : undefined,
          item_variant: cartPayload.variant,
          quantity: cartPayload.quantity,
        }]
      }
    });

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productSlug));
    } else {
      const item: WishlistItem = {
        id: productSlug,
        productId: Number(productData?.id || 0),
        title,
        brand: brandName,
        image: finalMainImage,
        price,
        originalPrice,
        discountLabel,
        saveAmount: saveLabel,
        color: activeColorName,
        type: categoryName,
        weight: (fallbackWeight || productData?.weight) ? `${fallbackWeight || productData?.weight}kg` : "N/A",
        model,
      };
      dispatch(addToWishlistAsync(item)).then((result) => {
        if (addToWishlistAsync.fulfilled.match(result)) {
          dispatch(showToast({
            message: "Added to Wishlist!",
            type: 'success',
            productName: title,
            productImage: finalMainImage,
            productPrice: price,
            actionLabel: "View Wishlist",
            actionLink: "/dashboard/wishlist"
          }));
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-1 transition-all duration-300 ${isHidingModal && !showSuccessModal ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div
          className={`relative w-full max-w-[1000px] max-h-[70vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isHidingModal ? "scale-95 opacity-0 pointer-events-none" : "animate-in fade-in zoom-in-95 duration-200"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-1 border-b border-slate-100">
            <h2 className="text-lg font-medium text-slate-800">Quick view details</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <FaTimes className="text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Gallery */}
              <div className="w-full lg:w-[40%] space-y-4">
                <div className="relative rounded-2xl border border-slate-200 bg-white p-4">
                  <button type="button" className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-50">
                    <FaPlus className="h-3 w-3" />
                  </button>

                  <div className="relative mx-auto min-h-[300px] max-w-[450px] flex items-center justify-center">
                    <Image
                      src={finalMainImage}
                      alt={title}
                      width={450}
                      height={450}
                      className="h-auto w-full object-contain"
                      priority
                    />
                    <Image
                      src={warrantyBadgeImage}
                      alt="Official warranty"
                      width={100}
                      height={100}
                      className="absolute bottom-2 left-2 h-20 w-20 object-contain"
                    />
                  </div>
                </div>

                <div className="relative flex items-center group px-1">
                  {displayGallery.length > 5 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('left')}
                      className="absolute -left-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                    >
                      <FaChevronLeft className="h-3 w-3 text-slate-600" />
                    </button>
                  )}

                  <div
                    ref={thumbnailContainerRef}
                    className="flex gap-2 overflow-x-hidden scroll-smooth w-full py-1"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {displayGallery.map((item, index) => (
                      <button
                        key={`${item}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl border p-1.5 transition-all ${index === activeImageIndex ? "border-blue-600 ring-2 ring-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                      >
                        <Image
                          src={item}
                          alt={`${title} preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="mx-auto h-full w-full object-contain"
                        />
                      </button>
                    ))}
                  </div>

                  {displayGallery.length > 5 && (
                    <button
                      type="button"
                      onClick={() => scrollThumbnails('right')}
                      className="absolute -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                    >
                      <FaChevronRight className="h-3 w-3 text-slate-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full lg:w-[60%] space-y-2">
                <div>
                  <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">{categoryName}</p>
                  <h1 className="text-lg font-semibold text-slate-900  leading-tight mb-3 ">{title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                  <Image src={brandLogo} alt={brandName} width={50} height={20} className="h-4 w-auto object-contain" />
                  <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                    <FaStar className="h-3 w-3" />
                    <FaStar className="h-3 w-3" />
                    <FaStar className="h-3 w-3" />
                    <FaStar className="h-3 w-3" />
                    <FaStar className="h-3 w-3 text-slate-300" />
                    <span className="ml-1 text-slate-500">({ratingCount})</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span>Model: {model}</span>
                  <span className="text-slate-300">|</span>
                  <span>SKU: {selectedSku}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-[#0A67C8] font-semibold">{selectedAvailability}</span>
                </div>

                <div className="flex items-center gap-6 ">
                  <p className="text-2xl font-semibold text-[#0C73DA]">{price}</p>
                  {saveAmountNum > 0 && (
                    <>
                      <div className="flex flex-col justify-center">
                        <p className="text-[12px] font-semibold text-[#15A85B] uppercase tracking-wide">{discountLabel}</p>
                        <p className="text-[14px] text-slate-400 line-through">{originalPrice}</p>
                      </div>
                      <span className="rounded-tl-2xl rounded-br-2xl bg-[#F13D36] px-4 py-1 text-xs font-medium text-white shadow-sm">
                        {saveLabel}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 py-2 text-sm text-slate-700">
                  <Image src="/images/pdemi.svg" alt="EMI" width={20} height={20} className="h-5 w-5 object-contain" />
                  <span>EMI Starts From <span className="font-bold">{emiText}</span></span>
                  <button 
                    type="button" 
                    className="font-bold text-[#0C73DA] hover:underline"
                    onClick={() => setIsEmiModalOpen(true)}
                  >
                    | {emiDetailsLabel}
                  </button>
                </div>

                {/* Attributes */}
                <div className="space-y-4 pt-1">
                  {attributesForUi.map((attribute) => {
                    const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
                    const selectedValue = selectedAttributes[attributeKey];
                    return (
                      <div key={attributeKey} className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{attribute.name || "Attribute"} :</span>
                        <div className="flex flex-wrap gap-2">
                          {(attribute.values ?? []).map((value) => {
                            const isSelected = selectedValue === value;
                            return (
                              <button
                                key={`${attributeKey}-${value}`}
                                type="button"
                                onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attributeKey]: value }))}
                                className={`px-4 py-1 rounded-lg border text-xs font-bold transition-all ${isSelected ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600" : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"}`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{colorLabel} :</span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => {
                        const isSelected = toComparable(color.name) === toComparable(activeColorName);
                        return (
                          <button
                            key={color.key}
                            type="button"
                            onClick={() => setSelectedColorName(color.name)}
                            className={`flex items-center gap-2 rounded-xl border p-1 pr-3 transition-all ${isSelected ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                          >
                            <Image src={color.image} alt={color.name} width={32} height={32} className="h-8 w-8 rounded-lg object-contain bg-white" />
                            <span className={`text-xs font-bold ${isSelected ? "text-blue-700" : "text-slate-700"}`}>{color.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Counter & Buttons */}
                <div className="flex flex-col gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-5 rounded-xl border border-slate-200 px-4 py-1 bg-slate-50">
                      <button type="button" onClick={handleDecrement} className="text-slate-500 hover:text-blue-600 transition-colors">
                        <FaMinus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-semibold text-slate-800">{quantity.toString().padStart(2, '0')}</span>
                      <button type="button" onClick={handleIncrement} className="text-slate-500 hover:text-blue-600 transition-colors">
                        <FaPlus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`p-2 rounded-full border transition-all ${isWishlisted ? "text-red-500 border-red-100 bg-red-50" : "text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-100 hover:bg-red-50"}`}
                    >
                      <FaHeart className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-100 hover:bg-blue-50 transition-all">
                      <FaRegShareSquare className="h-4 w-4" />
                    </button>
                    <button type="button" className="text-sm font-bold text-[#0C73DA] hover:underline ml-auto">
                      {showroomTitle}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="h-8 rounded-xl bg-[#0054A6] text-sm font-semibold text-white shadow-lg shadow-blue-100 hover:bg-blue-800 active:scale-[0.98] transition-all"
                    >
                      Buy Now
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-3 h-8 rounded-xl border-2 border-[#9CB7D8] text-sm font-bold text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <Image src="/images/pdcart.svg" alt="Cart" width={20} height={20} className="w-5 h-5 object-contain" />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Offers & Info */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                    <p className="flex items-center gap-2">
                      <Image src="/images/freedelivery.svg" alt="Free" width={18} height={18} className="h-4.5 w-4.5 opacity-80" />
                      Free Delivery
                    </p>
                    <p className="flex items-center gap-2">
                      <Image src="/images/freeinstallation.svg" alt="Install" width={18} height={18} className="h-4.5 w-4.5 opacity-80" />
                      Free Installation
                    </p>
                    <p className="flex items-center gap-2">
                      <Image src="/images/cod.svg" alt="COD" width={18} height={18} className="h-4.5 w-4.5 opacity-80" />
                      Cash on delivery
                    </p>
                    <p className="flex items-center gap-2">
                      <Image src="/images/aftersales.svg" alt="Service" width={18} height={18} className="h-4.5 w-4.5 opacity-80" />
                      After sales service
                    </p>
                  </div>

                  {(() => {
                    let offers = productData?.special_offers || [];
                    if (typeof offers === 'string') {
                      try {
                        offers = JSON.parse(offers);
                      } catch {
                        offers = [];
                      }
                    }
                    const hasOffers = (Array.isArray(offers) && offers.length > 0);
                    const showOffersBox = isDemoMode || hasOffers || (specialOfferLeft && specialOfferLeft.trim() !== "");

                    if (!showOffersBox) return null;

                    return (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3">
                        <p className="text-xs font-bold text-[#0C73DA] mb-2">*{specialOfferLeft} =</p>
                        <div className="flex flex-wrap gap-4">
                          {hasOffers ? (
                            offers.map((offer: { image?: string | null; text?: string }, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                {offer.image && <Image src={offer.image} alt="Offer" width={32} height={20} className="h-5 w-auto object-contain" />}
                                {offer.text}
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                <Image src="/images/ebl.png" alt="EBL" width={32} height={20} className="h-5 w-auto object-contain" />
                                {specialOfferOne}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                                <Image src="/images/nogod.png" alt="Nagad" width={32} height={20} className="h-5 w-auto object-contain" />
                                {specialOfferTwo}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {(isDemoMode || shippingInfo || warrantyInfo || emiFacilityInfo) && (
                    <div className="space-y-2 text-[11px] text-slate-500 font-medium">
                      {(isDemoMode || shippingInfo) && (
                        <p className="flex items-center gap-3">
                          <Image src="/images/shippingtime.png" alt="Time" width={20} height={20} className="h-5 w-5 opacity-70" />
                          <span>Shipping Timeline: {shippingInfo}</span>
                        </p>
                      )}
                      {(isDemoMode || warrantyInfo) && (
                        <p className="flex items-center gap-3">
                          <Image src="/images/warranty.png" alt="Warranty" width={20} height={20} className="h-5 w-5 opacity-70" />
                          <span>{warrantyInfo}</span>
                          <button className="text-blue-600 font-bold hover:underline">{warrantyLinkLabel}</button>
                        </p>
                      )}
                      {(isDemoMode || emiFacilityInfo) && (
                        <p className="flex items-center gap-3">
                          <Image src="/images/Vector.png" alt="EMI" width={20} height={20} className="h-5 w-5 opacity-70" />
                          <span>{emiFacilityInfo}</span>
                          <button 
                            className="text-blue-600 font-bold hover:underline"
                            onClick={() => setIsEmiModalOpen(true)}
                          >
                            {emiLinkLabel}
                          </button>
                        </p>
                      )}
                    </div>
                  )}

                  {(isDemoMode || madeInText) && (
                    <p className="rounded-lg bg-slate-50 py-2 text-center text-xs font-bold text-[#0C73DA] tracking-widest uppercase border border-slate-100">
                      {madeInText}
                    </p>
                  )}
                </div>
              </div>
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
        productName={title}
        productImage={finalMainImage}
        productPrice={price}
        productOriginalPrice={originalPrice}
      />
      <BankEmiModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        emiPlans={productData?.emi_plans || []}
        productName={productData?.name || title}
        productSlug={productSlug}
      />
    </>
  );
}
