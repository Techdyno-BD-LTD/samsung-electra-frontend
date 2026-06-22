import { parseCurrency } from "./currencyUtils";

// Helper type for checkout items
export interface GTMItem {
  id: string | number;
  slug?: string;
  title: string;
  price: string | number;
  brand?: string;
  type?: string;
  variant?: string;
  color?: string;
  quantity: number;
}

// Client-side SHA-256 helper for data privacy
export async function hashSHA256(message: string): Promise<string> {
  const msg = message.trim().toLowerCase();
  if (!msg) return "";
  try {
    const msgBuffer = new TextEncoder().encode(msg);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (err) {
    console.error("SHA-256 hashing error:", err);
    return "";
  }
}

// Fetch client public IP address
export async function fetchClientIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const json = await res.json();
    return json.ip || "";
  } catch {
    return "";
  }
}

let uniqueEventIdCounter = 1;

// Safely push to dataLayer
export function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    if (!("gtm.uniqueEventId" in payload)) {
      payload["gtm.uniqueEventId"] = uniqueEventIdCounter++;
    }
    window.dataLayer.push(payload);
  }
}

// Parse value securely to number
export function cleanPrice(value: string | number): number {
  if (typeof value === "number") return value;
  return parseCurrency(value);
}

// Format items for GA4 ecommerce
export function formatGTMItems(items: GTMItem[]) {
  return items.map((item) => ({
    item_id: item.slug || String(item.id),
    item_name: item.title,
    price: cleanPrice(item.price),
    item_brand: item.brand || "Samsung",
    item_category: item.type || "Uncategorized",
    item_variant: item.variant || item.color || "",
    quantity: item.quantity,
  }));
}
