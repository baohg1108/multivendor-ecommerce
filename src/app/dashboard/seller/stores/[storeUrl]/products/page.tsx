import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import { columns } from "./columns";
import { Plus } from "lucide-react";
import { ProductDetails } from "@/components/dashboard/forms/product-details";
import { getAllCategories } from "@/queries/category";
// import { getAllOffertags } from "@/queries/offer-tag";

export default async function SellerProductsPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;
  const products = await getAllStoreProducts(storeUrl);
  const categories = await getAllCategories();
  // const offerTags = await getAllOffertags();
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15}>Create Product</Plus>
        </>
      }
      modalChildren={
        <ProductDetails
          categories={categories}
          // offerTags={offerTags}
          storeUrl={storeUrl}
        />
      }
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      filterValue="image"
      data={products}
      columns={columns}
      searchPlaceholder="Search product image ..."
    />
  );
}
