type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  badge?: string;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg shadow-slate-200/40 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
          <span>SKU-{product.id.toString().padStart(3, "0")}</span>
          {product.badge && (
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
              {product.badge}
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-500">{product.description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-lg font-bold text-slate-900">{product.price}</p>
        <button className="text-sm font-semibold text-slate-900 underline-offset-4 transition hover:underline">
          View details
        </button>
      </div>
    </article>
  );
}
