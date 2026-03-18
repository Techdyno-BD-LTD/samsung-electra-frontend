import Image from "next/image";

export default function DualPromoBanners() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <div className="relative w-full overflow-hidden rounded-2xl aspect-[910/318]">
          <Image
            src="/images/rectangle1.png"
            alt="Microwave promotional banner"
            fill
            sizes="(max-width: 1024px) 50vw, 910px"
            className="object-contain"
            priority
          />
        </div>

        <div className="relative hidden lg:block w-full overflow-hidden rounded-2xl aspect-[910/318]">
          <Image
            src="/images/rectangle2.png"
            alt="Air conditioner promotional banner"
            fill
            sizes="(max-width: 1024px) 50vw, 910px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
