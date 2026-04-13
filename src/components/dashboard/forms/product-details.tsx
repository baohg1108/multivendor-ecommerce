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
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Minus, Plus, X } from "lucide-react";

import { ProductWithVariantType } from "@/lib/types";

import ImagesPreviewGrid from "../shared/images-preview-grid";

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
  subCategories,
}) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  const [colors, setColors] = React.useState<{ color: string }[]>([
    ...(data?.colors?.length ? data.colors : [{ color: "" }]),
  ]);

  const [sizes, setSizes] = React.useState<
    { size: string; quantity: number; price: number; discount: number }[]
  >(
    data?.sizes?.length
      ? data.sizes
      : [{ size: "", quantity: 1, price: 0.01, discount: 0 }],
  );

  const [keywords, setKeywords] = React.useState<string[]>(
    data?.keywords || [],
  );
  const [keywordInput, setKeywordInput] = React.useState("");

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
  const filteredSubCategories = React.useMemo(
    () =>
      subCategories.filter((item) => item.categoryId === selectedCategoryId),
    [selectedCategoryId, subCategories],
  );

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

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

  const handleAddKeyword = () => {
    const normalizedKeyword = keywordInput.trim();
    if (!normalizedKeyword || keywords.length === 10) return;
    if (keywords.includes(normalizedKeyword)) return;

    setKeywords((prevKeywords) => [...prevKeywords, normalizedKeyword]);
    setKeywordInput("");
  };

  const handleDeleteKeyword = (keyword: string) => {
    setKeywords((prevKeywords) =>
      prevKeywords.filter((currentKeyword) => currentKeyword !== keyword),
    );
  };

  useEffect(() => {
    form.setValue(
      "colors.color",
      colors.map((item) => item.color),
    );
    form.setValue("colors.sizes", sizes);
    form.setValue("keywords", keywords);
  }, [colors, sizes, keywords, form]);

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

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="variantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Default Variant"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="GIABAO-0001"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

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

              <FormField
                control={form.control}
                name="variantDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what makes this variant unique"
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isLoading || categories.length === 0}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
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
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <Select
                        disabled={
                          isLoading ||
                          !selectedCategoryId ||
                          filteredSubCategories.length === 0
                        }
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sub category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSubCategories.map((subCategory) => (
                            <SelectItem
                              key={subCategory.id}
                              value={subCategory.id}
                            >
                              {subCategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Brand Name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>On Sale</FormLabel>
                      <FormDescription>
                        Mark product as currently on sale
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">Colors</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setColors((prevColors) => [...prevColors, { color: "" }])
                    }
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                  </Button>
                </div>

                <div className="space-y-2">
                  {colors.map((colorItem, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={colorItem.color}
                        onChange={(event) => {
                          const newColors = [...colors];
                          newColors[index] = { color: event.target.value };
                          setColors(newColors);
                        }}
                        placeholder={`Color ${index + 1}`}
                        disabled={isLoading}
                      />
                      {colors.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setColors((prevColors) =>
                              prevColors.filter(
                                (_, currentIndex) => currentIndex !== index,
                              ),
                            )
                          }
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {form.formState.errors.colors?.color?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {String(form.formState.errors.colors.color.message)}
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">Sizes & Pricing</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSizes((prevSizes) => [
                        ...prevSizes,
                        { size: "", quantity: 1, price: 0.01, discount: 0 },
                      ])
                    }
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                  </Button>
                </div>

                <div className="space-y-3">
                  {sizes.map((sizeItem, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-12">
                      <Input
                        className="md:col-span-3"
                        value={sizeItem.size}
                        onChange={(event) => {
                          const newSizes = [...sizes];
                          newSizes[index] = {
                            ...newSizes[index],
                            size: event.target.value,
                          };
                          setSizes(newSizes);
                        }}
                        placeholder="Size"
                        disabled={isLoading}
                      />

                      <Input
                        className="md:col-span-3"
                        type="number"
                        min={1}
                        value={sizeItem.quantity}
                        onChange={(event) => {
                          const newSizes = [...sizes];
                          newSizes[index] = {
                            ...newSizes[index],
                            quantity: Number(event.target.value) || 1,
                          };
                          setSizes(newSizes);
                        }}
                        placeholder="Quantity"
                        disabled={isLoading}
                      />

                      <Input
                        className="md:col-span-3"
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={sizeItem.price}
                        onChange={(event) => {
                          const newSizes = [...sizes];
                          newSizes[index] = {
                            ...newSizes[index],
                            price: Number(event.target.value) || 0.01,
                          };
                          setSizes(newSizes);
                        }}
                        placeholder="Price"
                        disabled={isLoading}
                      />

                      <div className="md:col-span-3 flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={sizeItem.discount}
                          onChange={(event) => {
                            const newSizes = [...sizes];
                            newSizes[index] = {
                              ...newSizes[index],
                              discount: Number(event.target.value) || 0,
                            };
                            setSizes(newSizes);
                          }}
                          placeholder="Discount"
                          disabled={isLoading}
                        />

                        {sizes.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setSizes((prevSizes) =>
                                prevSizes.filter(
                                  (_, currentIndex) => currentIndex !== index,
                                ),
                              )
                            }
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {form.formState.errors.colors?.sizes?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {String(form.formState.errors.colors.sizes.message)}
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-md border p-4">
                <FormLabel className="text-base">Keywords</FormLabel>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Input
                    value={keywordInput}
                    onChange={(event) => setKeywordInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="Add keyword and press Enter"
                    disabled={isLoading || keywords.length === 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddKeyword}
                    disabled={isLoading || keywords.length === 10}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteKeyword(keyword)}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Remove ${keyword}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground">
                  {keywords.length}/10 keywords
                </p>
                <FormMessage>
                  {form.formState.errors.keywords?.message}
                </FormMessage>
              </div>

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
