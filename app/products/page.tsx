import ProductCard from "@/components/common/ProductCard";
import { getRouteMetadata } from "@/lib/metadata";

const catalog = [
  {
    id: 11,
    name: "Volt Suitcase",
    description: "Self-charging carry-on with modular battery bricks and proximity alerts.",
    price: "$429",
    badge: "Ships in 48h",
  },
  {
    id: 12,
    name: "Pulse Strap",
    description: "Adaptive haptics for smart home gestures and notification triage.",
    price: "$269",
  },
  {
    id: 13,
    name: "Lumen Desk",
    description: "Height-adjustable desk with embedded MagSafe charging layer.",
    price: "$1199",
  },
  {
    id: 14,
    name: "Flux Monitor",
    description: "Ultra-thin QD-OLED with ambient bias lighting synced to on-screen color.",
    price: "$1499",
    badge: "Limited",
  },
];

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
      <div className="grid gap-6 md:grid-cols-2">
        {catalog.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
