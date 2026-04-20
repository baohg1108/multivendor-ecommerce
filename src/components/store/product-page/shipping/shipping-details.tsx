"use client";

import { ProductShippingDetailsType } from "@/lib/types";
import { Truck } from "lucide-react";
import { FC } from "react";

interface Props {
  shippingDetails: ProductShippingDetailsType;
  quantity: number;
  weight: number;
}

const ShippingDetails: FC<Props> = ({ quantity, shippingDetails }) => {
  const isShippingUnavailable = typeof shippingDetails === "boolean";
  const { countryName, shippingFee, extraShippingFee, shippingFeeMethod } =
    isShippingUnavailable
      ? {
          countryName: "",
          shippingFee: 0,
          extraShippingFee: 0,
          shippingFeeMethod: "ITEM",
        }
      : shippingDetails;

  let shippingTotal = 0;

  switch (shippingFeeMethod) {
    case "ITEM": {
      const qty = quantity - 1;
      shippingTotal = shippingFee + qty * extraShippingFee;
      break;
    }
    case "WEIGHT":
      shippingTotal = shippingFee * quantity;
      break;
    case "FIXED":
      shippingTotal = shippingFee;
      break;
    default:
      shippingTotal = 0;
      break;
  }

  if (isShippingUnavailable) return null;

  //   const { minDate, maxDate } = shippingDetails
  //     ? getShippingDatesRange(deliveryTimeMin, deliveryTimeMax)
  //     : { minDate: "Loading...", maxDate: "Loading..." };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex item-centers gap-x-1">
          <Truck className="w-4"></Truck>
          <span className="text-sm font-bold flex items-center">
            <span>
              Shipping to&nbsp; <span>{countryName}</span>
            </span>
            <span>&nbsp;for ${shippingTotal.toFixed(2)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
