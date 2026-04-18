import * as z from "zod";

// Category form schema
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

// Sub category form schema
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

// Store form schema
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
        "Store phone number can only contain digits and an optional leading +",
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

// Product form schema
export const ProductFormSchema = z.object({
  name: z
    .string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    })
    .min(2, { message: "Product name must be at least 2 characters long" })
    .max(100, { message: "Product name must be at most 100 characters long" })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9\s\-]+$/, {
      message:
        "Product name can only contain letters, numbers, spaces, and hyphens",
    }),
  description: z
    .string({
      required_error: "Product description is required",
      invalid_type_error: "Product description must be a string",
    })
    .min(200, {
      message: "Product description must be at least 200 characters long",
    }),
  variantName: z
    .string({
      required_error: "Variant name is required",
      invalid_type_error: "Variant name must be a string",
    })
    .min(2, { message: "Variant name must be at least 2 characters long" })
    .max(100, { message: "Variant name must be at most 100 characters long" })
    .regex(/^(?!.*(?:[-_]){2,})[a-zA-Z0-9\s\-]+$/, {
      message:
        "Variant name can only contain letters, numbers, spaces, and hyphens",
    }),
  variantDescription: z.string().optional(),
  images: z
    .object({ url: z.string() })
    .array()
    .min(3, { message: "Product must have at least 3 images" })
    .max(6, { message: "Product must have at most 6 images" }),
  variantImages: z
    .object({ url: z.string() })
    .array()
    .min(1, { message: "Variant must have exactly 1 image" })
    .max(1, { message: "Variant must have exactly 1 image" }),
  categoryId: z
    .string({
      required_error: "Product category ID is mandatory",
      invalid_type_error: "Product category ID must be a string",
    })
    .uuid(),
  subCategoryId: z
    .string({
      required_error: "Product sub-category ID is mandatory",
      invalid_type_error: "Product sub-category ID must be a string",
    })
    .uuid(),
  offerTagId: z.string().uuid().or(z.literal("")).optional(),
  isSale: z.boolean().default(false),
  brand: z
    .string({
      required_error: "Product brand is required",
      invalid_type_error: "Product brand must be a string",
    })
    .min(2, { message: "Product brand must be at least 2 characters long" })
    .max(50, { message: "Product brand must be at most 50 characters long" }),
  sku: z
    .string({
      required_error: "Product SKU is required",
      invalid_type_error: "Product SKU must be a string",
    })
    .min(6, { message: "Product SKU must be at least 6 characters long" })
    .max(50, { message: "Product SKU must be at most 50 characters long" }),
  keywords: z
    .string()
    .array()
    .min(5, { message: "Product keywords must have at least 5 items" })
    .max(10, { message: "Product keywords must have at most 10 items" }),

  // ✅ Top-level — not nested inside colors
  colors: z
    .object({ color: z.string() })
    .array()
    .min(1, { message: "Product must have at least 1 color" }),
  sizes: z
    .object({
      size: z.string(),
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
      price: z.number().min(0.01, { message: "Price must be at least 0.01" }),
      discount: z.number().min(0).default(0),
    })
    .array()
    .min(1, { message: "Product must have at least 1 size" })
    .refine(
      (sizes) =>
        sizes.every((s) => s.size.length > 0 && s.quantity > 0 && s.price > 0),
      { message: "All size inputs must be filled correctly" },
    ),
  product_specs: z
    .object({ name: z.string(), value: z.string() })
    .array()
    .min(1, { message: "Provide at least one product spec" })
    .refine(
      (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
      { message: "All product spec inputs must be filled correctly" },
    ),
  variant_specs: z
    .object({ name: z.string(), value: z.string() })
    .array()
    .min(1, { message: "Provide at least one variant spec" })
    .refine(
      (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
      { message: "All variant spec inputs must be filled correctly" },
    ),
  questions: z
    .object({ question: z.string(), answer: z.string() })
    .array()
    .min(1, { message: "Provide at least one question" })
    .refine(
      (questions) =>
        questions.every((q) => q.question.length > 0 && q.answer.length > 0),
      { message: "All question inputs must be filled correctly" },
    ),
  saleEndDate: z.string().optional(),
});

// Store default shipping details form schema
export const StoreShippingFormSchema = z.object({
  defaultShippingService: z
    .string({
      required_error: "Shipping service name is required",
      // invalid_type_error: "Default shipping service must be a string",
    })
    .min(2, {
      message: "Shipping service name must be at least 2 characters long",
    })
    .max(50, {
      message: "Shipping service name must be at most 50 characters long",
    }),
  defaultShippingFeePerItem: z.number(),
  defaultShippingFeeForAdditionalItem: z.number(),
  defaultShippingFeeFixed: z.number(),
  defaultShippingFeePerKg: z.number(),
  defaultDeliveryTimeMin: z.number(),
  defaultDeliveryTimeMax: z.number(),
  returnPolicy: z.string(),
});

export const ShippingRateFormSchema = z.object({
  shippingService: z
    .string({
      required_error: "Shipping service name is required",
      invalid_type_error: "Shipping service name must be a string",
    })
    .min(2, {
      message: "Shipping service name must be at least 2 characters long",
    })
    .max(50, {
      message: "Shipping service name must be at most 50 characters long",
    }),
  countryId: z.string().uuid().optional(),
  countryName: z.string().optional(),
  shippingFeePerItem: z.number(),
  shippingFeeForAdditionalItem: z.number(),
  shippingFeeFixed: z.number(),
  shippingFeePerKg: z.number(),
  deliveryTimeMin: z.number(),
  deliveryTimeMax: z.number(),
  returnPolicy: z.string().min(1, "Return policy is required"),
});

export const OfferTagFormSchema = z.object({
  name: z
    .string({
      required_error: "Category name is required.",
      invalid_type_error: "Category nale must be a string.",
    })
    .min(2, { message: "Category name must be at least 2 characters long." })
    .max(50, { message: "Category name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z0-9\s&$.%,']+$/, {
      message:
        "Only letters, numbers, and spaces are allowed in the category name.",
    }),
  url: z
    .string({
      required_error: "Category url is required",
      invalid_type_error: "Category url must be a string",
    })
    .min(2, { message: "Category url must be at least 2 characters long." })
    .max(50, { message: "Category url cannot exceed 50 characters." })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        "Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
    }),
});
