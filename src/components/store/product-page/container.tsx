import { ProductPageDataType } from "@/lib/types";
import ProductSwiper from "./product-swiper";

interface Props {
  productData: ProductPageDataType;
  sizeId: string | undefined;
  children: React.ReactNode;
}

const ProductPageContainer = ({ productData, sizeId, children }: Props) => {
  if (!productData) {
    return null;
  }

  const { images } = productData;

  return (
    <div className="relative">
      <div className="w-full xl:flex xl:gap-4">
        {/* Product images swiper */}
        <ProductSwiper images={images} />
        <div className="w-full mt-4 md:mt-0 flex flex-col gap-4 md:flex-row">
          {/* Product main info */}
          {/* buy action card */}
        </div>
      </div>
      <div className="w-[calc(100% - 390px)] mt-6 pb-16">{children}</div>
    </div>
  );
};

export default ProductPageContainer;
