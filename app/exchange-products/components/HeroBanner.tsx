import Image from "next/image";

type HeroBannerProps = {
  image: string;
  alt: string;
};

export default function HeroBanner({ image, alt }: HeroBannerProps) {
  return (
    <section className="w-full">
      <div className="relative aspect-[1840/400] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        <Image src={image} alt={alt} fill priority sizes="(min-width: 1536px) 1840px, 95vw" className="object-cover" />
      </div>
    </section>
  );
}
