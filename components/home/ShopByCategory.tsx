import Image from "next/image";
import Link from "next/link";

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  itemCount: string;
  imageSrc: string;
  imageAlt: string;
};

const categories: CategoryItem[] = [
  {
    id: 1,
    name: "Air Conditioner",
    slug: "air-conditioner",
    itemCount: "150+ Items",
    imageSrc: "/images/acimage.png",
    imageAlt: "Air conditioner category",
  },
  {
    id: 2,
    name: "TV & Audio",
    slug: "tv-and-audio",
    itemCount: "150+ Items",
    imageSrc: "/images/tv2.png",
    imageAlt: "TV and audio category",
  },
  {
    id: 3,
    name: "Refrigerator",
    slug: "refrigerator",
    itemCount: "150+ Items",
    imageSrc: "/images/fr2.png",
    imageAlt: "Refrigerator category",
  },
  {
    id: 4,
    name: "Microwave",
    slug: "microwave",
    itemCount: "150+ Items",
    imageSrc: "/images/ov2.png",
    imageAlt: "Microwave category",
  },
  {
    id: 5,
    name: "Washing Machine",
    slug: "washing-machine",
    itemCount: "150+ Items",
    imageSrc: "/images/wm2.png",
    imageAlt: "Washing machine category",
  },
  {
    id: 6,
    name: "Kitchen Appliance",
    slug: "kitchen-appliance",
    itemCount: "150+ Items",
    imageSrc: "/images/blender.png",
    imageAlt: "Kitchen appliance category",
  },
];

export default function ShopByCategory() {
  return (
    <section className="rounded-xl  ">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-[18px] font-semibold text-slate-900 sm:text-[2.1rem]">Shop by category</h2>
          <div className="mt-2 sm:mt-5 h-[2px] w-full max-w-[260px] bg-gradient-to-r from-[#2F73BD] via-[#2F73BD]/50 to-transparent sm:max-w-[380px]" />
        </div>
        <Link
          href="/products"
          className="inline-flex flex-shrink-0 items-center rounded-full border border-[#2F73BD] px-4 py-1.5 text-xs font-medium text-[#2F73BD] transition hover:bg-[#2F73BD] hover:text-white sm:px-5 sm:py-2 sm:text-sm"
        >
          All Deals
        </Link>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="block rounded-lg border border-transparent bg-white p-1.5 text-center transition hover:border-[#7EA8D8] sm:rounded-2xl sm:p-3"
            >
              <div
                className="relative flex items-center justify-center rounded-lg bg-[#F3F3F4] sm:rounded-xl"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={160}
                  height={160}
                  quality={100}
                  className="h-auto w-[85%] max-w-[150px] object-contain sm:w-[85%] sm:max-w-[160px]"
                />
              </div>
              <h3 className="mt-1.5 text-[12px] font-semibold leading-tight tracking-tight text-slate-900 sm:mt-4 sm:text-xl">{item.name}</h3>
              <p className="mt-0.5 text-[10px] leading-tight text-slate-500 sm:mt-1 sm:text-sm">{item.itemCount}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}