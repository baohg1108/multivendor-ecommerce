"use server";
// fucntion: upsertCategory
// Description: Upsert a category into database, upadting if it exists creating new one
// permission: admin only
// paraments:
// -category: category object containing details of the category to be upserted
//

// Cleck
import { currentUser } from "@clerk/nextjs/server";

// Prisma model
import { Category } from "@prisma/client";

// db
import { db } from "@/lib/db";

// Prisma model

// type UpsertCategpryInput = {
//   id: string;
//   name: string;
//   url: string;
//   image: string;
//   featured: boolean;
// };

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
