import ProductCard from "@/components/common/ProductCard";
import products from "@/database/products.json";

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 5);
  const mobileSlides = Array.from({ length: Math.ceil(featuredProducts.length / 2) }, (_, index) =>
    featuredProducts.slice(index * 2, index * 2 + 2)
  );

  return (
    <section className="mx-auto  space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Flagship lineup</p>
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Featured drops</h2>
        <p className="max-w-2xl text-slate-500">
          Crafted hardware, curated experiences, and limited colorways for design-forward shoppers.
        </p>
      </div>

      {/* Mobile slider: each snap page contains 2 cards in one row */}
      <div className="sm:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3">
          {mobileSlides.map((slide, index) => (
            <div key={index} className="min-w-full snap-start grid grid-cols-2 gap-3 items-start">
              {slide.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
              {slide.length === 1 && <div aria-hidden className="invisible" />}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 items-start">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
