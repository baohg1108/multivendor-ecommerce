"use client";

import { FC, useEffect } from "react";

import { OfferTag } from "@prisma/client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { OfferTagFormSchema } from "@/lib/schemas";

import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { upsertOfferTag } from "@/queries/offer-tag";

import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OfferTagDetailsProps {
  data?: OfferTag;
}

const OfferTagDetails: FC<OfferTagDetailsProps> = ({ data }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof OfferTagFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(OfferTagFormSchema),
    defaultValues: {
      name: data?.name ?? "",
      url: data?.url ?? "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.reset({
      name: data?.name ?? "",
      url: data?.url ?? "",
    });
  }, [data, form]);

  const handleSubmit = async (values: z.infer<typeof OfferTagFormSchema>) => {
    try {
      const response = await upsertOfferTag({
        id: data?.id ? data.id : v4(),
        name: values.name,
        url: values.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast(
        data?.id
          ? "Offer tag has been updated."
          : `Congratulations! '${response?.name}' is now created.`,
      );

      if (data?.id) {
        router.refresh();
      } else {
        router.replace("/dashboard/admin/offer-tags");
      }
    } catch (error: any) {
      toast.error("Oops!", {
        description: error.toString(),
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Offer Tag Information</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data?.name} offer tag information.`
              : " Lets create an offer tag. You can edit offer tag later from the offer tags table or the offer tag page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Offer tag url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="/offer-tag-url"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "loading..."
                  : data?.id
                    ? "Save offer tag information"
                    : "Create offer tag"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default OfferTagDetails;
