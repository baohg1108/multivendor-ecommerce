import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Variant {
  url: string;
  img: string;
  slug: string;
}
interface Props {
  variants: Variant[];
  slug: string;
}

const ProductVariantSelector = ({ slug, variants }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {variants.map((variant, i) => (
        <Link href={variant.url} key={i}>
          <div
            className={cn(
              "relative w-12 h-12 max-h-12 rounded-full grid place-items-center overflow-hidden border border-transparent outline-[1px] outline-transparent outline-dashed outline-offset-2 cursor-pointer transition-all hover:border-black duration-75 ease-in",
              {
                "border-black": slug === variant.slug,
              },
            )}
          >
            {variant.img ? (
              <Image
                src={variant.img}
                alt={variant.slug}
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
