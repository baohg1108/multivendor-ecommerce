"use client";
import { CartProductType, ProductPageDataType } from "@/lib/types";
import Link from "next/link";
import { FC } from "react";
import Image from "next/image";
import { CopyIcon } from "@/components/store/icons";
import { toast } from "sonner";
import { Star } from "lucide-react";
import ProductPrice from "./product-price";
import Countdown from "../../shared/countdown";
import { Separator } from "@/components/ui/separator";
import ColorWheel from "@/components/shared/color-wheel";
import ProductVariantSelector from "./variant-selector";
import SizeSelector from "./size-selector";
import ProductAssurancePolicy from "./assurance-policy";

interface Props {
  productData: ProductPageDataType;
  quantity: number;
  sizeId: string | undefined;
  handleChange: (property: keyof CartProductType, value: any) => void;
}

const ProductInfo: FC<Props> = ({
  productData,
  quantity,
  sizeId,
  handleChange,
}) => {
  if (!productData) return null;

  const {
    productId,
    name,
    sku,
    colors,
    variantImages,
    isSale,
    saleEndDate,
    variantName,
    store,
    rating,
    reviewsStatistics,
    numberReviews,
    sizes,
  } = productData;

  const ratingBreakdown =
    (reviewsStatistics?.ratingStatistics?.ratingStatistics as
      | Array<{ rating: number; numReviews: number }>
      | undefined) ?? [];
  const totalReviews =
    reviewsStatistics?.ratingStatistics?.totalReviews ?? numberReviews ?? 0;
  const averageRatingFromReviews =
    totalReviews > 0
      ? ratingBreakdown.reduce(
          (sum, item) => sum + item.rating * item.numReviews,
          0,
        ) / totalReviews
      : 0;
  const displayRating =
    typeof rating === "number" && rating > 0
      ? rating
      : averageRatingFromReviews;
  const roundedRating = Math.round(displayRating);

  const copySkuToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sku);
      toast.success("SKU copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy SKU");
    }
  };

  return (
    <div className="relative w-full xl:w-[540px]">
      {/* Title */}
      <div>
        <h1 className="text-black inline font-bold leading-5">
          {name} - {variantName}
        </h1>
      </div>

      {/* Sku - rating - num reviews */}
      <div className="flex items-center text-xs mt-2">
        {/*Store  details*/}
        <Link
          href={`/store/${store.url}`}
          className="hidden sm:inline-block md:hidden lg:inline-block mr-2 hover:underline"
        >
          <div className="w-full flex items-center gap-x-1">
            <Image
              src={store.logo}
              alt={store.name}
              width={100}
              height={100}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </Link>

        {/* Sku - rating - num reviews */}
        <div className="whitespace-nowrap">
          <span className="flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">
            SKU: {sku}
          </span>
          <span
            className="inline-block align-middle text-[#2f68a8] mx-1 cursor-pointer"
            onClick={copySkuToClipboard}
          >
            <CopyIcon />
          </span>
        </div>

        <div className="ml-4 flex items-center gap-x-2 flex-1 whitespace-nowrap">
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

          <Link href={"#reviews"} className="text-[#ffd804] underline">
            (
            {totalReviews === 0
              ? "No reviews yet"
              : totalReviews === 1
                ? "1 review"
                : `${totalReviews} reviews`}
            )
          </Link>
        </div>
      </div>
      {/* Product Price and Sale Countdown */}
      <div className="my-2 relative flex flex-col sm:flex-row justify-between">
        <ProductPrice
          sizes={sizes}
          sizeId={sizeId}
          handleChange={handleChange}
        />
        {isSale && saleEndDate && (
          <div className="mt-4 pb-2">
            <Countdown targetDate={saleEndDate} />
          </div>
        )}
      </div>

      <Separator className="mt-2"></Separator>
      {/* Color wheel + variant selector */}
      <div className="mt-4 space-y-2">
        <div className="relative flex items-center justify-between text-black font-bold">
          <span className="flex items-center gap-x-2">
            {colors.length > 1 ? "Colors" : "Color"}
            <ColorWheel colors={colors} size={25} />
          </span>
        </div>
        {variantImages.length > 0 && (
          <ProductVariantSelector
            variants={variantImages}
            slug={productData.variantSlug}
          />
        )}
      </div>
      {/* Size Selector */}
      <div className="space-y-2 pb-2 mt-4">
        <div>
          <h1 className="text-black font-bold">Size</h1>
        </div>
        <SizeSelector
          sizes={sizes}
          sizeId={sizeId}
          handleChange={handleChange}
        />
      </div>
      {/* Product assurance policy */}
      <Separator className="mt-4"></Separator>
      <ProductAssurancePolicy />
    </div>
  );
};

export default ProductInfo;
