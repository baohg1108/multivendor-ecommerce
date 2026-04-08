"use server";

// Cleck
import { currentUser } from "@clerk/nextjs/server";

// Prisma model
import { SubCategory } from "@prisma/client";

// db
import { db } from "@/lib/db";

// Prisma model

export const upsertSubCategory = async (subCategory: SubCategory) => {
  try {
    // get current user
    const user = await currentUser();

    // ensure user is authenticated
    if (!user) {
      throw new Error("Unauthorized");
    }

    // verify user is admin permission
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    // ensure subcategory data is provided
    if (!subCategory) {
      throw new Error("Please provide subcategory data !");
    }

    if (!subCategory.name || !subCategory.url || !subCategory.categoryId) {
      throw new Error(
        "Subcategory name, URL, and category are required fields",
      );
    }

    // throw error if subcategory same name or alias already exists URL
    const existSubCategory = await db.subCategory.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: subCategory.name }, { url: subCategory.url }],
          },
          {
            NOT: { id: subCategory.id },
          },
        ],
      },
    });
    console.log("existSubCategory:", existSubCategory);
    console.log("subCategory being upserted:", subCategory);

    // throw error if subcategory with same name or alias already exists
    if (existSubCategory) {
      let errorMessage = "";
      if (existSubCategory.name === subCategory.name) {
        errorMessage += "Subcategory name already exists";
      } else if (existSubCategory.url === subCategory.url) {
        errorMessage += "Subcategory URL already exists";
      }
      throw new Error(errorMessage);
    }

    // upsert subcategory into database
    const subCategoryDetails = await db.subCategory.upsert({
      where: {
        id: subCategory.id,
      },
      update: {
        name: subCategory.name,
        image: subCategory.image,
        url: subCategory.url,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        updatedAt: new Date(),
      },
      create: {
        id: subCategory.id,
        name: subCategory.name,
        image: subCategory.image,
        url: subCategory.url,
        featured: subCategory.featured,
        categoryId: subCategory.categoryId,
        updatedAt: new Date(),
      },
    });
    return subCategoryDetails;
  } catch (error) {
    // log error
    console.error("Error upserting subcategory:", error);
    throw error;
  }
};

export const getAllSubCategories = async () => {
  const subCategories = await db.subCategory.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return subCategories;
};

export const getSubCategory = async (subCategoryId: string) => {
  if (!subCategoryId) {
    throw new Error("Please provide subcategory ID");
  }

  // retrieve subcategory by id from database
  const subCategory = await db.subCategory.findUnique({
    where: { id: subCategoryId },
  });
  return subCategory;
};

export const deleteSubCategory = async (subCategoryId: string) => {
  const user = await currentUser();

  if (!user) return;

  if (user.privateMetadata.role !== "ADMIN") {
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry");
  }

  if (!subCategoryId) {
    throw new Error("Please provide subcategory ID");
  }

  const response = await db.subCategory.delete({
    where: {
      id: subCategoryId,
    },
  });
  return response;
};
