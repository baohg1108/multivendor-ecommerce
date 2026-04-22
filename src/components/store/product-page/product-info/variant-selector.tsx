import { VariantInfoType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { ProductVariantImage } from "@prisma/client";

// interface Variant {
//   url: string;
//   img: string;
//   slug: string;
// }
interface Props {
  variants: VariantInfoType[];
  slug: string;
  setVariantImages: Dispatch<SetStateAction<ProductVariantImage[]>>;
  setActiveImage: Dispatch<SetStateAction<ProductVariantImage | null>>;
}

const ProductVariantSelector = ({
  slug,
  variants,
  setVariantImages,
  setActiveImage,
}: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link
          href={variant.variantUrl}
          key={i}
          onMouseEnter={() => {
            setVariantImages(variant.images);
            // if (variant.images.length > 0) {
            setActiveImage(variant.images[0]);
            // }
          }}
          onMouseLeave={() => {
            setVariantImages([]);
            setActiveImage(null);
          }}
        >
          <div
            className={cn(
              "relative w-12 h-12 max-h-12 rounded-full grid place-items-center overflow-hidden border border-transparent outline-[1px] outline-transparent outline-dashed outline-offset-2 cursor-pointer transition-all hover:border-black duration-75 ease-in",
              {
                "border-black": slug === variant.variantSlug,
              },
            )}
          >
            {variant.variantImage ? (
              <Image
                src={variant.variantImage}
                alt={variant.variantSlug}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductVariantSelector;
