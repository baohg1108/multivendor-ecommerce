"use client";
import { ProductType, VariantSimplified } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import ProductCardImageSwiper from "./swiper";
import VariantSwitcher from "./variant-switcher";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

export default function ProductCard({ product }: { product: ProductType }) {
  const { name, slug, rating, sales, variants, variantImages } = product;
  const [variant, setVariant] = useState<VariantSimplified>(variants[0]);
  const { variantSlug, variantName, images, sizes } = variant;
  const roundedRating = Math.round(rating);

  return (
    <div>
      <div className="group w-48 sm:w-[225px] relative transition-all duration-75 bg-white ease-in-out p-4 rounded-t-3xl border border-transparent hover:shadow-xl hover:border-border">
        <div className="relative w-full h-full">
          <Link
            href={`/product/${slug}/${variantSlug}`}
            className="w-full relative inline-block overflow-hidden"
          >
            <ProductCardImageSwiper images={images}></ProductCardImageSwiper>
            <div className="text-sm text-black h-[18px] overflow-hidden overflow-ellipsis line-clamp-1">
              {name} - {variantName}
            </div>
            {/* Rating - Sales */}
            {product.rating > 0 && (
              <div className="flex items-center gap-x-1 h-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < roundedRating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {product.sales > 0 && (
                  <div className="text-xs text-gray-500">{sales} sold</div>
                )}
              </div>
            )}

            {/* Price */}
          </Link>
        </div>
        <div className="hidden group-hover:block absolute -left-[1px] bg-white border border-t-0 w-[calc(100%+2px)] px-4 rounded-b-3xl shadow-xl z-30 space-y-2">
          {/* Variant switcher */}
          <VariantSwitcher
            images={variantImages}
            variants={variants}
            setVariant={setVariant}
            selectedVariant={variant}
          />
          {/* <div className="h-4"></div> */}
          <div className="flex flex-items gap-x-1">
            <Button>Add to cart</Button>
            <Button variant="outline" size="icon">
              <Heart className="w-5"></Heart>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
