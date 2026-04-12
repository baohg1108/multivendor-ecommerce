import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { ProductDetails } from "@/components/dashboard/forms/product-details";

export default async function SellerNewProductPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;
  const categories = await getAllCategories();
  const subCategories = await getAllSubCategories();

  return (
    <ProductDetails
      categories={categories}
      subCategories={subCategories.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        categoryId: subCategory.categoryId,
      }))}
    />
  );
}
