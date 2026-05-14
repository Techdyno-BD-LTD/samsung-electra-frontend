import type { Metadata } from "next";

export type RouteMetadataKey =
  | "root"
  | "home"
  | "products"
  | "login"
  | "register"
  | "product-detail"
  | (string & {});

export type RouteMetadata = {
  title: string;
  description: string;
  image?: string;
};

export const metadataRegistry: Record<RouteMetadataKey, RouteMetadata> = {
  root: {
    title: "Samsung Electra",
    description: "Your one-stop destination for Samsung smartphones, home appliances, and consumer electronics in Bangladesh.",
    image: "/og/default.png",
  },
  home: {
    title: "Samsung Electra | Official Retail Operating System",
    description: "Experience the best of Samsung with Electra. Shop smartphones, refrigerators, ACs, and more with official warranty and flexible payment options.",
    image: "/og/home.png",
  },
  products: {
    title: "All Products | Samsung Electra",
    description: "Browse our wide range of Samsung devices and appliances. Quality products with trusted service and official warranty.",
    image: "/og/products.png",
  },
  login: {
    title: "Login | Samsung Electra",
    description: "Access your account to manage orders, track shipments, and view your wishlist.",
  },
  register: {
    title: "Register | Samsung Electra",
    description: "Create an account to start shopping and enjoy exclusive benefits at Samsung Electra.",
  },
  "product-detail": {
    title: "Product Details | Samsung Electra",
    description: "View detailed specifications, features, and pricing for Samsung products.",
  },
};

export function getRouteMetadata(key: RouteMetadataKey, overrides?: Partial<RouteMetadata>): Metadata {
  const base = metadataRegistry[key] ?? metadataRegistry.root;
  const title = overrides?.title ?? base.title;
  const description = overrides?.description ?? base.description;
  const image = overrides?.image ?? base.image ?? metadataRegistry.root.image ?? "/og/default.png";
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function withDynamicMetadata<TContext extends Record<string, unknown>>(
  key: RouteMetadataKey,
  getOverrides?: (context: TContext) => Partial<RouteMetadata> | Promise<Partial<RouteMetadata>>
) {
  return async (context: TContext) => {
    const overrides = await getOverrides?.(context);
    return getRouteMetadata(key, overrides);
  };
}

export function registerRouteMetadata(key: RouteMetadataKey, metadata: RouteMetadata) {
  metadataRegistry[key] = metadata;
}
export async function getGlobalSettings() {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const systemKey = process.env.API_SYSTEM_KEY || '';
    try {
        const res = await fetch(`${baseUrl}/api/v2/business-settings`, {
            headers: { 'x-system-key': systemKey },
            next: { revalidate: 3600 }
        });
        const json = await res.json();
        return json.data || [];
    } catch (e) {
        return [];
    }
}
