import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden rounded-2xl aspect-[1840/501]">
        <Image
          src="/images/Newsletter.png"
          alt="Newsletter banner"
          fill
          sizes="(max-width: 1536px) 100vw, 1840px"
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
