import Image from "next/image";
import Button from "@/components/ui/Button";
import { withDynamicMetadata } from "@/lib/metadata";

const productLibrary = {
  "samsung-refrigerator-rt31cg5424s9ss--305ltr": {
    title: "Samsung Refrigerator RT31CG5424S9/SS (305Ltr)",
    sku: "RT31CG5424S9/SS",
    price: 89990,
    capacity: "305 Liters",
    cooling: "Digital Inverter Compressor",
    color: "Refined Inox",
    energy: "5 Star | 230V",
    warranty: "10 Years on Compressor",
    highlights: [
      "Twin Cooling Plus keeps humidity optimal in both fridge and freezer",
      "Power Cool technology chills groceries 31% faster",
      "AI Inverter compressor adjusts automatically to usage patterns",
      "SmartThings integration for diagnostics and vacation mode",
    ],
    description:
      "The RT31CG5424S9/SS is engineered for Bangladeshi kitchens with a minimalist, brushed finish and space-saving door bins. Its convertible freezer unlocks flexible storage, while the Digital Inverter compressor keeps sound and energy consumption ultra-low.",
    image:
      "https://images.samsung.com/is/image/samsung/p6pim/bd/rt31cg5424s9ss/gallery/bd-top-mount-freezer-rt31cg5424s9-rt31cg5424s9-534717984?$650_519_PNG$",
    availability: "In Stock",
    delivery: "Delivered in Dhaka within 48 hours",
  },
} as const;

type ProductKey = keyof typeof productLibrary;

type PageProps = {
  params: { slug: string };
};

export const generateMetadata = withDynamicMetadata<{ params: { slug: string } }>(
  "product-detail",
  ({ params }) => {
    const key = params.slug as ProductKey;
    const product = productLibrary[key];
    if (!product) {
      return {
        title: "Product not found | Electra",
        description: "We can't locate the requested product right now.",
      };
    }

    return {
      title: `${product.title} | Electra`,
      description: product.description,
      image: product.image,
    };
  }
);

export async function generateStaticParams() {
  return Object.keys(productLibrary).map((slug) => ({ slug }));
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = productLibrary[params.slug as ProductKey];

  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">Product not found</h1>
        <p className="text-slate-500">We couldn&apos;t locate this product slug. Please verify the URL.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="grid gap-8 rounded-3xl bg-white/80 p-8 shadow-2xl shadow-slate-200 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Electra Exclusive</p>
          <h1 className="text-4xl font-semibold text-slate-900">{product.title}</h1>
          <p className="text-base text-slate-500">{product.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 px-3 py-1">SKU {product.sku}</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">{product.capacity}</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">{product.energy}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Starting at</p>
              <p className="text-4xl font-bold text-slate-900">৳ {product.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <Button className="justify-center">Order now</Button>
              <Button variant="secondary">Schedule showroom demo</Button>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {product.availability} · {product.delivery}
          </p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-white p-6">
          <Image
            src={product.image}
            alt={product.title}
            width={520}
            height={520}
            className="mx-auto h-auto max-h-96 w-full object-contain"
            priority
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 p-4 text-sm text-slate-600 shadow-lg">
              <p className="font-semibold text-slate-900">Cooling System</p>
              <p>{product.cooling}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.4em] text-slate-400">SmartThings Ready</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {product.highlights.map((point, index) => (
          <article key={point} className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-md">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Highlight {index + 1}</p>
            <p className="mt-3 text-base text-slate-700">{point}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Technical specs</h2>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-400">Capacity</dt>
            <dd className="text-lg text-slate-900">{product.capacity}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-400">Color</dt>
            <dd className="text-lg text-slate-900">{product.color}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-400">Cooling</dt>
            <dd className="text-lg text-slate-900">{product.cooling}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-400">Energy</dt>
            <dd className="text-lg text-slate-900">{product.energy}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-[0.3em] text-slate-400">Warranty</dt>
            <dd className="text-lg text-slate-900">{product.warranty}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
