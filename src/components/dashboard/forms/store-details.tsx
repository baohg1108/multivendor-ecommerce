"use client";

// React
import React from "react";
import { useEffect } from "react";

// Pisma model
import { Store } from "@prisma/client";

// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormSchema } from "@/lib/schemas";

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
import { Textarea } from "@/components/ui/textarea";
interface StoreDetailsProps {
  data?: Store;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ data }) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof StoreFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      name: data?.name || "",
      description: data?.description || "",
      email: data?.email || "",
      phone: data?.phone || "",
      logo: data?.logo ? [{ url: data.logo }] : [],
      cover: data?.cover ? [{ url: data.cover }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
      status: data?.status?.toString() || "PENDING",
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        description: data?.description || "",
        email: data?.email || "",
        phone: data?.phone || "",
        logo: data?.logo ? [{ url: data.logo }] : [],
        cover: data?.cover ? [{ url: data.cover }] : [],
        url: data?.url || "",
        featured: data?.featured || false,
        status: data?.status?.toString() || "PENDING",
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof StoreFormSchema>) => {
    // console.log("Form values:", JSON.stringify(values));
    try {
      // updating category data
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.logo[0]?.url || "",
        url: values.url,
        featured: values.featured ?? false,
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
          <CardTitle>Store Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} store information`
              : "Let's create a store. You can edit store settings later form the settings tabs."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Logo cover */}
              <div className="relative py-2 mb-24">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="absolute -bottom-20 left-6 z-10 flex w-52 flex-col items-center">
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
                      <FormMessage className="mt-2 text-center" />
                    </FormItem>
                  )}
                />
                {/* Logo - Cover  */}
                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          type="cover"
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
              </div>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Store Name"
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
                    <FormLabel>Store Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Store Description"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              {/* Email + Phone */}
              <div className="flex flex-col gap-6 md:flex-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Store Email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Store Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Store Phone"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Store URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Store URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/store-url"
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
                        This store will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : data?.id
                    ? "Save store information"
                    : "Create Store"}
              </Button>
              {/* Form fields would go here */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDetails;
