"use server";

import { db } from "@/lib/db";
import { ProductWithVariantType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { spec } from "node:test/reporters";
import slugify from "slugify";

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

// function: upsertProduct
// description: upserts a product and its variant into the database, ensuring proper association
// access level: seller only
// parameters::
// -product: ProductWithVariant object containing the product and variant data to be upserted
// -storeUrl: The URL of the storr which the product belongs
// return: newly created or updated product with variant details
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
          value: question.answer,
        })),
      },
      store: { connect: { id: store.id } },
      category: { connect: { id: product.categoryId } },
      subCategory: { connect: { id: product.subCategoryId } },
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

// function:getProductMainInfo
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
