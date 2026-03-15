import Image from "next/image";

type ServiceItem = {
  id: number;
  title: string;
  subtitle: string;
  iconSrc: string;
  iconAlt: string;
};

const serviceItems: ServiceItem[] = [
  {
    id: 1,
    title: "Free Delivery",
    subtitle: "Nation Wide",
    iconSrc: "/images/freedelivery.png",
    iconAlt: "Delivery service icon",
  },
  {
    id: 2,
    title: "Free Installation",
    subtitle: "24/7 Amazing Services",
    iconSrc: "/images/freeinstalation.png",
    iconAlt: "Installation service icon",
  },
  {
    id: 3,
    title: "0% EMI Facility",
    subtitle: "Save Your Money",
    iconSrc: "/images/emifacility.png",
    iconAlt: "EMI service icon",
  },
  {
    id: 4,
    title: "Officially Product",
    subtitle: "Mega Discounts",
    iconSrc: "/images/officiallyproduct.png",
    iconAlt: "Official product icon",
  },
];

export default function ServiceHighlights() {
  return (
    <section className="rounded-xl  ">
      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
        {serviceItems.map((item) => (
          <article
            key={item.id}
            className="flex items-center justify-center gap-4 rounded-lg bg-[#E7EEF6] lg:px-5 lg:py-4 py-2 px-2"
          >
            <div className="relative w-6 h-6 lg:h-14 lg:w-14 shrink-0">
              <Image
                src={item.iconSrc}
                alt={item.iconAlt}
                fill
                sizes="44px"
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