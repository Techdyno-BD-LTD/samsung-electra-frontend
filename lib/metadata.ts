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
    description: "Next-gen connected retail operating system for Samsung Bangladesh.",
    image: "/og/default.png",
  },
  home: {
    title: "Samsung Electra",
    description: "Bold connected retail experiences for Samsung Bangladesh.",
    image: "/og/home.png",
  },
  products: {
    title: "Products | Electra",
    description: "Explore curated devices, smart appliances, and concept drops.",
    image: "/og/products.png",
  },
  login: {
    title: "Login | Electra",
    description: "Access your Electra commerce workspace.",
  },
  register: {
    title: "Register | Electra",
    description: "Create an Electra account to launch premium retail experiences.",
  },
  "product-detail": {
    title: "Product Detail | Electra",
    description: "Dive into Electra flagship hardware specifications and highlights.",
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
