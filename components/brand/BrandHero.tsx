import React from "react";
import Image from "next/image";

interface BrandHeroProps {
	bannerImage?: string;
	altText?: string;
}

export default function BrandHero({
	bannerImage = "/images/shoppage.png",
	altText = "Brand Collection",
}: BrandHeroProps) {
	return (
		<div className="relative mx-auto w-full max-w-[1840px]">
			<div className="relative aspect-[1840/400] w-full overflow-hidden">
				<Image
					src={bannerImage}
					alt={altText}
					fill
					priority
					className="object-cover"
					sizes="(max-width: 1840px) 100vw, 1840px"
				/>
			</div>
		</div>
	);
}
