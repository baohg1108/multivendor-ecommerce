"use server";
// fucntion: upsertCategory
// Description: Upsert a category into database, upadting if it exists creating new one
// permission: admin only
// paraments:
// -category: category object containing details of the category to be upserted
//

// Cleck
import { currentUser } from "@clerk/nextjs/server";

// db
import { db } from "@/lib/db";

// Prisma model
// import { Category } from "@prisma/client";
import { error } from "console";

type UpsertCategpryInput = {
id: string;
name: string;
url: string;
image: string;
featured: boolean;
};

export const upsertCategory = async (category: UpsertCategpryInput) => {
try {
// debug =============
// 🔍 DEBUG - xem raw data server nhận được
console.log("RAW category received:", category);
console.log("Keys:", Object.keys(category));
console.log("name:", category.name, typeof category.name);
console.log("url:", category.url, typeof category.url);

    // get current user
    const user = await currentUser();

    // ensure user is authenticated
    if (!user) {
      throw new Error("Unauthorized");
    }

    // verify user is admin permission
    if (user.privateMetadata.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    // ensure category data is provided
    if (!category) {
      throw new Error("Please provide category data !");
    }

    // log erorr ==================
    if (!category.name || !category.url) {
      console.error("Invalid category data:", category);
      throw new Error("Category name and URL are required !");
    }

    // throw error if category same name or alias already exists URL
    const existCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: category.url }],
          },
          {
            NOT: { id: category.id },
          },
        ],
      },
    });
    console.log("existCategory:", existCategory);
    console.log("category being upserted:", category);

    // throw error if category with same name or alias already exists
    if (existCategory) {
      let errorMessage = "";
      if (existCategory.name === category.name) {
        errorMessage += "Category name already exists";
      } else if (existCategory.url === category.url) {
        errorMessage += "Category URL already exists";
      }
      throw new Error(errorMessage);
    }

    // upsert category into database
    const categoryDetails = await db.category.upsert({
      where: {
        id: category.id,
      },
      update: {
        // name: category.name,
        // url: category.url,
        ...(category.name && { name: category.name }),
        ...(category.url && { url: category.url }),
        image: category.image,
        featured: category.featured,
        updatedAt: new Date(),
      },
      create: {
        id: category.id,
        name: category.name!,
        url: category.url!,
        image: category.image,
        featured: category.featured,
        updatedAt: new Date(),
      },
    });
    return categoryDetails;

} catch (error) {
// log error
console.error("Error upserting category:", error);
throw error;
}
}

"use client";

// React
import React, { use } from "react";
import { FC } from "react";
import { useEffect } from "react";

// Pisma model
import { Category } from "@prisma/client";

// Form hadling
import \* as z from "zod";
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
cloudinary_key: string;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
data,
cloudinary_key,
}) => {
// Initializing nessary hooks and states
// const { toast } = useToast();
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
console.log("Form values:", JSON.stringify(values));
// Here you would typically send the form data to your backend API
try {
// updating category data
const response = await upsertCategory({
id: data?.id ? data.id : v4(),
name: values.name,
image: values.image[0].url,
url: values.url,
featured: values.featured,
// createdAt: new Date(),
// updatedAt: new Date(),
});

      // Display success message
      // shadcn toast
      // toast({
      //   title: data?.id
      //     ? "Category has been updated successfully!"
      //     : `Congratulations! The \`${response?.name}\` category has been created successfully!`,
      // });

      // sonner toast
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
      // shadcn toast
      // toast({
      //   variant: "destructive",
      //   title: "Oops! Something went wrong",
      //   description: (error as Error).message,
      // });

      // sonner toast
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
{/_ image upload _/}
<FormField
control={form.control}
name="image"
render={({ field }) => (
<FormItem>
<FormControl>
<ImageUpload
type="profile"
cloudinary_key={cloudinary_key}
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
{/_ category name _/}
<FormField
disabled={isLoading}
control={form.control}
name="name"
render={({ field }) => (
<FormItem className="flex-1">
<FormLabel>Category Name</FormLabel>
<FormControl>
<Input placeholder="Category Name" {...field} />
</FormControl>
<FormMessage></FormMessage>
</FormItem>
)}
/>
{/_ category URL _/}
<FormField
disabled={isLoading}
control={form.control}
name="url"
render={({ field }) => (
<FormItem className="flex-1">
<FormLabel>Category URL</FormLabel>
<FormControl>
<Input placeholder="/category-url" {...field} />
</FormControl>
<FormMessage></FormMessage>
</FormItem>
)}
/>
{/\* _/}
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
{/_ Form fields would go here \*/}
</form>
</Form>
</CardContent>
</Card>
</AlertDialog>
);
};

export default CategoryDetails;
;
