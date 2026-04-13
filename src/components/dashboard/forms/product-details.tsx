"use client";

// React
import React, { useState } from "react";
import { useEffect } from "react";

// Pisma model
import { Category } from "@prisma/client";

// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormSchema } from "@/lib/schemas";

// UI components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

import { ProductWithVariantType } from "@/lib/types";

import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import { getAllSubCategoriesForCategory } from "@/queries/category";

import { Checkbox } from "@/components/ui/checkbox";

import ReactTags from "@/components/dashboard/forms/react-tags";

interface SubCategoryOption {
  id: string;
  name: string;
  categoryId: string;
}

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  subCategories: SubCategoryOption[];
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  categories,
  subCategories: initialSubCategories,
}) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // Satae of subCategories
  const [subCategories, setSubCategories] = React.useState<SubCategoryOption[]>(
    initialSubCategories || [],
  );

  // State of colors
  const [colors, setColors] = React.useState<{ color: string }[]>([
    // ...(data?.colors?.length ? data.colors : [{ color: "" }]),
    { color: "" },
  ]);

  // State of sizes
  const [sizes, setSizes] = React.useState<
    { size: string; quantity: number; price: number; discount: number }[]
  >([{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.variantName || "",
      variantDescription: data?.variantDescription || "",
      images: data?.images || [],
      categoryId: data?.categoryId || "",
      subCategoryId: data?.subCategoryId || "",
      brand: "",
      sku: data?.sku || "",
      colors: {
        color: data?.colors?.map((color) => color.color) || [""],
        sizes: data?.sizes || [
          {
            size: "",
            quantity: 1,
            price: 0.01,
            discount: 0,
          },
        ],
      },
      keywords: data?.keywords || [],
      isSale: data?.isSale || false,
    },
  });

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  // extract error state form state and validation
  const errors = form.formState.errors;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // UseEffect to get subcategories based on category selection
  useEffect(() => {
    if (!selectedCategoryId) {
      form.setValue("subCategoryId", "");
      return;
    }

    let isActive = true;
    const fetchSubCategories = async () => {
      const res = await getAllSubCategoriesForCategory(selectedCategoryId);
      if (isActive) {
        setSubCategories(res);
      }
    };

    fetchSubCategories();

    return () => {
      isActive = false;
    };
  }, [selectedCategoryId, form]);

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        description: data?.description || "",
        variantName: data?.variantName || "",
        variantDescription: data?.variantDescription || "",
        images: data?.images || [],
        categoryId: data?.categoryId || "",
        subCategoryId: data?.subCategoryId || "",
        brand: "",
        sku: data?.sku || "",
        colors: {
          color: data?.colors?.map((color) => color.color) || [""],
          sizes: data?.sizes || [
            {
              size: "",
              quantity: 1,
              price: 0.01,
              discount: 0,
            },
          ],
        },
        keywords: data?.keywords || [],
        isSale: data?.isSale || false,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (!selectedCategoryId) {
      form.setValue("subCategoryId", "");
      return;
    }

    const selectedSubCategoryId = form.getValues("subCategoryId");
    const isValidSubCategory = subCategories.some(
      (item) =>
        item.id === selectedSubCategoryId &&
        item.categoryId === selectedCategoryId,
    );

    if (!isValidSubCategory) {
      form.setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, subCategories, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      console.info("Product payload", values);
      toast.success(
        data?.productId
          ? "Product has been updated successfully!"
          : "Product form is valid and ready to connect to your product API.",
      );
      router.refresh();
    } catch (error) {
      console.error("Error submitting product form:", error);

      // sonner toast for error
      toast.error("Oops! Something went wrong", {
        description: (error as Error).message,
      });
    }
  };

  // handle keywords input
  const [keywords, setKeywords] = useState<string[]>(data?.keywords || []);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) {
      return;
    }
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (i: number) => {
    setKeywords(keywords.filter((_, index) => index !== i));
  };

  // whenerever colors, sizes, or keywords change, update the form values accordingly
  useEffect(() => {
    // form.setValue(
    //   "colors.color",
    //   colors.map((item) => item.color),
    // );
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
  }, [colors, sizes, keywords]);

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {data?.productId && data?.variantId
              ? `Update ${data?.name} product information`
              : "Let's create a product. You can edit product settings later from the settings tabs."}
          </CardDescription>
          {/* <p className="sr-only">{debugContext}</p> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* ==================== Images - colors  ====================*/}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                {/* Images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <div className="space-y-4">
                          <ImagesPreviewGrid
                            images={field.value || []}
                            onRemove={(url) =>
                              field.onChange(
                                (field.value || []).filter(
                                  (img) => img.url !== url,
                                ),
                              )
                            }
                            colors={colors}
                            setColors={setColors}
                          />
                          <FormMessage className="mt-4!"></FormMessage>
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={(field.value || []).map(
                              (image) => image.url,
                            )}
                            disabled={isLoading}
                            onChange={(url) => {
                              const currentImages =
                                form.getValues("images") || [];
                              const imageExists = currentImages.some(
                                (image) => image.url === url,
                              );

                              if (imageExists) {
                                return;
                              }

                              field.onChange([...currentImages, { url }]);
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...(field.value || []).filter(
                                  (current) => current.url !== url,
                                ),
                              ])
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="mt-2 text-center" />
                    </FormItem>
                  )}
                />
                {/* Colors */}
                <div className="w-full flex flex-col gap-y-3 xl:pl-5">
                  <ClickToAddInputs
                    details={colors}
                    setDetails={setColors}
                    initialDetail={{ color: "" }}
                    header="Colors"
                    colorPicker
                  ></ClickToAddInputs>
                  {errors.colors && (
                    <span className="text-sm font-medium text-destructive">
                      {errors.colors.message}
                    </span>
                  )}
                </div>
              </div>

              {/*==================== Name + Variantname ====================*/}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product Name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* Variant Name */}
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant Name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/*==================== Description + Variant Description ====================*/}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Product Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product Description"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Variant Description */}
                <FormField
                  control={form.control}
                  name="variantDescription"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Variant Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Variant Description"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/*==================== Categories + Subcategories ====================*/}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Category</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading || categories.length == 0}
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a category"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product SubCategory</FormLabel>
                      <FormControl>
                        <Select
                          disabled={
                            isLoading ||
                            !selectedCategoryId ||
                            subCategories.length == 0
                          }
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a subcategory"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subCategories.map((sub) => (
                              <SelectItem key={sub.id} value={sub.id}>
                                {sub.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/*==================== Brand, SKU ====================*/}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Product Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product Brand"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* sku */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SKU"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* ==================== Keyword ==================== */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem className="relative flex-1">
                      <FormLabel> Product Keywords</FormLabel>
                      <FormControl>
                        <ReactTags
                          handleAddition={handleAddition}
                          // handleDeleteKeyword={handleDeleteKeyword}
                          placeholder="Keywords (e.g., summer, cotton, etc.)"
                          classNames={{
                            tagInputField:
                              "bg-background border rounded-md p-2 w-full focus:outline-none",
                          }}
                        ></ReactTags>
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="flex flex-wrap gap-1">
                {keywords.map((k, i) => (
                  <div
                    key={i}
                    className="text-xs inline-flex items-center px-3 py-1 bg-blue-200 text-blue-700 rounded-full gap-x-2"
                  >
                    <span>{k}</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => handleDeleteKeyword(i)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              </div>

              {/* ==================== Size, Quantity, Prices, and Discounts ==================== */}
              <div className="w-full flex flex-col gap-3 xl:pl-5">
                <ClickToAddInputs
                  details={sizes}
                  setDetails={setSizes}
                  initialDetail={{
                    size: "",
                    quantity: 1,
                    price: 0.01,
                    discount: 0,
                  }}
                  header="Sizes, Quantity, Prices, and Discounts"
                ></ClickToAddInputs>
              </div>

              {/* ==================== Is on Sale ==================== */}
              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Is on Sale</FormLabel>
                      <FormDescription>
                        Is this product as on sale
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.productId && data?.variantId
                    ? "Save product information"
                    : "Create Product"}
              </Button>
              {/* Form fields would go here */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default ProductDetails;
