"use client";

// React
import React, { useState } from "react";
import { useEffect } from "react";

// Pisma model
import type { Category } from "@prisma/client";

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

import type { ProductWithVariantType } from "@/lib/types";

import ImagesPreviewGrid from "../shared/images-preview-grid";
import ClickToAddInputs from "./click-to-add";
import { getAllSubCategoriesForCategory } from "@/queries/category";

import { Checkbox } from "@/components/ui/checkbox";

import ReactTags from "@/components/dashboard/forms/react-tags";

import { upsertProduct } from "@/queries/product";
import { v4 } from "uuid";
import type { SubCategory } from "@prisma/client";
import { format } from "date-fns";
import { OfferTag } from "@prisma/client";

// React date picker
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Jodit react
import JoditEditor from "jodit-react";
interface ProductDetailsProps {
  data?: Partial<ProductWithVariantType>;
  categories: Category[];
  storeUrl: string;
  offerTags: OfferTag[];
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  categories,
  storeUrl,
  offerTags,
}) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // Jodit editor ref
  const productDescEditor = React.useRef(null);
  const variantDescEditor = React.useRef(null);

  // State of subCategories
  const [subCategories, setSubCategories] = React.useState<SubCategory[]>([]);

  // State of colors
  const [colors, setColors] = React.useState<{ color: string }[]>(
    data?.colors || [{ color: "" }],
  );

  // State of images
  // State of sizes
  const [sizes, setSizes] = React.useState<
    { size: string; quantity: number; price: number; discount: number }[]
  >([{ size: "", quantity: 1, price: 0.01, discount: 0 }]);

  // product specs
  const [productSpecs, setProductSpecs] = React.useState<
    { name: string; value: string }[]
  >(data?.product_specs || [{ name: "", value: "" }]);

  // variant specs
  const [variantSpecs, setVariantSpecs] = React.useState<
    { name: string; value: string }[]
  >(data?.variant_specs || [{ name: "", value: "" }]);

  // question
  const [questions, setQuestions] = React.useState<
    { question: string; answer: string }[]
  >(data?.questions || [{ question: "", answer: "" }]);

  // Form hook for managing form statte and validation
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      variantName: data?.variantName || "",
      variantDescription: data?.variantDescription || "",
      images: data?.images || [],
      variantImages: data?.variantImage ? [{ url: data.variantImage }] : [],
      categoryId: data?.categoryId || "",
      subCategoryId: data?.subCategoryId || "",
      offerTagId: data?.offerTagId || "",
      brand: "",
      sku: data?.sku || "",
      colors: data?.colors || [{ color: "" }],
      sizes: data?.sizes,
      product_specs: data?.product_specs || [],
      variant_specs: data?.variant_specs || [],
      keywords: data?.keywords || [],
      isSale: data?.isSale || false,
      saleEndDate:
        data?.saleEndDate || format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    },
  });

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  // UseEffect to get subCategories when user pick/change category
  useEffect(() => {
    const getSubCategories = async () => {
      const res = await getAllSubCategoriesForCategory(selectedCategoryId);
      setSubCategories(res);
    };

    if (selectedCategoryId) {
      getSubCategories();
    }
  }, [selectedCategoryId]);

  // extract error state form state and validation
  const errors = form.formState.errors;

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        description: data?.description || "",
        variantName: data?.variantName || "",
        variantDescription: data?.variantDescription || "",
        images: data?.images || [],
        variantImages: data?.variantImage ? [{ url: data.variantImage }] : [],
        categoryId: data?.categoryId || "",
        subCategoryId: data?.subCategoryId || "",
        offerTagId: data?.offerTagId || "",
        brand: "",
        sku: data?.sku || "",
        colors: data?.colors || [{ color: "" }],
        sizes: data?.sizes || [
          { size: "", quantity: 1, price: 0.01, discount: 0 },
        ],
        keywords: data?.keywords || [],
        isSale: data?.isSale || false,
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
    try {
      // upserting category data
      await upsertProduct(
        {
          productId: data?.productId ? data.productId : v4(),
          variantId: data?.variantId ? data.variantId : v4(),
          name: values.name,
          description: values.description,
          variantName: values.variantName,
          variantDescription: values.variantDescription || "",
          images: values.images,
          variantImage: values.variantImages[0]?.url,
          categoryId: values.categoryId,
          subCategoryId: values.subCategoryId,
          offerTagId: values.offerTagId,
          isSale: values.isSale || false,
          saleEndDate: values.saleEndDate,
          brand: values.brand,
          sku: values.sku,
          colors: values.colors,
          sizes: values.sizes,
          product_specs: values.product_specs,
          variant_specs: values.variant_specs,
          keywords: values.keywords,
          questions: values.questions,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        storeUrl,
      );

      toast.success(
        data?.productId && data?.variantId
          ? "Product has been updated successfully!"
          : "Product has been created successfully!",
      );

      if (data?.productId && data?.variantId) {
        router.refresh();
      } else {
        router.push(`/dashboard/seller/stores/${storeUrl}/products`);
      }
    } catch (error) {
      console.error("Error submitting product form:", error);

      // sonner toast for error
      toast.error("Oops! Something went wrong", {
        description: (error as Error).message,
      });
    }
  };

  const handleInvalidSubmit = () => {
    toast.error("Cannot create product yet", {
      description:
        "Please check required fields (images, colors, sizes, category, subcategory, keywords) and try again.",
    });
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
    form.setValue("colors", colors);
    form.setValue("sizes", sizes);
    form.setValue("keywords", keywords);
    form.setValue("product_specs", productSpecs);
    form.setValue("variant_specs", variantSpecs);
  }, [colors, sizes, keywords, productSpecs, variantSpecs, data, form]);

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
              onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
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
                          <FormMessage className="mt-2 text-center" />
                        </div>
                      </FormControl>
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

              {/* ==================== Product and variant description editors (Tabs) */}
              <Tabs defaultValue="product" className="w-full">
                <TabsList className="w-full grid-cols-2 grid">
                  <TabsTrigger value="product">Product Description</TabsTrigger>
                  <TabsTrigger value="variant">Variant Description</TabsTrigger>
                </TabsList>
                <TabsContent value="product">
                  <FormField
                    control={form.control}
                    name="description"
                    render={() => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={productDescEditor}
                            value={form.getValues().description}
                            onChange={(content) => {
                              form.setValue("description", content);
                            }}
                          ></JoditEditor>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="variant">
                  <FormField
                    control={form.control}
                    name="variantDescription"
                    render={() => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <JoditEditor
                            ref={variantDescEditor}
                            value={form.getValues().variantDescription || ""}
                            onChange={(content) => {
                              form.setValue("variantDescription", content);
                            }}
                          ></JoditEditor>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              {/*==================== Product Description + Variant Description ====================*/}
              <div className="flex flex-col lg:flex-row gap-4 hidden">
                {/* Product Description */}

                {/* Variant Description */}
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
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="offerTagId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                              placeholder="Select an offer"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {offerTags &&
                            offerTags.map((offer) => (
                              <SelectItem key={offer.id} value={offer.id}>
                                {offer.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
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

              {/* ==================== Variant Images +  Keyword ==================== */}
              {/* Keyword */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Variant Images */}
                <FormField
                  control={form.control}
                  name="variantImages"
                  render={({ field }) => (
                    <div className="border-r pr-10">
                      <FormItem>
                        <FormLabel className="ml-14">Variant Images</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <ImageUpload
                              dontShowPreview
                              type="profile"
                              value={(field.value || []).map(
                                (image) => image.url,
                              )}
                              disabled={isLoading}
                              onChange={(url) => {
                                field.onChange([{ url }]);
                              }}
                              onRemove={(url) =>
                                field.onChange([
                                  ...(field.value || []).filter(
                                    (current) => current.url !== url,
                                  ),
                                ])
                              }
                            />
                            <FormMessage className="mt-2 text-center" />
                          </div>
                        </FormControl>
                      </FormItem>
                    </div>
                  )}
                />

                {/* Keywords */}
                <div className="w-full flex-1 space-y-3">
                  <FormField
                    control={form.control}
                    name="keywords"
                    render={() => (
                      <FormItem className="relative flex-1">
                        <FormLabel> Product Keywords</FormLabel>
                        <FormControl>
                          <ReactTags
                            handleAddition={handleAddition}
                            handleDeleteKeyword={handleDeleteKeyword}
                            placeholder="Keywords (e.g., summer, cotton, etc.)"
                            classNames={{
                              tagInputField:
                                "bg-background border rounded-md p-2 w-full focus:outline-none",
                            }}
                          ></ReactTags>
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </div>

              {/* ========== */}
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
                {errors.sizes && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.sizes.message}
                  </span>
                )}
              </div>

              {/* ==================== Product and variant specs  ====================*/}
              {/* Product specs */}
              <Tabs defaultValue="productSpecs" className="w-full">
                <TabsList className="w-full grid-cols-2 grid">
                  <TabsTrigger value="productSpecs">
                    Product Specification
                  </TabsTrigger>
                  <TabsTrigger value="variantSpecs">
                    Variant Specification
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="productSpecs">
                  <div className="w-full flex flex-col gap-3 xl:pl-5">
                    <ClickToAddInputs
                      details={productSpecs}
                      setDetails={setProductSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      header="Fill Product Specification here"
                    ></ClickToAddInputs>
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
                {/* variant specs */}
                <TabsContent value="variantSpecs">
                  <div className="w-full flex flex-col gap-3 xl:pl-5">
                    <ClickToAddInputs
                      details={variantSpecs}
                      setDetails={setVariantSpecs}
                      initialDetail={{
                        name: "",
                        value: "",
                      }}
                      header="Fill Product Variant Specification here"
                    ></ClickToAddInputs>
                    {errors.product_specs && (
                      <span className="text-sm font-medium text-destructive">
                        {errors.product_specs.message}
                      </span>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Questions  */}
              <div className="w-full flex flex-col gap-3 xl:pl-5">
                <ClickToAddInputs
                  details={questions}
                  setDetails={setQuestions}
                  initialDetail={{
                    question: "",
                    answer: "",
                  }}
                  header="Answer and Question"
                ></ClickToAddInputs>
                {errors.questions && (
                  <span className="text-sm font-medium text-destructive">
                    {errors.questions.message}
                  </span>
                )}
              </div>

              {/* ==================== Is on Sale + Sale end date ==================== */}
              {/* Is on Sale */}
              <div className="flex border rounded-md">
                <FormField
                  control={form.control}
                  name="isSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 p-4">
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
                {/* Sale end date */}
                {form.getValues().isSale && (
                  <FormField
                    control={form.control}
                    name="saleEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 p-4">
                        <FormControl>
                          <DateTimePicker
                            onChange={(date) => {
                              field.onChange(
                                date
                                  ? format(date, "yyyy-MM-dd'T'HH:mm:ss")
                                  : "",
                              );
                            }}
                            value={field.value ? new Date(field.value) : null}
                          ></DateTimePicker>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

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
