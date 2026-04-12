import { Prisma } from "@/generated/prisma/browser";
import { PrismaClient } from "@/generated/prisma/internal/class";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// helper function to generate a unique slug
// export const generateUniqueSlug = async (
//   baseSlug: string,
//   model: keyof PrismaClient,
//   field: string = "slug",
//   separator: string = "-",
// ) => {
//   let slug = baseSlug;
//   let suffix = 1;

//   while (true) {
//     const existingRecord = await (db[model] as any).findFirst({
//       where: {
//         [field]: slug,
//       },
//     });
//     if (!existingRecord) {
//       break;
//     }
//     slug = `${slug}${separator}${suffix}`;
//     suffix++;
//   }
//   return slug;
// };

// helper function to grid classnames depending on length of images
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-3 grid-rows-6";
    case 6:
      return "grid-cols-3 grid-rows-2";
    default:
      return "";
  }
};
