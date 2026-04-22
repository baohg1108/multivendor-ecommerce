import { Prisma } from "@prisma/client";
import {
  getAllStoreProducts,
  getProductPageData,
  getProducts,
  getShippingDetails,
  retrieveProductDetails,
  getRatingStatistics,
} from "@/queries/product";
import type {
  Category,
  ProductVariantImage,
  ShippingFeeMethod,
  ShippingRate,
  SubCategory,
} from "@prisma/client";
import { getStoreDefaultShippingDetails } from "@/queries/store";
import { countries } from "../data/countries.js";
import { Size, User } from "@prisma/client";
import { FreeShipping, FreeShippingCountry } from "@prisma/client";
import { Review, ReviewImage } from "@prisma/client";
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
  images: { id?: string; url: string }[];
  variantImage: string;
  categoryId: string;
  subCategoryId: string;
  offerTagId?: string;
  isSale: boolean;
  saleEndDate?: string;
  brand: string;
  sku: string;
  weight: number;
  colors: { id?: string; color: string }[];
  sizes: {
    id?: string;
    size: string;
    quantity: number;
    price: number;
    discount: number;
  }[];
  product_specs: { id?: string; name: string; value: string }[];
  variant_specs: { id?: string; name: string; value: string }[];
  keywords: string[];
  questions: { id?: string; question: string; answer: string }[];
  freeShippingForAllCountries: boolean;
  freeShippingCountriesIds: { id?: string; label: string; value: string }[];
  shippingFeeMethod: ShippingFeeMethod;

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

export interface Country {
  name: string;
  code: string;
  city: string;
  region: string;
}

export type SelectMenuOption = (typeof countries)[number];

//
export type ProductType = Prisma.PromiseReturnType<
  typeof getProducts
>["products"][0];

//
export type VariantSimplified = {
  variantId: string;
  variantSlug: string;
  variantName: string;
  images: ProductVariantImage[];
  sizes: Size[];
};

export type VariantImageType = {
  url: string;
  image: string;
};

//
export type ProductPageType = Prisma.PromiseReturnType<
  typeof retrieveProductDetails
>;

//
export type ProductPageDataType = Prisma.PromiseReturnType<
  typeof getProductPageData
>;

//
export type ProductShippingDetailsType = Prisma.PromiseReturnType<
  typeof getShippingDetails
>;

export type RatingStatisticsType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>;

export type StatisticsCardType = Prisma.PromiseReturnType<
  typeof getRatingStatistics
>["ratingStatistics"];

export type FreeShippingWithCountriesType = FreeShipping & {
  eligibleCountries: FreeShippingCountry[];
};

export type CartProductType = {
  productId: string;
  variantId: string;
  productSlug: string;
  variantSlug: string;
  name: string;
  variantName: string;
  image: string;
  variantImage: string;
  sizeId: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  weight: number;
  shippingMethod: string;
  shippingService: string;
  shippingFee: number;
  extraShippingFee: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isFreeShipping: boolean;
  freeShippingForAllCountries: boolean;
};

export type ReviewWithImageType = Review & {
  images: ReviewImage[];
  user: User;
};

export type ReviewsFiltersType = {
  rating?: number;
  hasImages?: boolean;
};

export type ReviewsOrderType = {
  orderBy: "latest" | "oldest" | "highest";
};

export type VariantInfoType = {
  variantName: string;
  variantImage: string;
  variantUrl: string;
  variantSlug: string;
  images: ProductVariantImage[];
  sizes: Size[];
  colors: string;
};

export type FeaturedCategoryType = Category;

export type ReviewDetailsType = {
  id: string;
  review: string;
  rating: number;
  images: { url: string }[];
  size: string;
  color: string;
  variant: string;
  quantity: string;
};
