"use client";

import { CartProductType } from "@/lib/types";
import { Dispatch, SetStateAction, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Trash,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/cart-store/useCartStore";

interface Props {
  product: CartProductType;
  selectedItems: CartProductType[];
  setSelectedItems: Dispatch<SetStateAction<CartProductType[]>>;
}

const CartProduct: React.FC<Props> = ({
  product,
  selectedItems,
  setSelectedItems,
}) => {
  const {
    productId,
    variantId,
    productSlug,
    variantSlug,
    name,
    variantName,
    sizeId,
    image,
    price,
    quantity,
    stock,
    size,
    weight,
    shippingMethod,
    shippingService,
    shippingFee,
    extraShippingFee,
    freeShippingForAllCountries,
  } = product;

  const unique_id = `${productId}-${variantId}-${sizeId}`;
  const totalPrice = price * quantity;

  const shippingCalc = useMemo(() => {
    let initialFee = 0;
    let extraFee = 0;
    let totalFee = 0;

    if (!freeShippingForAllCountries) {
      if (shippingMethod === "ITEM") {
        initialFee = shippingFee;
        extraFee = quantity > 1 ? extraShippingFee * (quantity - 1) : 0;
        totalFee = initialFee + extraFee;
      } else if (shippingMethod === "WEIGHT") {
        totalFee = shippingFee * weight * quantity;
      } else if (shippingMethod === "FIXED") {
        totalFee = shippingFee;
      }
    }

    return { initialFee, extraFee, totalFee };
  }, [
    quantity,
    shippingMethod,
    shippingFee,
    extraShippingFee,
    weight,
    freeShippingForAllCountries,
  ]);

  const selected = selectedItems.find(
    (p) => unique_id === `${p.productId}-${p.variantId}-${p.sizeId}`,
  );

  const { updateProductQuantity, removeFromCart } = useCartStore(
    (state) => state,
  );

  const handleSelectProduct = () => {
    setSelectedItems((prev) => {
      const exists = prev.some(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          item.sizeId === sizeId,
      );
      return exists
        ? prev.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variantId === variantId &&
                item.sizeId === sizeId
              ),
          )
        : [...prev, product];
    });
  };

  const updateProductQuantityHandler = (type: "add" | "remove") => {
    if (type === "add" && quantity < stock) {
      updateProductQuantity(product, quantity + 1);
    } else if (type === "remove" && quantity > 1) {
      updateProductQuantity(product, quantity - 1);
    }
  };

  const handleRemoveProduct = (product: CartProductType) => {
    setSelectedItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === product.productId &&
            item.variantId === product.variantId &&
            item.sizeId === product.sizeId
          ),
      ),
    );
    removeFromCart(product);
  };

  return (
    <div className="bg-white px-6 border-t border-t-[#ebebeb] select-none">
      <div className="py-4">
        <div className="relative flex self-start">
          {/* Image */}
          <div className="flex items-center">
            {stock > 0 && (
              <label
                htmlFor={unique_id}
                className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center mr-2 cursor-pointer align-middle"
              >
                <span className="leading-8 inline-flex p-0.5 cursor-pointer">
                  <span
                    className={cn(
                      "leading-8 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:border-orange-400",
                      { "border-orange-400": selected },
                    )}
                  >
                    {selected && (
                      <span className="bg-orange-400 w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 text-white mt-0.5" />
                      </span>
                    )}
                  </span>
                </span>
                <input
                  type="checkbox"
                  id={unique_id}
                  hidden
                  onChange={() => handleSelectProduct()}
                />
              </label>
            )}
            <Link href={`/product/${productSlug}?variant=${variantSlug}`}>
              <div className="m-0 mr-4 ml-2 w-28 h-28 bg-gray-200 relative rounded-lg">
                <Image
                  src={image}
                  alt={name}
                  height={200}
                  width={200}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </Link>
          </div>
          {/* Info */}
          <div className="w-0 min-w-0 flex-1">
            {/* Title - Actions */}
            <div className="w-[calc(100%-48px)] flex items-start overflow-hidden whitespace-nowrap">
              <Link
                href={`/product/${productSlug}?variant=${variantSlug}`}
                className="inline-block overflow-hidden text-sm whitespace-nowrap overflow-ellipsis"
              >
                {name} · {variantName}
              </Link>
              <div className="absolute top-0 right-0">
                <span className="mr-2.5 cursor-pointer inline-block">
                  <Heart className="w-4 hover:stroke-orange-400" />
                </span>
                <span
                  className="cursor-pointer inline-block"
                  onClick={() => handleRemoveProduct(product)}
                >
                  <Trash className="w-4 hover:stroke-orange-400" />
                </span>
              </div>
            </div>
            {/* Size */}
            <div className="my-1">
              <button className="text-main-primary relative h-[24px] bg-gray-100 whitespace-normal px-2.5 py-0 max-w-full text-xs leading-4 rounded-xl font-bold cursor-pointer outline-0">
                <span className="flex items-center justify-between flex-wrap">
                  <div className="text-left inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-[95%]">
                    {size}
                  </div>
                  <span className="ml-0.5">
                    <ChevronRight className="w-3" />
                  </span>
                </span>
              </button>
            </div>
            {/* Price - Quantity */}
            <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between mt-2 relative">
              <div>
                <span className="inline-block break-all">
                  ${price.toFixed(2)} x {quantity} = ${totalPrice.toFixed(2)}
                </span>
              </div>
              {/* Quantity changer */}
              <div className="text-xs">
                <div className="text-gray-900 text-sm leading-6 list-none inline-flex items-center">
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("remove")}
                  >
                    <Minus className="w-3 stroke-[#555]" />
                  </div>
                  <input
                    type="text"
                    value={quantity}
                    min={1}
                    max={stock}
                    readOnly
                    className="m-1 h-6 w-[32px] bg-transparent border-none leading-6 tracking-normal text-center outline-none text-gray-900 font-bold"
                  />
                  <div
                    className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-200 leading-6 grid place-items-center rounded-full cursor-pointer"
                    onClick={() => updateProductQuantityHandler("add")}
                  >
                    <Plus className="w-3 stroke-[#555]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Shipping info */}
            <div className="mt-1 text-xs text-[#999] cursor-pointer">
              <div className="flex items-center mb-1">
                <Truck className="w-4 inline-block text-[#01A971] mr-1" />
                {shippingCalc.totalFee > 0 ? (
                  <span className="text-[#01A971]">
                    {shippingMethod === "ITEM" ? (
                      <>
                        ${shippingCalc.initialFee} (first item)
                        {quantity > 1
                          ? ` + ${quantity - 1} item(s) x $${extraShippingFee} (additional items)`
                          : " x 1"}{" "}
                        = ${shippingCalc.totalFee.toFixed(2)}
                      </>
                    ) : shippingMethod === "WEIGHT" ? (
                      <>
                        ${shippingFee} x {weight}kg x {quantity}{" "}
                        {quantity > 1 ? "items" : "item"} = $
                        {shippingCalc.totalFee.toFixed(2)}
                      </>
                    ) : (
                      <>Fixed Fee : ${shippingCalc.totalFee.toFixed(2)}</>
                    )}
                  </span>
                ) : (
                  <span className="text-[#01A971]">Free Delivery</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
