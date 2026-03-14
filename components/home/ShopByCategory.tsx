import Image from "next/image";
import Link from "next/link";

type CategoryItem = {
  id: number;
  name: string;
  itemCount: string;
  imageSrc: string;
  imageAlt: string;
};

const categories: CategoryItem[] = [
  {
    id: 1,
    name: "Air Conditionar",
    itemCount: "150+ Items",
    imageSrc: "/images/ac-5.png",
    imageAlt: "Air conditioner category",
  },
  {
    id: 2,
    name: "Tv & Audio",
    itemCount: "150+ Items",
    imageSrc: "/images/ac.png",
    imageAlt: "TV and audio category",
  },
  {
    id: 3,
    name: "Refrigerator",
    itemCount: "150+ Items",
    imageSrc: "/images/ac-1.png",
    imageAlt: "Refrigerator category",
  },
  {
    id: 4,
    name: "Microwave",
    itemCount: "150+ Items",
    imageSrc: "/images/ac-2.png",
    imageAlt: "Microwave category",
  },
  {
    id: 5,
    name: "Washing Machine",
    itemCount: "150+ Items",
    imageSrc: "/images/ac-3.png",
    imageAlt: "Washing machine category",
  },
  {
    id: 6,
    name: "Kitchen Appliance",
    itemCount: "150+ Items",
    imageSrc: "/images/ac-4.png",
    imageAlt: "Kitchen appliance category",
  },
];

export default function ShopByCategory() {
  return (
    <section className="rounded-xl  ">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-[2.1rem]">Shop by category</h2>
          <div className="mt-5 h-[2px] w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:w-[380px]" />
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-md border border-[#2F73BD] px-4 py-2 text-sm font-medium text-[#2F73BD] transition hover:bg-[#2F73BD] hover:text-white sm:text-base"
        >
          All Deals
          <span aria-hidden="true">&gt;</span>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible lg:pb-0">
        <div className="flex snap-x snap-mandatory gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-6 lg:gap-5">
          {categories.map((item) => (
            <article
              key={item.id}
              className="min-w-[240px] snap-start rounded-2xl border border-transparent bg-white p-3 text-center transition hover:border-[#7EA8D8] lg:min-w-0"
            >
              <div className="relative rounded-xl bg-[#F3F3F4]" style={{ aspectRatio: "1 / 1" }}>
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 240px, (max-width: 1280px) 28vw, 16vw"
                  className="object-contain p-6"
                />
              </div>
              <h3 className="mt-4 text-[1.36rem] font-semibold tracking-tight text-slate-900 sm:text-xl">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.itemCount}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}