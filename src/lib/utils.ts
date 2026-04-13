import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const getDominantColors = async (
  imageUrl: string,
): Promise<string[]> => {
  if (typeof window === "undefined") {
    return [];
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = async () => {
      try {
        const { getPalette } = await import("colorthief");
        const palette = await getPalette(img, { colorCount: 4 });
        const colors = (palette || []).map((color) =>
          color.hex().toUpperCase(),
        );

        resolve(colors);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Failed to get image palette"),
        );
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};
