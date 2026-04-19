// import { getAllCategories } from "@/queries/category";
// import { ProductDetails } from "@/components/dashboard/forms/product-details";

// export default async function SellerNewProductPage({
//   params,
// }: {
//   params: Promise<{ storeUrl: string }>;
// }) {
//   const { storeUrl } = await params;
//   const categories = await getAllCategories();

//   return (
//     <div className="w-full">
//       <ProductDetails categories={categories} storeUrl={storeUrl} />
//     </div>
//   );
// }

import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";

const SellerNewProductPage = async ({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) => {
  const { storeUrl } = await params;
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  return (
    <div className="w-full">
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        offerTags={offerTags}
      />
    </div>
  );
};

export default SellerNewProductPage;
