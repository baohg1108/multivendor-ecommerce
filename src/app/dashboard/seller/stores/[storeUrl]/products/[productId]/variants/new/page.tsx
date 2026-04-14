import { ProductDetails } from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
import { getProductMainInfo } from "@/queries/product";

export default async function SellerNewProductVariantPage({
  params,
}: {
  params: Promise<{ storeUrl: string; productId: string }>;
}) {
  const { storeUrl, productId } = await params;
  const categories = await getAllCategories();
  const product = await getProductMainInfo(productId);
  if (!product) {
    return null;
  }
  return (
    <div>
      <ProductDetails
        categories={categories}
        storeUrl={storeUrl}
        data={product}
      ></ProductDetails>
    </div>
  );
}
