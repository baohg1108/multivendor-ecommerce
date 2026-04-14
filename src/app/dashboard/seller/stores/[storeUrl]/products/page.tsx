import DataTable from "@/components/ui/data-table";
import { getAllStoreProducts } from "@/queries/product";
import { columns } from "./columns";

export default async function SellerProductsPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;
  const products = await getAllStoreProducts(storeUrl);
  return (
    <DataTable
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      filterValue="image"
      data={products}
      columns={columns}
      searchPlaceholder="Search product image ..."
    />
  );
}
