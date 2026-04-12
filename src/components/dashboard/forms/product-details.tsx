"use client";

// React
import React from "react";
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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

import { ProductWithVariantType } from "@/lib/types";

import ImagesPreviewGrid from "../shared/images-preview-grid";

interface ProductDetailsProps {
  data?: ProductWithVariantType;
  categories: Category[];
  storeUrl: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
}) => {
  const debugContext = `${categories.length}:${storeUrl}`;
  // Initializing nessary hooks and states
  const router = useRouter();

  const [subCategories, setSubCategories] = React.useState<Category[]>([]);

  const [colors, setColors] = React.useState<{ color: string }[]>([
    { color: "" },
  ]);

  const [images, setImages] = React.useState<{ url: string }[]>([]);

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

  // useEffect to update subcategories when category changes
  // useEffect(() => {
  //   const getSubCategories = async () => {
  //     const res = await getAllCategoriesForCategory(form.watch().categoryId);
  //     setSubCategories(res);
  //   };
  //   getSubCategories();
  // }, [form.watch("categoryId")]);

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // extract errors state from form
  const errors = form.formState.errors;

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

  const [keywords, setKeywords] = React.useState<string[]>([]);

  interface Keyword {
    id: string;
    text: string;
  }

  const handleAddition = (keyword: Keyword) => {
    if (keywords.length === 10) return;
    setKeywords([...keywords, keyword.text]);
  };

  const handleDeleteKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  useEffect(() => {
    form.setValue(
      "colors.color",
      colors.map((item) => item.color),
    );
    form.setValue("colors.sizes", sizes);
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
              {/* Images - colors */}
              <div className="flex flex-col gap-y-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      {/* <FormLabel>Product Images</FormLabel> */}
                      <FormControl>
                        <>
                          <ImagesPreviewGrid
                            images={form.getValues().images}
                            onRemove={(url) =>
                              field.onChange([
                                ...(field.value || []).filter(
                                  (current) => current.url !== url,
                                ),
                              ])
                            }
                          />
                          <FormMessage className="!mt-4"></FormMessage>
                          <ImageUpload
                            dontShowPreview
                            type="standard"
                            value={(field.value || []).map(
                              (image) => image.url,
                            )}
                            disabled={isLoading}
                            onChange={(url) => {
                              setImages((prevImages) => {
                                const updatedImages = [...prevImages, { url }];
                                field.onChange(updatedImages);
                                return updatedImages;
                              });
                            }}
                            onRemove={(url) =>
                              field.onChange([
                                ...(field.value || []).filter(
                                  (current) => current.url !== url,
                                ),
                              ])
                            }
                          />
                        </>
                      </FormControl>
                      <FormMessage className="mt-2 text-center" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name */}
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
              {/* Description */}
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

              {/*  */}
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
