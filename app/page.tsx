
import { getRouteMetadata } from "@/lib/metadata";
import ProductCard from "@/components/common/ProductCard";

export const metadata = getRouteMetadata("home");

// Sample product data
const sampleProduct = {
  id: 1,
  brand: "Haier",
  brandLogo: "/images/brands/haier.png",
  productImage: "/images/products/washing-machine.jpg",
  badge: "Hot",
  emiInfo: "36 EMI",
  officialWarranty: true,
  productType: "Front Loading",
  rating: 3.0,
  reviews: 15,
  specifications: "85KG | White",
  name: "Haier Front Loading Washing Machine - HW90-BP14959S8 | 9KG",
  emiDetails: "EMI From 14330 Tk/month",
  currentPrice: "৳ 1,50,000",
  originalPrice: "৳ 1,80,000",
  discountPercentage: "-10% Off",
  savings: "৳30,00%",
  deliveryOptions: ["Cash On Delivery", "0% EMI", "Free Delivery"]
};

export default function Home() {
  return (
    <div className="space-y-16">
      <section className=" mx-auto  py-8 mt-24">
        <h1 className="text-3xl font-bold text-center mb-8">Featured Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
          <ProductCard product={sampleProduct} />
        </div>
      </section>
    </div>
  );
}
