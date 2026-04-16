"use client";

// React
import React from "react";
import { useEffect } from "react";

// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreShippingFormSchema } from "@/lib/schemas";

// UI components
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Queries
import { updateStoreDefaultShippingDetails } from "@/queries/store";

// Utils
import { v4 } from "uuid";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StoreDefaultShippingType } from "@/lib/types";

import { Textarea } from "@/components/ui/textarea";

import { NumberInput } from "@tremor/react";

interface StoreDefaultShippingDetailsProps {
  data?: StoreDefaultShippingType;
  storeUrl: string;
}

const StoreDefaultShippingDetails: React.FC<
  StoreDefaultShippingDetailsProps
> = ({ data, storeUrl }) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof StoreShippingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(StoreShippingFormSchema),
    defaultValues: {
      defaultShippingService: data?.defaultShippingService,
      defaultShippingFeePerItem: data?.defaultShippingFeePerItem,
      defaultShippingFeeForAdditionalItem:
        data?.defaultShippingFeeForAdditionalItem,
      defaultShippingFeePerKg: data?.defaultShippingFeePerKg,
      defaultShippingFeeFixed: data?.defaultShippingFeeFixed,
      defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin,
      defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax,
      returnPolicy: data?.returnPolicy,
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        defaultShippingService: data?.defaultShippingService,
        defaultShippingFeePerItem: data?.defaultShippingFeePerItem,
        defaultShippingFeeForAdditionalItem:
          data?.defaultShippingFeeForAdditionalItem,
        defaultShippingFeePerKg: data?.defaultShippingFeePerKg,
        defaultShippingFeeFixed: data?.defaultShippingFeeFixed,
        defaultDeliveryTimeMin: data?.defaultDeliveryTimeMin,
        defaultDeliveryTimeMax: data?.defaultDeliveryTimeMax,
        returnPolicy: data?.returnPolicy,
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof StoreShippingFormSchema>,
  ) => {
    // console.log("Form values:", JSON.stringify(values));
    try {
      // updating category data
      const response = await updateStoreDefaultShippingDetails({
        storeUrl: storeUrl,
        details: {
          defaultShippingService: values.defaultShippingService,
          defaultShippingFeePerItem: values.defaultShippingFeePerItem,
          defaultShippingFeeForAdditionalItem:
            values.defaultShippingFeeForAdditionalItem,
          defaultShippingFeePerKg: values.defaultShippingFeePerKg,
          defaultShippingFeeFixed: values.defaultShippingFeeFixed,
          defaultDeliveryTimeMin: values.defaultDeliveryTimeMin,
          defaultDeliveryTimeMax: values.defaultDeliveryTimeMax,
          returnPolicy: values.returnPolicy,
        },
      });

      // sonner toast for success
      if (response.id) {
        toast.success(
          "Store default shipping details have been updated successfully!",
        );

        //refresh data
        router.refresh();
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
          <CardTitle>Store Default Shipping Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* default shipping service */}
              <FormField
                control={form.control}
                name="defaultShippingService"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Shipping Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              {/* default shipping fee per item */}
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="!shadow-none rounded-md pl-3"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />

                {/* default shipping fee per order */}
                <FormField
                  control={form.control}
                  name="defaultShippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee For Additional Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="!shadow-none rounded-md !pl-1"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* default shipping fee per kg and fixed fee */}
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultShippingFeePerKg"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Shipping Fee Per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="!shadow-none rounded-md pl-3"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />

                {/* default shipping fee per order */}
                <FormField
                  control={form.control}
                  name="defaultShippingFeeFixed"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fixed Shipping Fee</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={0}
                          step={0.1}
                          className="!shadow-none rounded-md !pl-1"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* default shipping time min and max */}
              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Delivery Time</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={1}
                          className="!shadow-none rounded-md pl-3"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />

                {/* default delivery time max */}
                <FormField
                  control={form.control}
                  name="defaultDeliveryTimeMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Delivery Time</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          min={2}
                          className="!shadow-none rounded-md !pl-1"
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* return policy */}
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Return Policy</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="p-4"
                        placeholder="Return Policy in 30 days"
                      ></Textarea>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Save changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default StoreDefaultShippingDetails;
