import Image from "next/image";

export default function CategoryHeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <Image
        src="/images/slider01.png"
        alt="Picture Perfect Deals"
        width={1530}
        height={358}
        className="h-auto w-full object-cover"
        style={{ aspectRatio: "1530 / 358" }}
        priority
      />
    </div>
  );
}
