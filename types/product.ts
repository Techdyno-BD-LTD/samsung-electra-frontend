export interface Product {
  id: number;
  slug: string;
  name: string;
  category_id: number;
  category: {
    name: string;
    slug: string;
  };
  weight: number;
  model_number: string;
  connection_type: string;
  thumbnail_image: string;
  price_high_low: string;
  has_discount: boolean;
  discount: string;
  stroked_price: string;
  main_price: string;
  calculable_price: number;
  rating: number;
  rating_count: number;
  sales: number;
  current_stock: number;
  unit: string;
  emi_start: string;
  links: {
    details: string;
  };
  variants: Array<{
    variant: string;
    price: number;
    sku: string;
    qty: number;
    image: string | null;
  }>;
  other_features: string;
  tags: string[];
  badge_tag?: string;
  badge_value?: string;
  product_sold?: number;
  [key: string]: any;
}
