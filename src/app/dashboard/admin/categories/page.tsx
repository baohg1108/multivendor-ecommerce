import CategoryDetails from "@/components/dashboard/forms/category-details";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { Plus } from "lucide-react";
import { columns } from "./columns";

export default async function AdminCategoriesPage() {
  // fetching stores data from are found
  const categories = await getAllCategories();

  // checking if categories data is found
  if (!categories) {
    return null;
  }

  return (
    <DataTable
      actionButtonContext={
        <>
          <Plus size={15} />
          Create Category
        </>
      }
      modalChildren={<CategoryDetails />}
      newTabLink="/dashboard/admin/categories/new"
      filterValue="name"
      data={categories}
      searchPlaceholder="Search categories name..."
      columns={columns}
    />
  );
}
