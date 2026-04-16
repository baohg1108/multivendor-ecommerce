import { Prisma } from "@prisma/client";
import { getAllStoreProducts } from "@/queries/product";
import type { Category, ShippingRate, SubCategory } from "@prisma/client";
import { getStoreDefaultShippingDetails } from "@/queries/store";
export interface DashboardSidebarMenuInterface {
  label: string;
  icon: string;
  link: string;
  value?: string;
}

// Subcategory + parent category
export type SubCategoryWithCategoryType = SubCategory & {
  category: Category;
};

// Product + variant
export type ProductWithVariantType = {
  productId: string;
  variantId: string;
  name: string;
  description: string;
  variantName: string;
  variantDescription: string;
  images: { url: string }[];
  variantImage: string;
  categoryId: string;
  subCategoryId: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  colors: { color: string }[];
  sizes: { size: string; quantity: number; price: number; discount: number }[];
  product_specs: { name: string; value: string }[];
  variant_specs: { name: string; value: string }[];

  keywords: string[];
  questions: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
};

// store product
export type StoreProductType = Prisma.PromiseReturnType<
  typeof getAllStoreProducts
>[0];
// store shipping details
export type StoreDefaultShippingType = Prisma.PromiseReturnType<
  typeof getStoreDefaultShippingDetails
>;

export type CountryWithShippingRatesType = {
  countryId: string;
  countryName: string;
  shippingRate: ShippingRate;
};
