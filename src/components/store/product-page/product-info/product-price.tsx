"use client";

import { FC, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CartProductType } from "@/lib/types";
interface SimplifiedSize {
  id: string;
  size: string;
  quantity: number;
  price: number;
  discount?: number;
  discountPrice?: number;
}

interface Props {
  sizeId?: string | undefined;
  sizes: SimplifiedSize[];
  isCard?: boolean;
  handleChange?: (property: keyof CartProductType, value: any) => void;
}

const ProductPrice: FC<Props> = ({ sizeId, sizes, isCard, handleChange }) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!sizeId) return;

    const selectedSize = sizes.find((size) => size.id === sizeId);
    if (!selectedSize) return;

    const selectedPrice = Number(selectedSize.price) || 0;
    const selectedDiscount =
      Number(selectedSize.discount ?? selectedSize.discountPrice ?? 0) || 0;
    const discountedPrice = selectedPrice * (1 - selectedDiscount / 100);

    handleChange?.("price", discountedPrice);
    handleChange?.("stock", selectedSize.quantity);
  }, [sizeId, sizes, handleChange]);

  // 1: function to calculate discounted price for each size
  if (!sizeId) {
    const discountedPrices = sizes.map((size) => {
      const price = Number(size.price) || 0;
      const discount = Number(size.discount ?? size.discountPrice ?? 0) || 0;

      return price * (1 - discount / 100);
    });

    const totalQuantity = sizes.reduce(
      (total, size) => total + size.quantity,
      0,
    );

    const minPrice = Math.min(...discountedPrices).toFixed(2);
    const maxPrice = Math.max(...discountedPrices).toFixed(2);

    // const priceDisplay = minPrice === maxPrice ? `$${minPrice}` : `$${maxPrice}`;
    const priceDisplay =
      minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

    return (
      <div>
        <div className="text-orange-500 inline-block font-bold leading-none mr-2.5">
          <span
            className={cn("inline-block text-4xl text-nowrap", {
              "text-lg": isCard,
            })}
          >
            {priceDisplay}
          </span>
        </div>

        {!sizeId && !isCard && (
          <div className="text-orange-500 text-xs leading-4 mt-1">
            <span>Note: Select a size to see the exact price</span>
          </div>
        )}

        {!sizeId && !isCard && <p className="mt-2">{totalQuantity} pieces</p>}
      </div>
    );
  }
  // 2: if sizeId is provided, calculate price for that specific size
  const selectedSize = sizes.find((size) => size.id === sizeId);

  if (!selectedSize) {
    return <></>;
  }

  const selectedPrice = Number(selectedSize.price) || 0;
  const selectedDiscount =
    Number(selectedSize.discount ?? selectedSize.discountPrice ?? 0) || 0;
  const selectedQuantity = Number(selectedSize.quantity) || 0;
  const discountedPrice = selectedPrice * (1 - selectedDiscount / 100);

  return (
    <div>
      <div className="text-orange-500 inline-block font-bold leading-none mr-2.5">
        <span className="inline-block text-4xl">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>
      {selectedPrice !== discountedPrice && (
        <span className="text-[#999] inline-block text-xl font-normal leading-6 mr-2 line-through">
          ${selectedPrice.toFixed(2)}
        </span>
      )}
      {selectedDiscount > 0 && (
        <span className="inline-block text-orange-600 text-xl leading-6">
          {selectedDiscount}% off
          <span />
        </span>
      )}
      <p className="mt-2 text-xs">{selectedQuantity} in stock</p>
    </div>
  );
};
export default ProductPrice;
