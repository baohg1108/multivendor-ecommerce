"use client";

// React
import React from "react";
import { useEffect } from "react";

// Pisma model
import type { Category, SubCategory } from "@prisma/client";

// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubCategoryFormSchema } from "@/lib/schemas";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "../shared/image-upload";

// Queries
import { upsertSubCategory } from "@/queries/subCategory";

// Utils
import { v4 } from "uuid";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryDetailsProps {
  data?: SubCategory;
  categories: Category[]; // Assuming you have a Category type defined somewhere
}

const SubCategoryDetails: React.FC<CategoryDetailsProps> = ({
  data,
  categories,
}) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      categoryId: data?.categoryId || "",
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  const formData = form.watch(); // Watch form data for changes
  console.log("Form data:", formData);

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        image: data?.image ? [{ url: data.image }] : [],
        url: data?.url || "",
        featured: data?.featured || false,
        categoryId: data?.categoryId || "",
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof SubCategoryFormSchema>,
  ) => {
    // console.log("Form values:", JSON.stringify(values));
    try {
      // updating sub category data
      const response = await upsertSubCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // sonner toast for success
      toast.success(
        data?.id
          ? "Subcategory has been updated successfully!"
          : `Congratulations! The \`${response?.name}\` subcategory has been created successfully!`,
      );

      // redicrect or refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
      }
    } catch (error) {
      console.error("Error submitting category form:", error);

      // sonner toast for error
      toast.error("Oops! Something went wrong", {
        description: (error as Error).message,
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} Subcategory information`
              : "Let's create a subcategory. You can edit subcategory settings later form the settings tabs."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* image upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url,
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              {/* category name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sub Category Name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              {/* category URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Category URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/sub-category-url"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              {/* new */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
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

              {/* featured */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This subcategory will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                    ? "Save subcategory information"
                    : "Create Subcategory"}
              </Button>
              {/* Form fields would go here */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
