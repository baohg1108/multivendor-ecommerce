import { describe } from "node:test";
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

// sub category form schema
export const SubCategoryFormSchema = z.object({
  name: z
    .string({
      required_error: "SubCategory name is required",
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
  categoryId: z.string().uuid(),
});

// store form schema
export const StoreFormSchema = z.object({
  name: z
    .string({
      required_error: "Store name is required",
      invalid_type_error: "Store name must be a string",
    })
    .min(2, { message: "Store name must be at least 2 characters long" })
    .max(50, { message: "Store name must be at most 50 characters long" })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9\s\-]+$/, {
      message:
        "Store name can only contain letters, numbers, spaces, and hyphens",
    }),
  description: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be a string",
    })
    .min(30, {
      message: "Store description must be at least 30 characters long",
    })
    .max(500, {
      message: "Store description must be at most 500 characters long",
    }),
  email: z
    .string({
      required_error: "Store email is required",
      invalid_type_error: "Store email must be a string",
    })
    .email({
      message: "Invalid email address",
    }),
  phone: z
    .string({
      required_error: "Store phone number is required",
      invalid_type_error: "Store phone number must be a string",
    })
    .regex(/^\+?\d+$/, {
      message:
        "Store phone number can only contain digits and an optional leading ",
    }),
  logo: z.object({ url: z.string() }).array().length(1, "Choose a logo image"),
  cover: z
    .object({ url: z.string() })
    .array()
    .length(1, "Choose a cover image"),
  url: z
    .string({
      required_error: "Store URL is required",
      invalid_type_error: "Store URL must be a string",
    })
    .min(2, {
      message: "Store URL must be at least 2 characters long",
    })
    .max(50, {
      message: "Store URL must be at most 50 characters long",
    })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9\s\-]+$/, {
      message:
        "Store URL can only contain letters, numbers, spaces, and hyphens",
    }),
  featured: z.boolean().default(false).optional(),
  status: z.string().default("PENDING").optional(),
});
