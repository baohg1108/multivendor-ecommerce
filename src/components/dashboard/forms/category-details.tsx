"use client";

// React
import React from "react";
import { useEffect } from "react";

// Pisma model
import { Category } from "@prisma/client";

// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormSchema } from "@/lib/schemas";

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
import { upsertCategory } from "@/queries/category";

// Utils
import { v4 } from "uuid";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({ data }) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        image: data?.image ? [{ url: data.image }] : [],
        url: data?.url || "",
        featured: data?.featured || false,
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    // console.log("Form values:", JSON.stringify(values));
    try {
      // updating category data
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // sonner toast for success
      toast.success(
        data?.id
          ? "Category has been updated successfully!"
          : `Congratulations! The \`${response?.name}\` category has been created successfully!`,
      );

      // redicrect or refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
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
              ? `Update ${data?.name} category information`
              : "Let's create a category. You can edit category settings later form the settings tabs."}
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
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category Name"
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
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/category-url"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              {/*  */}
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
                        This category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                    ? "Save category information"
                    : "Create Category"}
              </Button>
              {/* Form fields would go here */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
