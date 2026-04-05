import { features } from "process";
import * as z from "zod";

// category form schema
export const CategoryFormSchema = z.object({
  name: z
    .string({
      required_error: "Category name is required",
      invalid_type_error: "Category name must be a string",
    })
    .min(2, { message: "Category name must be at least 2 characters long" })
    .max(50, { message: "Category name must be at most 50 characters long" })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Category name can only contain letters, numbers, and spaces",
    }),

  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, { message: "Category must have exactly one image" }),

  url: z
    .string({
      required_error: "Category URL is required",
      invalid_type_error: "Category URL must be a string",
    })
    .min(2, { message: "Category URL must be at least 2 characters long" })
    .max(100, { message: "Category URL must be at most 100 characters long" })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9\-]+$/, {
      message: "Category URL can only contain letters, numbers, and hyphens",
    }),

  featured: z.boolean().default(false),
});
