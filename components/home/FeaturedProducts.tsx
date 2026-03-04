import ProductCard from "@/components/common/ProductCard";
import products from "@/database/products.json";

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 5);

  return (
    <section className="mx-auto  space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Flagship lineup</p>
        <h2 className="text-3xl font-semibold text-slate-900">Featured drops</h2>
        <p className="max-w-2xl text-slate-500">
          Crafted hardware, curated experiences, and limited colorways for design-forward shoppers.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 items-start">
        {featuredProducts.map((product) => (
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
    </section>
  );
}
