import Image from "next/image";

type TrustSignal = {
  image: string;
  title: string;
  subtitle: string;
};

async function getTrustSignals(): Promise<TrustSignal[]> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${siteUrl}/api/homepage/trust-signals`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error loading trust signals from proxy:", error);
    return [];
  }
}

export default async function ServiceHighlights() {
  const trustSignals = await getTrustSignals();

  if (trustSignals.length === 0) return null;

  return (
    <section className="rounded-xl">
      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
        {trustSignals.map((item, index) => (
          <article
            key={index}
            className="flex items-center justify-center gap-4 rounded-lg bg-[#E7EEF6] lg:px-5 lg:py-4 py-2 px-2"
          >
            <div className="relative w-6 h-6 lg:h-14 lg:w-14 shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>

            <div>
              <h3 className="lg:text-lg text-[12px] font-semibold leading-tight text-[#0f58ad]">{item.title}</h3>
              <p className="mt-1 lg:text-sm text-[9px] font-base text-[#2f74bf]">{item.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}