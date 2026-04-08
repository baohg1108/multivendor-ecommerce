import SubCategoryDetails from "@/components/dashboard/forms/subCategory-deatils";
import DataTable from "@/components/ui/data-table";
import { getAllCategories } from "@/queries/category";
import { getAllSubCategories } from "@/queries/subCategory";
import { Plus } from "lucide-react";
import React from "react";
import { columns } from "./colums";

export default async function AdminSubCategoriesPage() {
  const subCategories = await getAllSubCategories();

  if (!subCategories) {
    return null;
  }

  const categories = await getAllCategories();

  return (
    <DataTable
      actionButtonContext={
        <div className="flex items-center gap-2">
          <Plus size={15} />
          <span>Create Subcategory</span>
        </div>
      }
      modalChildren={
        <SubCategoryDetails categories={categories}></SubCategoryDetails>
      }
      filterValue="name"
      data={subCategories}
      searchPlaceholder="Search subCategory name ......"
      columns={columns}
    ></DataTable>
  );
}
