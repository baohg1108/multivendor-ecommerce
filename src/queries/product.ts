"use server";

import { db } from "@/lib/db";
import {
  ProductPageType,
  ProductShippingDetailsType,
  ProductWithVariantType,
  VariantSimplified,
} from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { VariantImageType } from "@/lib/types";
import { cookies } from "next/headers";
import { Store } from "@prisma/client";
import { FreeShippingWithCountriesType } from "@/lib/types";

const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  separator: string = "-",
) => {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingRecord = await (db[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    });

    if (!existingRecord) {
      break;
    }

    slug = `${slug}${separator}${suffix}`;
    suffix += 1;
  }

  return slug;
};

export const upsertProduct = async (
  product: ProductWithVariantType,
  storeUrl: string,
) => {
  try {
    if (!storeUrl) {
      throw new Error("Store URL is required");
    }

    // retrieve current user
    const user = await currentUser();

    // check if user is authenticated
    if (!user) throw new Error("Unauthenticated");

    // ensure user has seller privileges
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry",
      );

    // ensure product data is provided
    if (!product) throw new Error("Please provide product data");

    // check if the product already exists
    const existingProduct = await db.product.findUnique({
      where: {
        id: product.productId,
      },
    });

    // find the store by its URL
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
      },
    });
    if (!store) throw new Error("Store not found");

    // generate unique SKU for the product variant
    const productSlug = await generateUniqueSlug(
      slugify(product.name, {
        trim: true,
        lower: true,
        replacement: "-",
      }),
      "product",
    );

    const variantSlug = await generateUniqueSlug(
      slugify(product.variantName, {
        trim: true,
        lower: true,
        replacement: "-",
      }),
      "productVariant",
    );

    // common data for product variant
    const commonProductData = {
      name: product.name,
      description: product.description,
      slug: productSlug,
      brand: product.brand,
      specs: {
        create: product.product_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      questions: {
        create: product.questions.map((question) => ({
          question: question.question,
          answer: question.answer,
        })),
      },
      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
      ...(product.offerTagId
        ? { offerTag: { connect: { id: product.offerTagId } } }
        : {}),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    const commonVariantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      variantImage: product.variantImage,
      slug: variantSlug,
      isSale: product.isSale,
      saleEndDate: product.isSale ? product.saleEndDate : "",
      sku: product.sku,
      weight: product.weight,
      keywords: product.keywords.join(","),
      specs: {
        create: product.variant_specs.map((spec) => ({
          name: spec.name,
          value: spec.value,
        })),
      },
      images: {
        create: product.images.map((image) => ({
          url: image.url,
          alt: image.url.split("/").pop() || "",
        })),
      },
      colors: {
        create: product.colors.map((color) => ({
          name: color.color,
        })),
      },
      sizes: {
        create: product.sizes.map((size) => ({
          size: size.size,
          quantity: size.quantity,
          price: size.price,
          discountPrice: size.discount,
        })),
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    // if product exists, update it along with its variant
    if (existingProduct) {
      const variantData = {
        ...commonVariantData,
        product: { connect: { id: product.productId } },
      };
      return await db.productVariant.create({
        data: variantData,
      });
    } else {
      // otherview, create a new product along with its variant
      const productData = {
        ...commonProductData,
        id: product.productId,
        variants: {
          create: [
            {
              id: product.variantId,
              ...commonVariantData,
            },
          ],
        },
      };
      return await db.product.create({
        data: productData,
      });
    }
  } catch (error) {
    console.error("Error upserting product:", error);
    throw new Error("Failed to upsert product");
  }
};

//
export const getProductMainInfo = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) return null;

  return {
    productId: product.id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    categoryId: product.categoryId,
    subCategoryId: product.subCategoryId,
    offerTagId: product.offerTagId || "",
    storeId: product.storeId,
  };
};

//
export const getAllStoreProducts = async (storeUrl: string) => {
  if (!storeUrl?.trim()) {
    throw new Error("Store URL is required");
  }

  const store = await db.store.findUnique({
    where: { url: storeUrl },
  });
  if (!store) throw new Error(" Please provide a valid store URL");

  const products = await db.product.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      variants: {
        include: {
          images: true,
          colors: true,
          sizes: true,
        },
      },
      store: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return products;
};

//
export const deleteProduct = async (productId: string) => {
  const user = await currentUser();

  if (!user) throw new Error("Unauthenticated");

  if (user.privateMetadata.role !== "SELLER")
    throw new Error(
      "Unauthorized Access: Seller Privileges Required for Entry",
    );

  if (!productId) throw new Error("Please provide a product ID");

  const response = await db.product.delete({
    where: {
      id: productId,
    },
  });
  return response;
};

//
export const getProducts = async (
  filters: any,
  sortBy: "",
  page: number = 1,
  pageSize: number = 20,
) => {
  const currentPage = page;
  const limit = pageSize;
  const skip = (currentPage - 1) * limit;

  const wherClause: any = {
    AND: [],
  };

  // get all filtereds products, sorted products, and paginated products
  const products = await db.product.findMany({
    where: wherClause,
    take: limit,
    skip: skip,
    include: {
      variants: {
        include: {
          sizes: true,
          colors: true,
          images: true,
        },
      },
    },
  });

  const productsWithFilteredVariants = products.map((product) => {
    const filteredVariants = product.variants;

    const variants: VariantSimplified[] = filteredVariants.map((variant) => ({
      variantId: variant.id,
      variantSlug: variant.slug,
      variantName: variant.variantName,
      images: variant.images,
      sizes: variant.sizes,
    }));

    // extract variant image foro the product
    const variantImages: VariantImageType[] = filteredVariants.map(
      (variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage
          ? variant.variantImage
          : variant.images[0].url,
      }),
    );

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      rating: product.rating,
      sales: product.sales,
      variants,
      variantImages,
    };
  });

  // retrevie products matching the filters
  // const totalCount = await db.product.count({
  //   where: wherClause,
  // });

  const totalCount = productsWithFilteredVariants.length;

  // calculate total pages based on total count and page size
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    products: productsWithFilteredVariants,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
  };
};

export const getProductPageData = async (
  productSlug: string,
  variantSlug: string,
) => {
  const product = await retrieveProductDetails(productSlug, variantSlug);
  if (!product) return;

  // retrieve user country
  const userCountry = await getUserCountry();

  // calculate and retrieve the shipping details
  const productShippingDetails = await getShippingDetails(
    product.shippingFeeMethod,
    userCountry,
    product.store,
    product.freeShipping,
  );

  // if (!productShippingDetails) {
  // }

  return formatProductResponse(product, productShippingDetails);
};

export const retrieveProductDetails = async (
  productSlug: string,
  variantSlug: string,
) => {
  const product = await db.product.findUnique({
    where: {
      slug: productSlug,
    },
    include: {
      category: true,
      subCategory: true,
      offerTag: true,
      store: true,
      specs: true,
      questions: true,
      freeShipping: {
        include: {
          eligibleCountries: true,
        },
      },
      variants: {
        where: {
          slug: variantSlug,
        },
        include: {
          images: true,
          colors: true,
          sizes: true,
          specs: true,
        },
      },
    },
  });

  if (!product) return null;

  const variantImages = await db.productVariant.findMany({
    where: {
      productId: product.id,
    },
    select: {
      slug: true,
      variantImage: true,
    },
  });

  return {
    ...product,
    variantImages: variantImages.map((v) => ({
      url: `/product/${productSlug}/${v.slug}`,
      img: v.variantImage || "",
      slug: v.slug,
    })),
  };
};

// const getUserCountry = () => {
//   const userCountryCookie = getCookie("userCountry", { cookies }) || "";
//   const defaultCountry = { name: "Viet Nam", code: "VN" };

//   try {
//     const parsedCountry = JSON.parse(userCountryCookie);
//     if (
//       parsedCountry &&
//       typeof parsedCountry === "object" &&
//       "name" in parsedCountry &&
//       "code" in parsedCountry
//     ) {
//       return parsedCountry;
//     }
//     return defaultCountry;
//   } catch (error) {
//     console.error("Error parsing user country cookie:", error);
//     return defaultCountry;
//   }
// };
const getUserCountry = async () => {
  const cookieStore = await cookies();
  const userCountryCookie = cookieStore.get("userCountry")?.value || "";
  const defaultCountry = { name: "Viet Nam", code: "VN" };

  try {
    const parsedCountry = JSON.parse(userCountryCookie);
    if (
      parsedCountry &&
      typeof parsedCountry === "object" &&
      "name" in parsedCountry &&
      "code" in parsedCountry
    ) {
      return parsedCountry;
    }
    return defaultCountry;
  } catch (error) {
    console.error("Error parsing user country cookie:", error);
    return defaultCountry;
  }
};

const formatProductResponse = (
  product: ProductPageType,
  shippingDetails: ProductShippingDetailsType,
) => {
  if (!product) return;
  const variant = product?.variants[0];
  const { store, category, subCategory, offerTag, questions } = product;
  const { images, colors, sizes } = variant;

  return {
    productId: product.id,
    variantId: variant.id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    images,
    category,
    subCategory,
    offerTag,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    weight: variant.weight ?? 0,
    store: {
      id: product.store.id,
      url: product.store.url,
      name: product.store.name,
      logo: store.logo,
      followersCount: 10,
      isUserFollowingsStore: true,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    review: [],
    numberReviews: 122,
    reviewsStatistics: {
      ratingStatistics: [],
      reviewsWithImagesCount: 5,
    },
    shippingDetails: shippingDetails,
    relatedProducts: [],
    variantImages: product.variantImages,
  };
};

export const getShippingDetails = async (
  shippingFeeMethod: string,
  userCountry: { name: string; code: string; city: string; region: string },
  store: Store,
  isFreeShipping: FreeShippingWithCountriesType | null,
) => {
  const shippingDetails = {
    shippingFeeMethod,
    shippingService: "",
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    returnPolicy: "",
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: false,
    freeShippingForAllCountries: false,
  };
  const country = await db.country.findUnique({
    where: {
      name: userCountry.name,
      code: userCountry.code,
    },
  });

  if (country) {
    const shippingRate = await db.shippingRate.findFirst({
      where: {
        countryId: country.id,
        storeId: store.id,
      },
    });

    // get shipping rate details, if specific rate for the user's country exists, otherwise use store's default shipping details
    const returnPolicy = shippingRate?.returnPolicy ?? store.returnPolicy;
    const shippingService =
      shippingRate?.shippingService ?? store.defaultShippingService;
    const shippingFeePerItem =
      shippingRate?.shippingFeePerItem ?? store.defaultShippingFeePerItem;
    const shippingFeeForAdditionalItem =
      shippingRate?.shippingFeeForAdditionalItem ??
      store.defaultShippingFeeForAdditionalItem;
    const shippingFeePerKg =
      shippingRate?.shippingFeePerKg ?? store.defaultShippingFeePerKg;
    const shippingFeeFixed =
      shippingRate?.shippingFeeFixed ?? store.defaultShippingFeeFixed;
    const deliveryTimeMin =
      shippingRate?.deliveryTimeMin ?? store.defaultDeliveryTimeMin;
    const deliveryTimeMax =
      shippingRate?.deliveryTimeMax ?? store.defaultDeliveryTimeMax;

    shippingDetails.shippingService = shippingService;
    shippingDetails.returnPolicy = returnPolicy;
    shippingDetails.deliveryTimeMin = deliveryTimeMin;
    shippingDetails.deliveryTimeMax = deliveryTimeMax;

    if (isFreeShipping) {
      const free_shipping_countries = isFreeShipping.eligibleCountries;
      if (free_shipping_countries.length === 0) {
        shippingDetails.isFreeShipping = true;
        shippingDetails.freeShippingForAllCountries = true;
      }
      const check_free_shipping = free_shipping_countries.find(
        (c) => c.countryId === country.id,
      );

      if (check_free_shipping) {
        shippingDetails.isFreeShipping = true;
      }
    }

    switch (shippingFeeMethod) {
      case "ITEM":
        shippingDetails.shippingFee = shippingDetails.isFreeShipping
          ? 0
          : shippingFeePerItem;
        shippingDetails.extraShippingFee = shippingDetails.isFreeShipping
          ? 0
          : shippingFeeForAdditionalItem;
        break;
      case "WEIGHT":
        shippingDetails.shippingFee = shippingDetails.isFreeShipping
          ? 0
          : shippingFeePerKg;
        break;
      case "FIXED":
        shippingDetails.shippingFee = shippingDetails.isFreeShipping
          ? 0
          : shippingFeeFixed;
        break;
      default:
        break;
    }

    return shippingDetails;
  }
  return false;
};
