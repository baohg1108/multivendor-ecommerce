import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Country } from "./types";
import { countries } from "@/data/countries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// define helper functions to get user country
const DEFAULT_COUNTRY: Country = {
  name: "Viet Nam",
  code: "VN",
  city: "",
  region: "",
};

export default async function getUserCountry(): Promise<Country> {
  let userCountry: Country = DEFAULT_COUNTRY;
  try {
    const response = await fetch(
      `https://ipinfo.io/?token=${process.env.IP_INFO_TOKEN}`,
    );

    if (response.ok) {
      const data = await response.json();
      userCountry = {
        name:
          countries.find((c) => c.code === data.country)?.name || data.country,
        code: data.country,
        city: data.city || "",
        region: data.region || "",
      };
    }
  } catch (error) {
    console.error("Error fetching user country:", error);
  }
  return userCountry;
}

export const getShippingDatesRange = (
  minDays: number,
  maxDays: number,
  date?: Date,
): { minDate: string; maxDate: string } => {
  const currentDate = date ? new Date(date) : new Date();
  const minDate = new Date(currentDate);
  minDate.setDate(currentDate.getDate() + minDays);
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + maxDays);
  return {
    minDate: minDate.toDateString(),
    maxDate: maxDate.toDateString(),
  };
};
