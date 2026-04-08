"use server";

// Cleck
import { currentUser } from "@clerk/nextjs/server";

// Prisma model
import { Category } from "@prisma/client";

// db
import { db } from "@/lib/db";

// Prisma model

export const upsertCategory = async (category: Category) => {
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

    // ensure category data is provided
    if (!category) {
      throw new Error("Please provide category data !");
    }

    // throw error if category same name or alias already exists URL
    const existCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: { id: category.id },
          },
        ],
      },
    });
    console.log("existCategory:", existCategory);
    console.log("category being upserted:", category);

    // throw error if category with same name or alias already exists
    if (existCategory) {
      let errorMessage = "";
      if (existCategory.name === category.name) {
        errorMessage += "Category name already exists";
      } else if (existCategory.url === category.url) {
        errorMessage += "Category URL already exists";
      }
      throw new Error(errorMessage);
    }

    // upsert category into database
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: {
        name: category.name,
        url: category.url,
        image: category.image,
        featured: category.featured,
        updatedAt: new Date(),
      },
      create: {
        id: category.id,
        name: category.name!,
        url: category.url!,
        image: category.image,
        featured: category.featured,
        updatedAt: new Date(),
      },
    });
    return categoryDetails;
  } catch (error) {
    // log error
    console.error("Error upserting category:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};

export const getCategory = async (categoryId: string) => {
  if (!categoryId) {
    throw new Error("Please provide category ID");
  }

  // retrieve category by id from database
  const category = await db.category.findUnique({
    where: { id: categoryId },
  });
  return category;
};

export const deleteCategory = async (categoryId: string) => {
  const user = await currentUser();

  if (!user) return;

  if (user.privateMetadata.role !== "ADMIN") {
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry");
  }

  if (!categoryId) {
    throw new Error("Please provide category ID");
  }

  const response = await db.category.delete({
    where: {
      id: categoryId,
    },
  });
  return response;
};
