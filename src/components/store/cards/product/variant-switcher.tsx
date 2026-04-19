import { VariantImageType, VariantSimplified } from "@/lib/types";
import { Link } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { Dispatch } from "react";
import Image from "next/image";

interface Props {
  images: VariantImageType[];
  variants: VariantSimplified[];
  setVariant: Dispatch<React.SetStateAction<VariantSimplified>>;
  selectedVariant?: VariantSimplified;
}

const VariantSwitcher: React.FC<Props> = ({
  images,
  variants,
  setVariant,
  selectedVariant,
}) => {
  return (
    <div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-1">
          {images.map((img, index) => (
            <Link
              href={img.url}
              key={index}
              className={cn("p-0.5 rounded-full border-2 border-transparent", {
                "border-border": variants[index] === selectedVariant,
              })}
              // hover variant image when hover on the variant image
              onMouseEnter={() => setVariant(variants[index])}
            >
              <Image
                src={img.image}
                alt=""
                width={100}
                height={100}
                className="w-8 h-8 object-cover rounded-full"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantSwitcher;
