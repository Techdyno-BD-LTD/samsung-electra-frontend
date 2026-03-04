import ProductCard from "@/components/common/ProductCard";
import { getRouteMetadata } from "@/lib/metadata";
import products from "@/database/products.json";

export const metadata = getRouteMetadata("products");

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Catalog</p>
        <h1 className="text-4xl font-semibold text-slate-900">Modular experiences</h1>
        <p className="text-slate-500">
          Preview the flagship concepts rolling out on Electra Commerce. Every product syncs with the Electra OS for
          frictionless returns, upgrades, and subscriptions.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            brand={product.brand}
            title={product.title}
            image={product.image}
            rating={product.rating}
            ratingCount={product.ratingCount}
            type={product.type}
            weight={product.weight}
            color={product.color}
            price={product.price}
            originalPrice={product.originalPrice}
            discountPercent={product.discountPercent}
            saveAmount={product.saveAmount}
            emiPrice={product.emiPrice}
            emiMonths={product.emiMonths}
            isSale={product.isSale}
            hasWarranty={product.hasWarranty}
            tags={product.tags}
          />
        ))}
      </div>
    </div>
  );
}
