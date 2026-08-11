'use client';

import Image from "next/image";
import { FaHeart, FaPlus, FaRegShareSquare, FaStar, FaChevronLeft, FaChevronRight, FaGavel, FaEye } from "react-icons/fa";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { pushToDataLayer, cleanPrice } from "@/lib/gtm";

import ProductDetailsTabs from "@/components/productdetails/ProductDetailsTabs";
import MobileProductGallery from "@/components/productdetails/MobileProductGallery";
// import MobileStickyPurchaseBar from "@/components/productdetails/MobileStickyPurchaseBar";
import MobileOfferDetails from "@/components/productdetails/MobileOfferDetails";
import MobileMadeInFeatures from "@/components/productdetails/MobileMadeInFeatures";
import MobileBackButton from "@/components/productdetails/MobileBackButton";
import FooterBreadcrumbPortal from "@/components/productdetails/FooterBreadcrumbPortal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/features/cart/cartSlice";
import CartSuccessModal from "@/components/common/CartSuccessModal";
import { addToWishlistAsync, removeFromWishlistAsync, WishlistItem } from "@/store/features/wishlist/wishlistSlice";
import { showToast } from "@/store/features/toast/toastSlice";
import HigherSaleModal from "@/components/productdetails/HigherSaleModal";
import BankEmiModal from "@/components/productdetails/BankEmiModal";
import ProductImageZoomModal from "@/components/productdetails/ProductImageZoomModal";
import Skeleton from "@/components/common/Skeleton";


export interface ProductData {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
  category?: {
    name?: string;
    slug?: string;
  };
  category_info?: {
    category_name?: string;
    parent_category_name?: string;
    parent_category_slug?: string;
    category_slug?: string;
  };
  brand?: {
    name?: string;
    slug?: string;
    logo?: string;
  };
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
  model_number?: string;
  variants?: Array<{
    variant?: string;
    price?: number;
    sku?: string;
    qty?: number;
    image?: string;
  }>;
  emi_start?: string;
  book_in_showroom_title?: string;
  made_in_text?: string;
  other_features?: string;
  tags?: string[];
  special_offer_title?: string;
  special_offers?: Array<{
    text?: string;
    image?: string | null;
  }>;
  featured_specs?: Array<{
    title?: string;
    description?: string;
    image?: string | null;
    text?: string | null;
    icon?: string | null;
  }>;
  emi_facility?: {
    text?: string;
    link?: string | null;
    link_label?: string | null;
    plans?: Array<{
      month?: number;
      amount?: number;
    }>;
  };
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
  reviews?: {
    total?: number;
    average?: number;
    breakdown?: Array<{ star: number; count: number }>;
    items?: Array<{ name: string; title: string; body: string; score: number }>;
  };
  exchange?: {
    text?: string;
    link?: string | null;
    link_label?: string | null;
  };
  product_policy?: {
    title?: string;
    content?: string;
  };
  specifications?: Array<{ label?: string; value?: string }>;
  choice_options?: Array<{
    name?: number | string;
    title?: string;
    options?: string[];
  }>;
  attributes?: Array<{
    attribute_id?: number | string;
    name?: string;
    values?: string[];
  }>;
  color_details?: Array<{
    id?: number | null;
    name?: string;
    code?: string | null;
  }>;
  warranty?: {
    warranty_type?: string;
    text?: string;
    link?: string | null;
    link_label?: string | null;
  };
  colors?: string[];
  estimated_shipping_text?: string;
  higher_sale?: boolean;
  down_payment?: number;
  monthly_installment?: number;
  show_free_delivery?: boolean;
  show_free_installation?: boolean;
  show_cash_on_delivery?: boolean;
  show_after_sales_service?: boolean;
  [key: string]: unknown;
}

interface ProductDetailsClientProps {
  initialData: ProductData;
  slug: string;
}

export default function ProductDetailsClient({ initialData, slug: propSlug }: ProductDetailsClientProps) {
  const params = useParams();
  const slug = (params.slug as string) || propSlug;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  const [productData, setProductData] = useState<ProductData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedColorName, setSelectedColorName] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isHigherSaleModalOpen, setIsHigherSaleModalOpen] = useState(false);
  const [isBankEmiModalOpen, setIsBankEmiModalOpen] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 520, height: 700 });
  const [isHovered, setIsHovered] = useState(false);
  const quantity = 1;
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    if (!productData?.auction_end_date) return;
    const endTimeMs = Number(productData.auction_end_date) * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTimeMs - now;

      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [productData?.auction_end_date]);

  const formattedEndDate = useMemo(() => {
    if (!productData?.auction_end_date) return "";
    const date = new Date(Number(productData.auction_end_date) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [productData?.auction_end_date]);

  const formattedStartDate = useMemo(() => {
    if (!productData?.auction_start_date) return "";
    const date = new Date(Number(productData.auction_start_date) * 1000);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [productData?.auction_start_date]);

  const handlePlaceBid = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      dispatch(showToast({ message: "Please enter a valid bid amount", type: "error" }));
      return;
    }
    const highestBid = Number(productData?.highest_bid || productData?.starting_bid || 0);
    if (amount <= highestBid) {
      dispatch(showToast({ message: `Bid must be greater than ${highestBid}`, type: "error" }));
      return;
    }

    try {
      const response = await fetch('/api/v2/auction/place-bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productData?.id,
          amount: amount
        })
      });

      const resData = await response.json();
      if (resData.success || response.ok) {
        dispatch(showToast({ message: "Bid placed successfully!", type: "success" }));
        if (productData?.slug) {
          const updatedResp = await fetch(`/api/v2/auction/products/${productData.slug}`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          });
          const updatedJson = await updatedResp.json();
          if (updatedJson.success && updatedJson.data?.[0]) {
            setProductData(updatedJson.data[0]);
          }
        }
        setBidAmount("");
      } else {
        dispatch(showToast({ message: resData.message || "Failed to place bid", type: "error" }));
      }
    } catch (error) {
      console.error(error);
      dispatch(showToast({ message: "Something went wrong while placing bid", type: "error" }));
    }
  };

  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const hasFiredViewItemRef = useRef<number | null>(null);

  const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.id === slug));

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 150;
      thumbnailContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };



  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Lens dimensions: 30% of container width, 22% of container height
    const lensWidth = width * 0.3;
    const lensHeight = height * 0.22;

    // Center lens on cursor
    let x = mouseX - lensWidth / 2;
    let y = mouseY - lensHeight / 2;

    // Constrain lens inside boundaries
    if (x < 0) x = 0;
    if (x > width - lensWidth) x = width - lensWidth;
    if (y < 0) y = 0;
    if (y > height - lensHeight) y = height - lensHeight;



    setLensPosition({ x, y });
    setContainerSize({ width, height });
  };

  const toComparable = (value?: string) => value?.trim().toLowerCase() ?? "";
  const isHexColor = (value?: string | null) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value ?? "");

  const parseHtmlFeatures = (htmlContent?: string): string[] => {
    if (!htmlContent) return [];
    // Simple regex to extract text between <p> or <li> tags, working on both server and client
    const matches = htmlContent.match(/<(p|li)[^>]*>(.*?)<\/\1>/g);
    if (matches) {
      return matches
        .map(m => m.replace(/<[^>]*>/g, '').trim()) // Remove tags
        .map(text => text.replace(/^[•\s\-\*]+/, '').trim())
        .filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    if (!slug || initialData) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v2/auction/products/${slug}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setProductData(data.data[0]);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, initialData, token]);

  useEffect(() => {
    if (!productData) return;

    const nextSelectedAttributes: Record<string, string> = {};
    let attrs: unknown[] = [];
    const rawAttributes = productData.attributes as unknown;
    if (Array.isArray(rawAttributes)) {
      attrs = rawAttributes;
    } else if (typeof rawAttributes === 'string') {
      try {
        const parsed = JSON.parse(rawAttributes);
        if (Array.isArray(parsed)) attrs = parsed;
      } catch {}
    }
    attrs.forEach((attribute) => {
      if (attribute && typeof attribute === 'object') {
        const attrObj = attribute as { attribute_id?: string | number; name?: string; values?: string[] };
        const attributeKey = String(attrObj.attribute_id ?? attrObj.name ?? "");
        const firstValue = attrObj.values?.[0];
        if (attributeKey && firstValue) {
          nextSelectedAttributes[attributeKey] = firstValue;
        }
      }
    });

    setSelectedAttributes(nextSelectedAttributes);
    setSelectedColorName(productData.color_details?.[0]?.name ?? "");
  }, [productData]);

  useEffect(() => {
    if (!productData) return;

    try {
      const stored = localStorage.getItem('recently_viewed_products');
      const list = stored ? JSON.parse(stored) : [];

      let calculatedSaveAmount = "";
      if (productData.stroked_price && productData.main_price) {
        const orig = Number(productData.stroked_price.replace(/[^0-9.-]+/g, ""));
        const curr = Number(productData.main_price.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(orig) && !isNaN(curr) && orig > curr) {
          calculatedSaveAmount = `Save : ৳${(orig - curr).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }
      }

      const productInfo = {
        id: productData.id,
        slug: productData.slug,
        title: productData.name,
        image: productData.thumbnail_image,
        brandLogo: productData.brand?.logo,
        type: productData.category_info?.category_name || productData.category?.name,
        rating: productData.rating,
        ratingCount: productData.rating ? `(${Number(productData.rating).toFixed(1)})` : "(0.0)",
        weight: productData.weight ? `${productData.weight}KG` : undefined,
        color: productData.color_details?.[0]?.name || (productData.colors?.[0] ? String(productData.colors[0]) : undefined),
        emiPrice: productData.emi_start ? `EMI From ${productData.emi_start}` : undefined,
        price: productData.main_price,
        originalPrice: productData.stroked_price,
        discountPercent: productData.discount,
        saveAmount: calculatedSaveAmount || undefined,
        tags: productData.tags,
      };

      const filteredList = list.filter((item: { id?: number }) => item.id !== productInfo.id);
      filteredList.unshift(productInfo);
      localStorage.setItem('recently_viewed_products', JSON.stringify(filteredList.slice(0, 3)));
    } catch (err) {
      console.error('Failed to update recently viewed products', err);
    }
  }, [productData]);

  const isDemoMode = process.env.NEXT_PUBLIC_APP_MODE === 'demo';

  const category = productData?.category_info?.category_name || productData?.category?.name || "Product Category";
  const title = productData?.name || "Product Title";
  const brandName = productData?.brand?.name || "Brand";
  const brandLogo = productData?.brand?.logo || "/images/samsung.png";
  const ratingCount = productData?.rating_count?.toString() || "0";
  const categoryName = productData?.category_info?.category_name ||
    (typeof productData?.category === 'object' ? productData.category?.name : productData?.category) ||
    "Category";
  const model = productData?.model_number || (isDemoMode ? "Model" : "");
  const sku = productData?.variants?.[0]?.sku || (isDemoMode ? "SKU" : "");
  const price = productData?.main_price || "Price";
  const originalPrice = productData?.stroked_price || "Price";

  const hasDisc = useMemo(() => {
    if (isDemoMode) return true;
    if (!productData?.discount || /^(0%|0%\s*off|0)$/i.test(productData.discount)) {
      return false;
    }
    if (productData.main_price && productData.stroked_price) {
      const main = Number(productData.main_price.replace(/[^0-9.-]+/g, ""));
      const stroked = Number(productData.stroked_price.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(main) && !isNaN(stroked) && stroked <= main) {
        return false;
      }
    }
    return true;
  }, [productData, isDemoMode]);

  const saveAmountText = useMemo(() => {
    if (productData?.stroked_price && productData?.main_price) {
      const orig = Number(productData.stroked_price.replace(/[^0-9.-]+/g, ""));
      const curr = Number(productData.main_price.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(orig) && !isNaN(curr) && orig > curr) {
        return `SAVE : ৳ ${(orig - curr).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }
    }
    return isDemoMode ? "SAVE : ৳ 0" : "";
  }, [productData, isDemoMode]);

  const discountLabel = hasDisc ? (productData?.discount || (isDemoMode ? "0% Off" : "")) : "";
  const saveLabel = hasDisc ? (saveAmountText || (isDemoMode ? "Save Amount" : "")) : "";
  const features = productData?.tags || [];
  const descriptionHtml = productData?.description || "";
  const featuresList = parseHtmlFeatures(productData?.other_features) || productData?.tags || [];
  const mainImage = productData?.thumbnail_image || "/images/wm2.png";
  const warrantyBadgeImage = "/images/warrantybadge.png";
  const specialOffers = useMemo(() => {
    const raw = productData?.special_offers || [];
    if (isDemoMode) return raw;
    if (raw.length === 2 &&
      raw[0]?.text === 'EBL Cashback 10%' &&
      raw[1]?.text === 'Nagad Cashback 10%') {
      return [];
    }
    return raw;
  }, [productData?.special_offers, isDemoMode]);

  const specialOfferTitle = useMemo(() => {
    const title = productData?.special_offer_title || "";
    if (isDemoMode) return title || "Special Offer";
    if (title === 'Special Offer' && specialOffers.length === 0) {
      return "";
    }
    return title;
  }, [productData?.special_offer_title, specialOffers, isDemoMode]);

  const specialOfferLeft = "Special Offer";
  const specialOfferOne = "Offer 1";
  const specialOfferTwo = "Offer 2";
  const showroomTitle = productData?.book_in_showroom_title ? productData.book_in_showroom_title : (isDemoMode ? "Book in showroom Get 5% Off" : "");
  const shippingInfo = productData?.estimated_shipping_text ? productData.estimated_shipping_text : (isDemoMode ? "Shipping information" : "");
  const warrantyInfo = productData?.warranty?.text ? productData.warranty.text : productData?.warranty?.warranty_type ? `Warranty: ${productData.warranty.warranty_type}` : (isDemoMode ? "Warranty information" : "");
  const warrantyLinkLabel = productData?.warranty?.link_label ? productData.warranty.link_label : "View policy";

  const emiFacilityInfo = useMemo(() => {
    const rawText = productData?.emi_facility?.text || "";
    if (isDemoMode) return rawText || "EMI information";
    if (/^0% emi facility for 6 months & available emi 36 month for this item$/i.test(rawText.trim())) {
      return "";
    }
    return rawText;
  }, [productData?.emi_facility?.text, isDemoMode]);

  const emiLinkLabel = productData?.emi_facility?.link_label ? productData.emi_facility.link_label : "See EMI Details";

  const exchangeInfo = useMemo(() => {
    const rawText = productData?.exchange?.text || "";
    if (isDemoMode) return rawText || "Exchange information";
    if (/^yes \/ no not available for this item \/ get exchange up to 4000 tk available from$/i.test(rawText.trim())) {
      return "";
    }
    return rawText;
  }, [productData?.exchange?.text, isDemoMode]);

  const exchangeLinkLabel = productData?.exchange?.link_label ? productData.exchange.link_label : "Available Showrooms";
  const madeInText = productData?.made_in_text ? productData.made_in_text : (isDemoMode ? "Product information" : "");

  const breadcrumbs = useMemo(() => {
    const items = [{ label: "Home", href: "/" }];

    // Parent Category
    if (productData?.category_info?.parent_category_name) {
      items.push({
        label: productData.category_info.parent_category_name,
        href: `/category/${productData.category_info.parent_category_slug || '#'}`
      });
    }

    const catSlug = productData?.category_info?.category_slug ||
      (typeof productData?.category === 'object' ? productData.category?.slug : null);

    items.push({
      label: categoryName,
      href: catSlug ? `/category/${catSlug}` : '#'
    });

    // Last item (Product name or just "Product details")
    items.push({ label: "Product details", href: "#" });

    return items;
  }, [productData, categoryName]);



  const parsedAttributes = useMemo(() => {
    const attrs = productData?.attributes;
    if (Array.isArray(attrs)) return attrs;
    if (typeof attrs === 'string') {
      try {
        const parsed = JSON.parse(attrs);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }, [productData?.attributes]);

  const attributesForUi = parsedAttributes.filter((attribute) => {
    return (attribute.values?.length ?? 0) > 0;
  });

  const variants = useMemo(() => productData?.variants ?? [], [productData]);
  const fallbackColorDetails = useMemo(() => {
    let colorsArray: unknown[] = [];
    const colors = productData?.colors as unknown;
    if (Array.isArray(colors)) {
      colorsArray = colors;
    } else if (typeof colors === 'string') {
      try {
        const parsed = JSON.parse(colors);
        if (Array.isArray(parsed)) colorsArray = parsed;
      } catch {
        colorsArray = colors.includes(',') ? colors.split(',') : [colors];
      }
    }
    return colorsArray.map((color) => ({
      name: String(color),
      code: isHexColor(String(color)) ? String(color) : null,
    }));
  }, [productData?.colors]);

  const colorsForUi = useMemo(() => (productData?.color_details?.length ?? 0) > 0
    ? (productData?.color_details ?? [])
    : fallbackColorDetails, [productData?.color_details, fallbackColorDetails]);

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
        image: matchedVariant?.image ?? productData?.thumbnail_image ?? "/images/wm2.png",
      };
    });
  }, [colorsForUi, variants, productData?.thumbnail_image]);

  const activeColorName = selectedColorName || colorOptions[0]?.name || "";
  const selectedVariant = variants.find((variant) => {
    const variantName = toComparable(variant.variant);
    if (!variantName) return false;

    const comparableColor = toComparable(activeColorName);
    if (comparableColor && !(variantName === comparableColor || variantName.startsWith(`${comparableColor}-`))) {
      return false;
    }

    return attributesForUi.every((attribute) => {
      const attributeKey = String(attribute.attribute_id ?? attribute.name ?? "");
      const selectedValue = selectedAttributes[attributeKey];
      if (!selectedValue) return true;
      return variantName.includes(toComparable(selectedValue));
    });
  });

  const selectedSku = selectedVariant?.sku || sku;
  const selectedAvailability = (selectedVariant?.qty ?? productData?.current_stock ?? 0) > 0 ? "In Stock" : "Out of Stock";

  const displayGallery = useMemo(() => {
    const images = new Set<string>();
    const thumb = productData?.thumbnail_image || mainImage || "/images/wm2.png";
    if (thumb) images.add(thumb as string);

    productData?.photos?.forEach((p: { path?: string; photo?: string }) => {
      const img = p.path || p.photo;
      if (img) images.add(img);
    });

    (productData?.variants ?? []).forEach((v: { image?: string }) => {
      if (v.image) images.add(v.image);
    });

    return Array.from(images);
  }, [productData, mainImage]);

  useEffect(() => {
    if (displayGallery.length === 0) return;
    const selectedImage = selectedVariant?.image || colorOptions.find((color) => toComparable(color.name) === toComparable(activeColorName))?.image;
    if (selectedImage) {
      const idx = displayGallery.indexOf(selectedImage);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [activeColorName, selectedVariant, displayGallery, colorOptions]);

  const finalMainImage = displayGallery[activeImageIndex] || displayGallery[0];

  const buildCartPayload = () => {
    const variantName = selectedVariant?.variant || activeColorName || "";
    const uniqueId = variantName ? `${slug}-${variantName}` : (slug || title || "product");
    const isAuction = productData?.auction_product === 1;
    const isEnded = isAuction && productData?.auction_end_date && (Date.now() > Number(productData.auction_end_date) * 1000);
    const isWinner = isEnded && user && Number(user.id) === Number(productData?.highest_bid_user_id);
    const cartPrice = isWinner && productData?.highest_bid 
      ? String(productData.highest_bid) 
      : (price ? String(price).split('/')[0].trim() : "0");

    return {
      id: uniqueId,
      slug: slug,
      title: title || "Product",
      brand: brandName || "Brand",
      image: selectedVariant?.image || finalMainImage || "",
      price: cartPrice,
      originalPrice: isWinner ? cartPrice : (originalPrice ? String(originalPrice).split('/')[0].trim() : "0"),
      discountPercent: isWinner ? "0%" : (discountLabel || "0%"),
      saveAmount: isWinner ? "0" : (saveLabel || "0"),
      color: activeColorName,
      variant: selectedVariant?.variant || "",
      type: category,
      weight: productData?.weight ? `${productData.weight}kg` : "N/A",
      quantity: quantity,
      productId: Number(productData?.id || 0),
    };
  };

  useEffect(() => {
    if (!productData || !productData.id) return;
    if (hasFiredViewItemRef.current === Number(productData.id)) return;

    const variantName = selectedVariant?.variant || activeColorName || "";
    const parsedPrice = cleanPrice(price);

    const hasVariants = !!(
      productData.variants &&
      productData.variants.length > 0 &&
      productData.variants.some((v) => {
        const name = v.variant?.trim().toLowerCase();
        return name && name !== "no variant" && name !== "";
      })
    );

    pushToDataLayer({
      pageType: "product-page",
      productType: hasVariants ? "variable" : "simple",
      event: "view_item",
      ecommerce: {
        currency: "BDT",
        value: parsedPrice,
        items: [{
          id: String(productData.id),
          item_id: String(productData.id),
          item_name: productData.name || title,
          currency: "BDT",
          price: parsedPrice,
          item_brand: productData.brand?.name || brandName,
          item_category: productData.category_info?.parent_category_name || category,
          item_category2: productData.category_info?.parent_category_name ? category : undefined,
          item_variant: variantName,
          quantity: 1
        }]
      }
    });
    hasFiredViewItemRef.current = Number(productData.id);
  }, [productData, slug, selectedVariant, activeColorName, price, title, brandName, category]);



  const handleBuyNow = () => {
    if (!productData) return;
    const cartPayload = buildCartPayload();
    dispatch(addToCart(cartPayload));

    const parsedPrice = cleanPrice(price);

    // Trigger add_to_cart
    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT",
        value: parsedPrice * quantity,
        items: [{
          id: String(cartPayload.productId),
          item_id: String(cartPayload.productId),
          item_name: cartPayload.title,
          currency: "BDT",
          price: parsedPrice,
          item_brand: cartPayload.brand,
          item_category: productData.category_info?.parent_category_name || cartPayload.type,
          item_category2: productData.category_info?.parent_category_name ? cartPayload.type : undefined,
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
      dispatch(removeFromWishlistAsync(slug));
    } else {
      const item: WishlistItem = {
        id: slug,
        productId: Number(productData?.id || 0),
        title,
        brand: brandName,
        image: finalMainImage,
        price,
        originalPrice,
        discountLabel,
        saveAmount: saveLabel,
        color: activeColorName,
        type: category,
        weight: productData?.weight ? `${productData.weight}kg` : "N/A",
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

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-4 pt-6">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-16 rounded-lg" />
            </div>
            <div className="pt-8 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error || "Product not found"}</p>
          <p className="text-gray-600 mt-2">The product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[118px] md:pb-0 ">
      <section className="  mt-16  ">
        <div className="mb-3 px-4 lg:hidden">
          <MobileBackButton />
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mb-3 hidden lg:flex items-center gap-2 lg:text-sm text-[12px] leading-none text-slate-500 px-4 md:px-0"
        >
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">›</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={index === breadcrumbs.length - 1 ? "text-slate-700" : ""}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        <div className="mx-auto mt-2 w-11/12">
          <div className="flex flex-col gap-2 lg:gap-6 lg:flex-row">
            <div className="w-full space-y-3 lg:w-[53%]">
              <div
                className="relative rounded-2xl border border-slate-200 bg-white p-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
              >
                {isHovered && (
                  <div
                    className="absolute border border-slate-500 bg-black/10 pointer-events-none z-20"
                    style={{
                      left: `${lensPosition.x}px`,
                      top: `${lensPosition.y}px`,
                      width: '30%',
                      height: '22%',
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 transition-colors md:hidden"
                >
                  <FaPlus className="h-3 w-3" />
                </button>


                <div className="relative mx-auto min-h-[250px] max-w-[520px] sm:min-h-[320px] md:min-h-[700px]">
                  <MobileProductGallery
                    images={displayGallery}
                    title={title}
                    warrantyBadgeImage={warrantyBadgeImage}
                    onImageClick={(index) => {
                      setActiveImageIndex(index);
                      setIsZoomModalOpen(true);
                    }}
                  />

                  <div
                    className="hidden items-center justify-center md:flex md:min-h-[700px] overflow-hidden relative cursor-zoom-in"
                  >
                    <Image
                      src={finalMainImage}
                      alt={title}
                      width={520}
                      height={520}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>


                  <Image
                    src={warrantyBadgeImage}
                    alt="Official warranty"
                    width={120}
                    height={120}
                    className="absolute bottom-2 left-2 hidden h-28 w-28 object-contain md:block pointer-events-none"
                  />
                </div>
              </div>

              <div className="relative hidden md:flex items-center group">
                {displayGallery.length > 5 && (
                  <button
                    type="button"
                    onClick={() => scrollThumbnails('left')}
                    className="absolute -left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                  >
                    <FaChevronLeft className="h-4 w-4 text-slate-600" />
                  </button>
                )}

                <div
                  ref={thumbnailContainerRef}
                  className="flex gap-2 overflow-x-hidden scroll-smooth w-full px-1"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {displayGallery.map((item, index) => (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-[calc(20%-0.4rem)] rounded-2xl border p-2 transition-all ${index === activeImageIndex ? "border-slate-700 bg-slate-100 ring-2 ring-blue-500" : "border-slate-200 bg-white hover:border-slate-400"}`}
                    >
                      <Image
                        src={item}
                        alt={`${title} preview ${index + 1}`}
                        width={92}
                        height={92}
                        className="mx-auto h-20 w-20 object-contain md:h-28 md:w-28"
                      />
                    </button>
                  ))}
                </div>

                {displayGallery.length > 5 && (
                  <button
                    type="button"
                    onClick={() => scrollThumbnails('right')}
                    className="absolute -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                  >
                    <FaChevronRight className="h-4 w-4 text-slate-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full lg:space-y-3 space-y-2  lg:w-[47%] relative">
              {/* Zoom Preview Panel (overlaps right-side details) */}
              {isHovered && (
                <div
                  className="hidden md:block absolute top-0 left-0 w-[400px] h-[400px] border border-black rounded-2xl bg-white shadow-2xl z-[99] overflow-hidden pointer-events-none"
                >
                  <div
                    className="relative origin-top-left border border-slate-200 bg-white p-4"
                    style={{
                      width: `${containerSize.width}px`,
                      height: `${containerSize.height}px`,
                      transform: `scale(${400 / (containerSize.width * 0.3)}) translate(${-lensPosition.x}px, ${-lensPosition.y}px)`,
                    }}
                  >
                    <div className="relative mx-auto min-h-[250px] max-w-[520px] sm:min-h-[320px] md:min-h-[700px]">
                      <div
                        className="hidden items-center justify-center md:flex md:min-h-[700px] overflow-hidden relative"
                      >
                        <Image
                          src={finalMainImage}
                          alt={title}
                          width={520}
                          height={520}
                          className="h-auto w-full object-contain"
                          priority
                        />
                      </div>
                      <Image
                        src={warrantyBadgeImage}
                        alt="Official warranty"
                        width={120}
                        height={120}
                        className="absolute bottom-2 left-2 hidden h-28 w-28 object-contain md:block"
                      />
                    </div>
                  </div>
                </div>
              )}
              <p className="text-[12px] lg:text-[18px]  text-slate-600">{categoryName}</p>
              <h1 className="text-[16px] lg:text-3xl font-semibold leading-tight text-slate-900">{title}</h1>

              <div className="space-y-1 text-[12px] text-slate-500 lg:hidden">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Image src={brandLogo} alt={brandName} width={60} height={24} className="h-4 w-auto object-contain" />
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5" />
                    <FaStar className="h-2.5 w-2.5 text-slate-300" />
                    <span className="ml-0.5 text-slate-500">{ratingCount}</span>
                  </div>
                  {model && (
                    <>
                      <span>|</span>
                      <span>Model : {model}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap">
                  {selectedSku && (
                    <>
                      <span>SKU : {selectedSku}</span>
                      <span>|</span>
                    </>
                  )}
                  <span className="text-[#0A67C8]">{selectedAvailability}</span>
                </div>
              </div>

              <div className="hidden flex-wrap items-center gap-3 text-sm text-slate-500 lg:flex">
                <Image src={brandLogo} alt={brandName} width={60} height={24} className="h-6 w-auto object-contain" />
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3" />
                  <FaStar className="h-3 w-3 text-slate-300" />
                  <span className="ml-1 text-slate-500">{ratingCount}</span>
                </div>
                {model && (
                  <>
                    <span>|</span>
                    <span>Model : {model}</span>
                  </>
                )}
                {selectedSku && (
                  <>
                    <span>|</span>
                    <span>SKU : {selectedSku}</span>
                  </>
                )}
                <span>|</span>
                <span className="text-[#0A67C8]">{selectedAvailability}</span>
              </div>

              



              

              {(featuresList.length > 0 || isDemoMode) && (
                <div className="text-[14px] text-slate-700 hidden lg:block space-y-1">
                  {featuresList && featuresList.length > 0 ? (
                    <>
                      {featuresList.slice(0, 4).map((feature, index) => (
                        <p key={`${feature}-${index}`}>
                          • {feature}
                        </p>
                      ))}
                      {featuresList.length > 4 && (
                        <button type="button" className="ml-3 text-[12px] font-semibold text-[#0C73DA] hover:underline">
                          See More Features
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-400">No features available</p>
                  )}
                </div>
              )}

              
              {/* Countdown Timer Block */}
              <div className="py-2 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-semibold text-slate-800 pb-1 border-b-2 border-[#0081FF] w-12 text-center">{timeLeft.days}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Days</span>
                  </div>
                  <span className="text-xl font-bold text-slate-400 -mt-4">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-semibold text-slate-800 pb-1 border-b-2 border-[#0081FF] w-12 text-center">{timeLeft.hours}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Hour</span>
                  </div>
                  <span className="text-xl font-bold text-slate-400 -mt-4">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-semibold text-slate-800 pb-1 border-b-2 border-[#0081FF] w-12 text-center">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Minute</span>
                  </div>
                  <span className="text-xl font-bold text-slate-400 -mt-4">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl lg:text-3xl font-semibold text-slate-800 pb-1 border-b-2 border-[#0081FF] w-12 text-center">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Second</span>
                  </div>
                </div>
                {formattedEndDate && (
                  <p className="text-[14px] text-slate-400 mt-4 font-medium">
                    Auction Ends: {formattedEndDate}
                  </p>
                )}
              </div>

              {/* Bids and Views Counter Row */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 py-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-[#E88E00]">
                  <FaGavel className="h-4 w-4" />
                  <span>Bids : {productData?.total_bids ? String(productData.total_bids).padStart(2, '0') : '00'}</span>
                </div>
                <span className="text-slate-200">|</span>
                <div className="flex items-center gap-1.5 text-[#F13D36]">
                  <FaEye className="h-4 w-4" />
                  <span>Views : {productData?.views ? Number(productData.views).toLocaleString() : '1,326'}</span>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pb-4 border-b border-slate-100">
                <button 
                  type="button" 
                  onClick={handleToggleWishlist} 
                  className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                >
                  <FaHeart className={`h-4 w-4 ${isWishlisted ? "text-red-500" : "text-slate-400"}`} />
                  <span>Wishlist</span>
                </button>
                <button 
                  type="button" 
                  className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                >
                  <FaRegShareSquare className="h-4 w-4 text-slate-400" />
                  <span>Share</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    const el = document.getElementById('product-details-tabs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="text-[#0C73DA] hover:underline"
                >
                  Biding product policy
                </button>
              </div>

              {/* Bid Section */}
              <div className="space-y-4">
                {(() => {
                  const now = Date.now();
                  const auctionStartMs = productData?.auction_start_date ? Number(productData.auction_start_date) * 1000 : 0;
                  const auctionEndMs = productData?.auction_end_date ? Number(productData.auction_end_date) * 1000 : 0;
                  const isUpcoming = now < auctionStartMs;
                  const isEnded = now >= auctionEndMs;
                  const isWinner = isEnded && user && Number(user.id) === Number(productData?.highest_bid_user_id);

                  if (isEnded) {
                    if (isWinner) {
                      return (
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-4 max-w-[400px]">
                          <div className="text-emerald-800">
                            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                              🎉 Congratulations!
                            </h4>
                            <p className="text-sm leading-relaxed">
                              You won this auction with a winning bid of <strong className="text-emerald-950 font-semibold">৳ {Number(productData?.highest_bid || 0).toLocaleString()}</strong>.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleBuyNow}
                            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3 text-sm font-semibold transition-colors shadow-sm"
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-[400px]">
                          <p className="text-sm font-medium text-slate-500">
                            This auction has ended.
                          </p>
                        </div>
                      );
                    }
                  }

                  if (isUpcoming) {
                    return (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-[400px] space-y-1">
                        <p className="text-sm font-semibold text-slate-800">
                          Auction Starts Soon
                        </p>
                        <p className="text-xs text-slate-500">
                          Bidding will open on {formattedStartDate}
                        </p>
                      </div>
                    );
                  }

                  // Default Active Bidding Form
                  const userBid = productData?.user_bid_amount ? Number(productData.user_bid_amount) : null;
                  const highestBidVal = Number(productData?.highest_bid || productData?.starting_bid || 0);
                  const isUserHighest = userBid && userBid >= highestBidVal;

                  return (
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-bold text-slate-800">
                          Starting From : ৳ {productData?.highest_bid?.toLocaleString() || productData?.starting_bid?.toLocaleString() || '56,500'}
                        </p>
                        {userBid && (
                          <div className="text-xs font-semibold flex items-center gap-1.5 mt-1">
                            <span className="text-slate-500">Your Bid:</span>
                            <span className="text-slate-900">৳ {userBid.toLocaleString()}</span>
                            {isUserHighest ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">Highest Bid</span>
                            ) : (
                              <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-bold">Outbid</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 max-w-[400px]">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="Start your bid"
                          className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handlePlaceBid}
                          className="w-full rounded-full bg-[#0081FF] py-2 text-sm font-semibold text-white hover:bg-[#0070DF] active:bg-[#0060CF] transition-colors shadow-sm"
                        >
                          Place Your Bid
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {(isDemoMode || (shippingInfo || warrantyInfo || emiFacilityInfo || exchangeInfo || showroomTitle || (specialOffers && specialOffers.length > 0))) && (
                <MobileOfferDetails
                  productData={{
                    special_offers: specialOffers,
                    special_offer_title: specialOfferTitle
                  }}
                  specialOfferTitle={specialOfferTitle || specialOfferLeft}
                  shippingInfo={shippingInfo}
                  warrantyInfo={warrantyInfo}
                  emiFacilityInfo={emiFacilityInfo}
                  exchangeInfo={exchangeInfo}
                />
              )}

              {(isDemoMode || (madeInText || (features && features.length > 0))) && (
                <MobileMadeInFeatures madeInText={madeInText} features={features} />
              )}

              {(productData?.show_free_delivery !== false ||
                productData?.show_free_installation !== false ||
                productData?.show_cash_on_delivery !== false ||
                productData?.show_after_sales_service !== false) && (
                  <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-x-3 lg:gap-y-2 lg:py-1 lg:text-md lg:text-slate-600">
                    {productData?.show_free_delivery !== false && (
                      <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                        <Image src="/images/freedelivery.png" alt="Free delivery" width={20} height={20} className="h-5 w-5 object-contain" />
                        Free Delivery
                      </p>
                    )}
                    {productData?.show_free_installation !== false && (
                      <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                        <Image src="/images/freeinstalation.png" alt="Free installation" width={20} height={20} className="h-5 w-5 object-contain" />
                        Free Installation
                      </p>
                    )}
                    {productData?.show_cash_on_delivery !== false && (
                      <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                        <Image src="/images/cashondelivery.png" alt="Cash on delivery" width={20} height={20} className="h-5 w-5 object-contain" />
                        Cash on delivery
                      </p>
                    )}
                    {productData?.show_after_sales_service !== false && (
                      <p className="mr-0 flex shrink-0 items-center gap-1.5 border-r border-slate-300 pr-3 last:border-r-0 last:pr-0 lg:mr-4 lg:gap-2 lg:border-r-2 lg:pr-4">
                        <Image src="/images/salesservice.png" alt="After sales service" width={20} height={20} className="h-5 w-5 object-contain" />
                        After sales service
                      </p>
                    )}
                  </div>
                )}

              {((specialOffers?.length ?? 0) > 0 || isDemoMode) && (
                (specialOffers?.length ?? 0) > 0 ? (
                  <div className="hidden lg:inline-flex lg:w-fit lg:max-w-full lg:flex-wrap lg:items-center lg:gap-2 lg:rounded-lg lg:border lg:border-[#2F7FE8] lg:px-3 lg:py-2 lg:text-sm lg:text-slate-900">
                    <span className="whitespace-nowrap text-[15px] font-semibold text-[#0C73DA] md:text-sm">*{specialOfferTitle || specialOfferLeft} =</span>

                    {specialOffers?.map((offer, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="h-6 w-px bg-slate-500/60" aria-hidden="true" />}
                        <span className="flex items-center gap-2 whitespace-nowrap text-[15px] md:text-sm">
                          {offer.image ? (
                            <Image src={offer.image} alt={offer.text || `Offer ${index + 1}`} width={40} height={24} className="h-6 w-auto object-contain" />
                          ) : null}
                          {offer.text}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="hidden lg:inline-flex lg:w-fit lg:max-w-full lg:flex-wrap lg:items-center lg:gap-2 lg:rounded-lg lg:border lg:border-[#2F7FE8] lg:px-3 lg:py-2 lg:text-sm lg:text-slate-900">
                    <span className="whitespace-nowrap text-[15px] font-semibold text-[#0C73DA] md:text-sm">*{specialOfferLeft} =</span>

                    <span className="h-6 w-px bg-slate-500/60" aria-hidden="true" />

                    <span className="flex items-center gap-2 whitespace-nowrap text-[15px] md:text-sm">
                      <Image src="/images/ebl.png" alt="EBL" width={40} height={24} className="h-6 w-auto object-contain" />
                      {specialOfferOne}
                    </span>

                    <span className="h-6 w-px bg-slate-500/60" aria-hidden="true" />

                    <span className="flex items-center gap-2 whitespace-nowrap text-[15px] md:text-sm">
                      <Image src="/images/nogod.png" alt="Nagad" width={40} height={24} className="h-6 w-auto object-contain" />
                      {specialOfferTwo}
                    </span>
                  </div>
                )
              )}

              {(isDemoMode || (shippingInfo || warrantyInfo || emiFacilityInfo || exchangeInfo)) && (
                <div className="hidden lg:block lg:space-y-2 lg:border-b lg:border-slate-200 lg:pb-3 lg:text-xs lg:text-slate-600 lg:md:text-sm">
                  {(isDemoMode || shippingInfo) && (
                    <p className="flex items-center gap-5">
                      <Image src="/images/shippingtime.png" alt="Shipping time" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                      <span>Shipping Timeline:</span>{shippingInfo}
                    </p>
                  )}
                  {(isDemoMode || warrantyInfo) && (
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-5">
                        <Image src="/images/warranty.png" alt="Warranty" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                        {warrantyInfo}
                      </span>
                      <button type="button" className="whitespace-nowrap text-[#0C73DA] text-xs md:text-sm font-medium hover:underline">{warrantyLinkLabel}</button>
                    </p>
                  )}
                  {(isDemoMode || emiFacilityInfo) && (
                    <p className="flex items-center gap-5">
                      <Image src="/images/Vector.png" alt="EMI facility" width={24} height={24} unoptimized className="h-7 w-7 object-contain" />
                      {emiFacilityInfo}
                      <button type="button" className="whitespace-nowrap text-[#0C73DA] text-xs md:text-sm font-medium hover:underline">{emiLinkLabel}</button>
                    </p>
                  )}
                  {(isDemoMode || exchangeInfo) && (
                    <p className="flex flex-wrap items-start gap-2">
                      <Image src="/images/exchange.png" alt="Exchange" width={24} height={24} unoptimized className="h-7 w-7 object-contain flex-shrink-0" />
                      <span className="flex-1 pt-0.5">{exchangeInfo}</span>
                      <button type="button" className="whitespace-nowrap text-[#0C73DA] text-xs md:text-sm font-medium hover:underline flex-shrink-0">{exchangeLinkLabel}</button>
                    </p>
                  )}
                </div>
              )}

              {(isDemoMode || madeInText) && (
                <p className="hidden rounded bg-slate-100 py-1 text-center text-lg font-medium text-[#0C73DA] lg:block">
                  {madeInText}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductDetailsTabs
        title={`${title} | ${model}`}
        descriptionHtml={descriptionHtml}
        specifications={productData?.specifications ?? []}
        featureSections={productData?.featured_specs ?? []}
        policyTitle={productData?.product_policy?.title ?? 'Product Policy'}
        policyContent={productData?.product_policy?.content ?? ''}
        reviews={productData?.reviews as ProductData['reviews']}
      />



      <FooterBreadcrumbPortal>
        <div className="">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[12px] leading-none text-slate-500"
          >
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-slate-400">›</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? "text-slate-700" : ""}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </FooterBreadcrumbPortal>

      <CartSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        productName={title || "Product"}
        productImage={finalMainImage}
        productPrice={price}
        productOriginalPrice={originalPrice}
      />

      <HigherSaleModal
        isOpen={isHigherSaleModalOpen}
        onClose={() => setIsHigherSaleModalOpen(false)}
        productId={Number(productData?.id || 0)}
        productName={title || "Product"}
      />
      <BankEmiModal
        isOpen={isBankEmiModalOpen}
        onClose={() => setIsBankEmiModalOpen(false)}
        emiPlans={productData?.emi_plans || []}
        productName={title}
        productSlug={productData?.slug}
      />

      <ProductImageZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={displayGallery}
        initialIndex={activeImageIndex}
        altText={title}
      />
    </div>
  );
}
