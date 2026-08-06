import Image from "next/image";

interface CategoryHeroBannerProps {
  banner?: string | null;
}

export default function CategoryHeroBanner({ banner }: CategoryHeroBannerProps) {
  const imageSrc = banner || "/images/slider01.png";

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <Image
        src={imageSrc}
        alt="Category Banner"
        width={1514}
        height={355}
        className="h-auto w-full object-contain"
        style={{ aspectRatio: "1514 / 355" }}
        priority
      />
    </div>
  );
}
