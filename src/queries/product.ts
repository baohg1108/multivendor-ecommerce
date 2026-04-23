"use server";

import { db } from "@/lib/db";
import {
  ProductPageType,
  ProductShippingDetailsType,
  ProductWithVariantType,
  VariantSimplified,
} from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma, PrismaClient, Product } from "@prisma/client";
import slugify from "slugify";
import { VariantImageType } from "@/lib/types";
import { cookies } from "next/headers";
import { Store } from "@prisma/client";
import { FreeShippingWithCountriesType } from "@/lib/types";
import { RatingStatisticsType } from "@/lib/types";

export type SortOrder = "asc" | "desc";

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
): Promise<{ name: string }> => {
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

    // check if variant already exists
    const existingVariant = await db.productVariant.findUnique({
      where: {
        id: product.variantId,
      },
    });

    // find the store by its URL
    const store = await db.store.findUnique({
      where: {
        url: storeUrl,
        userId: user.id,
      },
    });
    if (!store) throw new Error("Store not found");

    if (existingProduct) {
      if (existingVariant) {
        // update existing variant and product
        await handleCreateVariant(product);
      } else {
        // create new variant
      }
    } else {
      handleProductCreate(product, store.id);
      // create new product
    }

    // generate unique slugs for product and variant
    const productSlug = await generateUniqueSlug(
      slugify(product.name, { trim: true, lower: true, replacement: "-" }),
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

const handleProductCreate = async (
  product: ProductWithVariantType,
  storeId: string,
) => {
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

  const productData = {
    id: product.productId,
    name: product.name,
    description: product.description,
    slug: productSlug,
    store: {
      connect: { id: storeId },
    },
    category: {
      connect: { id: product.categoryId },
    },
    subCategory: {
      connect: { id: product.subCategoryId },
    },
    ...(product.offerTagId
      ? {
          offerTag: {
            connect: { id: product.offerTagId },
          },
        }
      : {}),
    brand: product.brand,
    specs: {
      create: product.product_specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
      })),
    },
    questions: {
      create: product.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    },
    variants: {
      create: [
        {
          id: product.variantId,
          variantName: product.variantName,
          variantDescription: product.variantDescription,
          slug: variantSlug,
          variantImage: product.variantImage,
          sku: product.sku,
          weight: product.weight,
          keywords: product.keywords.join(","),
          isSale: product.isSale,
          saleEndDate: product.saleEndDate,
          images: {
            create: product.images.map((img) => ({
              url: img.url,
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
          specs: {
            create: product.product_specs.map((spec) => ({
              name: spec.name,
              value: spec.value,
            })),
          },
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      ],
    },
    shippingFeeMethod: product.shippingFeeMethod,
    freeShippingForAllCountries: product.freeShippingForAllCountries,
    freeShipping: product.freeShippingForAllCountries
      ? undefined
      : product.freeShippingCountriesIds &&
          product.freeShippingCountriesIds.length > 0
        ? {
            create: {
              eligibleCountries: {
                create: product.freeShippingCountriesIds.map((country) => ({
                  country: { connect: { id: country.value } },
                })),
              },
            },
          }
        : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  const new_product = await db.product.create({ data: productData });

  return new_product;
};

const handleCreateVariant = async (product: ProductWithVariantType) => {
  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, {
      trim: true,
      lower: true,
      replacement: "-",
    }),
    "productVariant",
  );

  const variantData = {
    variants: [
      {
        id: product.variantId,
        productId: product.productId,
        variantName: product.variantName,
        variantDescription: product.variantDescription,
        slug: variantSlug,
        isSale: product.isSale,
        saleEndDate: product.isSale ? product.saleEndDate : "",
        sku: product.sku,
        keywords: product.keywords.join(","),
        weight: product.weight,
        variantImage: product.variantImage,
        images: {
          create: product.images.map((img) => ({
            url: img.url,
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

        specs: {
          create: product.product_specs.map((spec) => ({
            name: spec.name,
            value: spec.value,
          })),
        },

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    ],
  };

  const new_variant = await db.productVariant.create({
    data: variantData,
  });
  return new_variant;
};

//
export const getProductMainInfo = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      questions: true,
      specs: true,
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
    offerTagId: product.offerTagId || undefined,
    storeId: product.storeId,
    shippingFeeMethod: product.shippingFeeMethod,
    questions: product.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    })),
    product_specs: product.specs.map((spec) => ({
      name: spec.name,
      value: spec.value,
    })),
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
  filters: any = {},
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

  // apply category filter url
  if (filters.category) {
    const category = await db.category.findUnique({
      where: {
        url: filters.category,
      },
      select: { id: true },
    });

    if (category) {
      wherClause.AND.push({ categoryId: category.id });
    }
  }

  // apply sub-category filter url
  if (filters.subCategory) {
    const subCategory = await db.subCategory.findUnique({
      where: {
        url: filters.subCategory,
      },
      select: { id: true },
    });

    if (subCategory) {
      wherClause.AND.push({ subCategoryId: subCategory.id });
    }
  }

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
  // get user current
  const user = await currentUser();

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

  // fetch store followers count
  const storeFollowersCount = await getStoreFollowersCount(product.store.id);

  // check if user is following store
  const isUserFollowingStore = await checkIfUserFollowingStore(
    product.storeId,
    user?.id || "",
  );

  const ratingStatistics = await getRatingStatistics(product.id);

  return formatProductResponse(
    product,
    productShippingDetails,
    storeFollowersCount,
    isUserFollowingStore,
    ratingStatistics,
  );
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
      reviews: {
        include: {
          images: true,
          user: true,
        },
        take: 4,
      },
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

  // get variant info
  const variantsInfo = await db.productVariant.findMany({
    where: {
      productId: product.id,
    },
    include: {
      images: true,
      sizes: true,
      colors: true,
      product: {
        select: { slug: true },
      },
    },
  });

  return {
    ...product,
    variantsInfo: variantsInfo.map((variant) => ({
      variantName: variant.variantName,
      variantUrl: `/product/${productSlug}/${variant.slug}`,
      variantImage: variant.variantImage || "",
      variantSlug: variant.slug,
      sizes: variant.sizes,
      images: variant.images,
      colors: variant.colors.map((color) => color.name).join(","),
    })),
  };
};

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
  storeFollowersCount: number,
  isUserFollowingStore: boolean,
  ratingStatistics: RatingStatisticsType,
) => {
  if (!product) return;
  const variant = product?.variants[0];
  const { store, category, subCategory, offerTag, questions, reviews } =
    product;
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
    variantImage: variant.variantImage,
    store: {
      id: product.store.id,
      url: product.store.url,
      name: product.store.name,
      logo: store.logo,
      followersCount: storeFollowersCount,
      isUserFollowingsStore: isUserFollowingStore,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    // review: product.reviews,
    reviews,
    numberReviews: ratingStatistics.totalReviews,
    reviewsStatistics: {
      ratingStatistics: ratingStatistics,
      reviewsWithImagesCount: ratingStatistics.reviewsWithImagesCount,
    },
    shippingDetails: shippingDetails,
    relatedProducts: [],
    variantInfo: product.variantsInfo,
  };
};

const getStoreFollowersCount = async (storeId: string) => {
  const storeFollowersCount = await db.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      _count: {
        select: {
          followers: true,
        },
      },
    },
  });
  return storeFollowersCount?._count.followers || 0;
};

const checkIfUserFollowingStore = async (
  storeId: string,
  userId: string | undefined,
) => {
  let isUserFollowingStore = false;
  if (userId) {
    const storeFollowersInfo = await db.store.findUnique({
      where: {
        id: storeId,
      },
      select: {
        followers: {
          where: {
            id: userId,
          },
          select: { id: true },
        },
      },
    });
    if (storeFollowersInfo && storeFollowersInfo.followers.length > 0) {
      isUserFollowingStore = true;
    }
  }
  return isUserFollowingStore;
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

export const getRatingStatistics = async (productId: string) => {
  const ratingStars = await db.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: {
      rating: true,
    },
  });

  const totalReviews = ratingStars.reduce(
    (sum, item) => sum + item._count.rating,
    0,
  );
  const ratingCounts = Array(5).fill(0);

  ratingStars.forEach((stat) => {
    const rating = Math.floor(stat.rating);
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1] = stat._count.rating;
    }
  });

  return {
    ratingStatistics: ratingCounts.map((count, index) => ({
      rating: index + 1,
      numReviews: count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    })),
    reviewsWithImagesCount: await db.review.count({
      where: {
        productId,
        images: { some: {} },
      },
    }),
    totalReviews,
  };
};

export const getProductFilteredReviews = async (
  productId: string,
  filters: { rating?: number; hasImages?: boolean },
  sort: { orderBy: "latest" | "oldest" | "highest" } | undefined,
  page: number = 1,
  pageSize: number = 2,
) => {
  const reviewFilter: Prisma.ReviewWhereInput = {
    productId,
  };

  if (filters.rating) {
    reviewFilter.rating = filters.rating;
  }

  if (filters.hasImages) {
    reviewFilter.images = { some: {} };
  }

  const sortOpion: { createdAt?: SortOrder; rating?: SortOrder } =
    sort && sort.orderBy === "latest"
      ? { createdAt: "desc" }
      : sort && sort.orderBy === "oldest"
        ? { createdAt: "asc" }
        : sort && sort.orderBy === "highest"
          ? { rating: "desc" }
          : { createdAt: "desc" };

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const [reviews, totalReviews] = await Promise.all([
    db.review.findMany({
      where: reviewFilter,
      include: {
        images: true,
        user: true,
      },
      orderBy: sortOpion,
      skip,
      take,
    }),
    db.review.count({ where: reviewFilter }),
  ]);

  return {
    reviews,
    totalReviews,
  };
};
