"use client";

import { ProductVariantImage } from "@prisma/client";
import { Dispatch, SetStateAction, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProductSwiper({
  images,
  activeImage,
  setActiveImage,
}: {
  images: ProductVariantImage[];
  activeImage: ProductVariantImage | null;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}) {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  if (!images?.length) return null;

  // const [activeImage, setActiveImage] = useState<ProductVariantImage>(
  //   images[0],
  // );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    setZoomOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="relative">
      <div className="relative w-full flex flex-col-reverse xl:flex-row gap-2">
        {/* Thumbnail images */}
        <div className="flex flex-wrap xl:flex-col gap-3">
          {images.map((img) => (
            <div
              key={img.url}
              onClick={() => setActiveImage(img)}
              className={cn(
                "w-16 h-16 rounded grid place-items-center overflow-hidden border border-gray-100 cursor-pointer transition-all duration-75 ease-in",
                {
                  "border-main-primary": activeImage
                    ? activeImage.id === img.id
                    : false,
                },
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || "Product image"}
                width={80}
                height={80}
                className="object-cover rounded-md "
              />
            </div>
          ))}
        </div>
        {/* Active image */}
        <div
          className="relative rounded-lg overflow-hidden w-full 2xl:h-[600px] 2xl:w-[600px] cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={activeImage?.url || ""}
            alt={activeImage?.alt || "Product image"}
            width={600}
            height={600}
            priority
            className="w-full h-auto rounded-lg object-cover transition-transform duration-150 ease-out"
            style={{
              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              transform: isZooming ? "scale(2)" : "scale(1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
