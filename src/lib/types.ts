import { SubCategory } from "@prisma/client";
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

// Product + variant
export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { url: string }[];
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
};
