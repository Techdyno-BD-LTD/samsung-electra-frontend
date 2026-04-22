import { toProductSlug } from "@/lib/productSlug";
import allProducts from "@/database/products.json";
import washingMachineProducts from "@/database/washingmachineproducts.json";
import refrigeratorProducts from "@/database/refrigeratorproducts.json";
import airConditionerProducts from "@/database/airconditionerproducts.json";
import microwaveProducts from "@/database/microwaveproducts.json";

export type ProductSearchItem = {
  id: string;
  title: string;
  brand: string;
  brandLogo?: string;
  image: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  saveAmount: string;
  category?: string;
  type?: string;
  weight?: string;
  color?: string;
  rating?: number;
  ratingCount?: string;
};

type RawProduct = {
  title?: string;
  brand?: string;
  brandLogo?: string;
  image?: string;
  price?: string;
  originalPrice?: string;
  discountPercent?: string;
  saveAmount?: string;
  category?: string;
  type?: string;
  weight?: string;
  color?: string;
  rating?: number;
  ratingCount?: string;
};

function normalize(raw: RawProduct, fallbackCategory?: string): ProductSearchItem {
  const title = raw.title?.trim() || "Product";
  return {
    id: toProductSlug(title),
    title,
    brand: raw.brand || "",
    brandLogo: raw.brandLogo,
    image: raw.image || "/images/wm2.png",
    price: raw.price || "",
    originalPrice: raw.originalPrice || "",
    discountPercent: raw.discountPercent || "",
    saveAmount: raw.saveAmount || "",
    category: raw.category || fallbackCategory || "",
    type: raw.type || "",
    weight: raw.weight || "",
    color: raw.color || "",
    rating: raw.rating,
    ratingCount: raw.ratingCount || "",
  };
}

const mergedRaw = [
  ...(allProducts as RawProduct[]),
  ...(washingMachineProducts as RawProduct[]),
  ...(refrigeratorProducts as RawProduct[]),
  ...(airConditionerProducts as RawProduct[]),
  ...(microwaveProducts as RawProduct[]),
];

const dedupedMap = new Map<string, ProductSearchItem>();
mergedRaw.forEach((raw) => {
  const normalized = normalize(raw);
  if (!dedupedMap.has(normalized.id)) {
    dedupedMap.set(normalized.id, normalized);
  }
});

export const productSearchCatalog = Array.from(dedupedMap.values());

export function searchProducts(query: string, limit = 8): ProductSearchItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return productSearchCatalog
    .filter((item) => {
      const haystack = `${item.title} ${item.brand} ${item.category} ${item.type}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .slice(0, limit);
}

function extractModel(title: string): string {
  const dashPart = title.split("-").slice(1).join("-").trim();
  if (!dashPart) {
    return title;
  }
  return dashPart.split("|")[0].trim();
}

export function buildCompareAttributes(item: ProductSearchItem): Record<string, string> {
  const category = (item.category || "").toLowerCase();

  const common: Record<string, string> = {
    Brand: item.brand || "-",
    Model: extractModel(item.title),
    Category: item.category || "-",
    Type: item.type || "-",
    Capacity: item.weight || "-",
    Color: item.color || "-",
  };

  if (category.includes("washing")) {
    return {
      ...common,
      "Speed Settings": "3 with Incher",
      RPM: "20000 Approx at No Load",
      "Motor Power": "750W",
      Voltage: "230V",
    };
  }

  if (category.includes("refrigerator")) {
    return {
      ...common,
      Compressor: "Digital Inverter",
      "Cooling Type": "Frost Free",
      Refrigerant: "R600a",
      "Door Type": item.type || "Double Door",
      Voltage: "220V-240V",
    };
  }

  if (category.includes("air conditioner") || category.includes("ac")) {
    return {
      ...common,
      "Cooling Capacity": item.weight || "12000 BTU",
      Compressor: "Inverter",
      Refrigerant: "R32",
      "Power Input": "1450W",
      Voltage: "220V-240V",
    };
  }

  if (category.includes("microwave")) {
    return {
      ...common,
      "Oven Capacity": item.weight || "30L",
      "Power Output": "900W",
      Grill: "Yes",
      Convection: "Yes",
      Voltage: "220V-240V",
    };
  }

  return common;
}
