import { getAllSubCategories } from "@/queries/subCategory";
import { Prisma } from "./../generated/prisma/index.d";
export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
  value?: string;
}

// Subcategory + parent category
export type SubCategoryWithCategoryType = Prisma.PromiseReturnType<
  typeof getAllSubCategories
>[0];
