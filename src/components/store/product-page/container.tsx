"use client";

import { CartProductType, ProductPageDataType } from "@/lib/types";
import ProductSwiper from "./product-swiper";
import ProductInfo from "./product-info/product-info";
import ShipTo from "./shipping/ship-to";
import ShippingDetails from "./shipping/shipping-details";
import ReturnsSecurityPrivacyCard from "./returns-security-privacy-card";
import React, { useEffect } from "react";
import { useState } from "react";
import { isProductValidToAdd } from "@/lib/utils";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: React.ReactNode;
}

const ProductPageContainer = ({ productData, sizeId, children }: Props) => {
  if (!productData) {
    return null;
  }

  const { images, shippingDetails } = productData;

  if (shippingDetails === "boolean") {
    return null;
  }

  const data: CartProductType = {
    productId: productData.productId,
    variantId: productData.variantId,
    productSlug: productData.productSlug,
    variantSlug: productData.variantSlug,
    name: productData.name,
    variantName: productData.variantName,
    image: images[0].url,
    variantImage: productData.variantImage,
    quantity: 1,
    price: 0,
    sizeId: sizeId || "",
    size: "",
    stock: 1,
    weight: productData.weight,
    shippingMethod: shippingDetails.shippingFeeMethod,
    shippingService: shippingDetails.shippingService,
    shippingFee: shippingDetails.shippingFee,
    extraShippingFee: shippingDetails.extraShippingFee,
    deliveryTimeMin: shippingDetails.deliveryTimeMin,
    deliveryTimeMax: shippingDetails.deliveryTimeMax,
    isFreeShipping: shippingDetails.isFreeShipping,
    freeShippingForAllCountries: productData.freeShippingForAllCountries,
  };

  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    React.useState<CartProductType>(data);

  const [isProductValid, setIsProductValid] = useState<boolean>(false);

  const handleChange = (property: keyof CartProductType, value: any) => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
  };

  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart);
    setIsProductValid(check);
  }, [productToBeAddedToCart]);

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product images swiper */}
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          <ProductInfo productData={productData} quantity={1} sizeId={sizeId} />
          {/* Shipping details -  buy actions cards */}
          <div className="w-[390px]">
            <div className="z-20">
              <div className="bg-white border rounded-md overflow-hidden overflow-y-auto p-4 pb-0">
                {/* {Ship to} */}
                {typeof shippingDetails !== "boolean" && (
                  <>
                    <ShipTo
                      countryCode={shippingDetails.countryCode}
                      countryName={shippingDetails.countryName}
                      city={shippingDetails.city}
                    />

                    <div className="mt-3 space-y-3">
                      <ShippingDetails
                        shippingDetails={shippingDetails}
                        quantity={1}
                        weight={productData.weight ?? 0}
                        freeShippingForAllCountries={
                          shippingDetails.freeShippingForAllCountries
                        }
                      />
                    </div>
                    <ReturnsSecurityPrivacyCard
                      returnPolicy={shippingDetails.returnPolicy}
                    ></ReturnsSecurityPrivacyCard>

                    {/* <SecurityPrivacyCard></SecurityPrivacyCard> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[calc(100% - 390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
