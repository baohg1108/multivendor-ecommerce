"use client";

import { CartProductType, ProductPageDataType } from "@/lib/types";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnsSecurityPrivacyCard from "./returns-security-privacy-card";
import React, { useCallback, useState } from "react";
import { isProductValidToAdd } from "@/lib/utils";
import QuantitySelector from "./quantity-selector";
import SocialShare from "../shared/social-share";

interface ProductPageContainerProps {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: React.ReactNode;
}

const ProductPageContainer = ({
  productData,
  sizeId,
  children,
}: ProductPageContainerProps) => {
  const resolvedProductData = productData as NonNullable<ProductPageDataType>;
  const { images, shippingDetails } = resolvedProductData;
  const hasShippingDetails = typeof shippingDetails !== "boolean";
  const resolvedShippingDetails = hasShippingDetails
    ? shippingDetails
    : {
        shippingFeeMethod: "ITEM",
        shippingService: "",
        shippingFee: 0,
        extraShippingFee: 0,
        deliveryTimeMin: 0,
        deliveryTimeMax: 0,
        returnPolicy: "",
        countryCode: "",
        countryName: "",
        city: "",
        isFreeShipping: false,
        freeShippingForAllCountries: false,
      };

  // Initialize the default product data for the cart item
  const data: CartProductType = {
    productId: resolvedProductData.productId,
    variantId: resolvedProductData.variantId,
    productSlug: resolvedProductData.productSlug,
    variantSlug: resolvedProductData.variantSlug,
    name: resolvedProductData.name,
    variantName: resolvedProductData.variantName,
    image: images[0].url,
    variantImage: resolvedProductData.variantImage,
    quantity: 1,
    price: 0,
    sizeId: sizeId || "",
    size: "",
    stock: 1,
    weight: resolvedProductData.weight || 0,
    shippingMethod: resolvedShippingDetails.shippingFeeMethod,
    shippingService: resolvedShippingDetails.shippingService,
    shippingFee: resolvedShippingDetails.shippingFee,
    extraShippingFee: resolvedShippingDetails.extraShippingFee,
    deliveryTimeMin: resolvedShippingDetails.deliveryTimeMin,
    deliveryTimeMax: resolvedShippingDetails.deliveryTimeMax,
    isFreeShipping: resolvedShippingDetails.isFreeShipping,
    freeShippingForAllCountries:
      resolvedShippingDetails.freeShippingForAllCountries,
  };

  // useState hook to manage the state of the product being added to the cart and its validity
  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>(data);

  //
  const handleChange = useCallback(
    (
      property: keyof CartProductType,
      value: CartProductType[keyof CartProductType],
    ) => {
      setProductToBeAddedToCart((prevProduct) => ({
        ...prevProduct,
        [property]: value,
      }));
    },
    [],
  );

  const isProductValid = isProductValidToAdd(productToBeAddedToCart);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product Info Main */}
          <ProductInfo
            productData={resolvedProductData}
            quantity={1}
            sizeId={sizeId}
            handleChange={handleChange}
          />
          {/* shipping details - buy action button */}
          <div className="w-[390px]">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {hasShippingDetails && (
                  <>
                    <ShipTo
                      countryCode={resolvedShippingDetails.countryCode}
                      countryName={resolvedShippingDetails.countryName}
                      city={resolvedShippingDetails.city}
                    />
                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={resolvedShippingDetails}
                        quantity={1}
                        weight={resolvedProductData.weight ?? 0}
                        freeShippingForAllCountries={
                          resolvedShippingDetails.freeShippingForAllCountries
                        }
                      />
                    </div>
                    <ReturnsSecurityPrivacyCard
                      returnPolicy={resolvedShippingDetails.returnPolicy}
                    />
                  </>
                )}

                {/* action buttons */}
                <div className="mt-5 bg-white bottom-0 pb-4 space-y-3 sticky">
                  {/* Qty selector */}
                  {sizeId && (
                    <div className="w-full flex justify-end mt-4">
                      <QuantitySelector
                        sizeId={productToBeAddedToCart.sizeId}
                        quantity={productToBeAddedToCart.quantity}
                        stock={productToBeAddedToCart.stock}
                        handleChange={handleChange}
                      />
                    </div>
                  )}
                  {/* Action buttons */}
                  <button className="w-full py-2.5 h-11 rounded-3xl text-white font-bold border border-[#f97316] bg-[#fb923c] hover:bg-[#f97316] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:bg-[#fdba74] disabled:border-[#fdba74] disabled:cursor-not-allowed select-none">
                    Buy now
                  </button>

                  <button
                    disabled={!isProductValid}
                    className="w-full py-2.5 h-11 rounded-3xl font-bold border border-[#f97316] text-[#f97316] bg-[#fff7ed] hover:bg-[#ffedd5] active:scale-[0.98] transition-all duration-300 ease-in-out disabled:text-[#fdba74] disabled:border-[#fdba74] disabled:bg-[#fff7ed] disabled:cursor-not-allowed select-none"
                  >
                    Add to cart
                  </button>
                  {/* Share to social media */}
                  <SocialShare
                    url={`/product/${productData?.productSlug}/${productData?.variantSlug}`}
                    quote={`${productData?.name} - ${productData?.variantName}`}
                  ></SocialShare>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100%-390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
