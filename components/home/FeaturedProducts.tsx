import ProductCard from "@/components/common/ProductCard";

const products = [
  {
    id: 1,
    name: "Galaxy Arc Pods",
    description: "Adaptive earbuds that recalibrate EQ based on ambient noise.",
    price: "$189",
    badge: "Top Seller",
  },
  {
    id: 2,
    name: "Electra Beam Projector",
    description: "Pocket-sized 4K projector with ultra-short throw lens.",
    price: "$649",
    badge: "New",
  },
  {
    id: 3,
    name: "SmartFrame 2",
    description: "Modular display that magnetically docks to expand canvas.",
    price: "$999",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Flagship lineup</p>
        <h2 className="text-3xl font-semibold text-slate-900">Featured drops</h2>
        <p className="max-w-2xl text-slate-500">
          Crafted hardware, curated experiences, and limited colorways for design-forward shoppers.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
