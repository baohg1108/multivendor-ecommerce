import SubCategoryDetails from "@/components/dashboard/forms/subCategory-deatils";
import { getAllCategories } from "@/queries/category";
import React from "react";

export default async function AdminNewSubCategoryPage() {
  const categories = await getAllCategories();
  return <SubCategoryDetails categories={categories} />;
}
