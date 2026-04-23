import ProductDetails from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getAllOfferTags } from "@/queries/offer-tag";
import { getProductMainInfo } from "@/queries/product";

import { db } from "@/lib/db";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: Promise<{ storeUrl: string; productId: string }>;
}) {
  const { storeUrl, productId } = await params;
  const categories = await getAllCategories();
  const offerTags = await getAllOfferTags();
  const product = await getProductMainInfo(productId);
  if (!product) return null;
  const countries = await db.country.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        data={product}
        offerTags={offerTags}
        countries={countries}
      />
    </div>
  );
}
