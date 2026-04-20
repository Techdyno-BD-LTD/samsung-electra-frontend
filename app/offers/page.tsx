import Image from "next/image";
import Link from "next/link";
import offersData from "@/database/offers.json";

type OfferItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
};

export default function OffersPage() {
  const offers = offersData.offers as OfferItem[];

  return (
    <main className="mt-20 pb-10 sm:mt-24 sm:pb-14 lg:mt-16">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-[12px] text-slate-500 sm:text-sm">
        <Link href="/" className="transition hover:text-slate-700">
          Home
        </Link>
        <span className="text-slate-400">›</span>
        <span className="font-medium text-slate-700">Campaign</span>
      </nav>

      <h1 className="mb-4 text-xl font-semibold text-slate-900 sm:mb-5 sm:text-2xl">{offersData.pageTitle}</h1>

      <section className="mx-auto grid w-full grid-cols-2 gap-2 sm:gap-3 lg:gap-4 2xl:max-w-[1824px]">
        {offers.map((offer) => (
          <article key={offer.id} className="w-full" aria-label={offer.title}>
            <div className="relative aspect-[910/732] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={offer.image}
                alt={offer.alt}
                fill
                priority={offer.id === offers[0]?.id}
                sizes="(min-width: 1536px) 910px, (min-width: 1280px) calc((100vw - 5rem) / 2), (min-width: 640px) calc((100vw - 2.75rem) / 2), calc((100vw - 2.5rem) / 2)"
                className="object-contain"
              />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
