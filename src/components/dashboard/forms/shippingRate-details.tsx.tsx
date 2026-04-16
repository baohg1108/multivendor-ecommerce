"use client";

// React
import React from "react";
import { useEffect } from "react";

// Pisma model
import { Textarea } from "@/components/ui/textarea";
// Form hadling
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingRateFormSchema } from "@/lib/schemas";

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

import { NumberInput } from "@tremor/react";

// Queries

// Utils
import { v4 } from "uuid";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CountryWithShippingRatesType } from "@/lib/types";

import { upsertShippingRate } from "@/queries/store";

interface ShippingRateDetailsProps {
  data?: CountryWithShippingRatesType;
  storeUrl: string;
}

const ShippingRateDetails: React.FC<ShippingRateDetailsProps> = ({
  data,
  storeUrl,
}) => {
  // Initializing nessary hooks and states
  const router = useRouter();

  // form hook for managing form statte and validation
  const form = useForm<z.infer<typeof ShippingRateFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ShippingRateFormSchema),
    defaultValues: {
      countryId: data?.countryId,
      countryName: data?.countryName,
      shippingService: data?.shippingRate?.shippingService || "",
      shippingFeePerItem: data?.shippingRate?.shippingFeePerItem ?? 0,
      shippingFeeForAdditionalItem:
        data?.shippingRate?.shippingFeeForAdditionalItem ?? 0,
      shippingFeeFixed: data?.shippingRate?.shippingFeeFixed ?? 0,
      shippingFeePerKg: data?.shippingRate?.shippingFeePerKg ?? 0,
      deliveryTimeMin: data?.shippingRate?.deliveryTimeMin ?? 1,
      deliveryTimeMax: data?.shippingRate?.deliveryTimeMax ?? 2,
      returnPolicy: data?.shippingRate?.returnPolicy || "",
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        countryId: data.countryId,
        countryName: data.countryName,
        shippingService: data.shippingRate?.shippingService || "",
        shippingFeePerItem: data.shippingRate?.shippingFeePerItem ?? 0,
        shippingFeeForAdditionalItem:
          data.shippingRate?.shippingFeeForAdditionalItem ?? 0,
        shippingFeeFixed: data.shippingRate?.shippingFeeFixed ?? 0,
        shippingFeePerKg: data.shippingRate?.shippingFeePerKg ?? 0,
        deliveryTimeMin: data.shippingRate?.deliveryTimeMin ?? 1,
        deliveryTimeMax: data.shippingRate?.deliveryTimeMax ?? 2,
        returnPolicy: data.shippingRate?.returnPolicy || "",
      });
    }
  }, [data, form]);

  // Submit handler for form submission
  const handleSubmit = async (
    values: z.infer<typeof ShippingRateFormSchema>,
  ) => {
    // console.log("Form values:", JSON.stringify(values));
    try {
      // updating shipping rate data
      const response = await upsertShippingRate(storeUrl, {
        id: data?.shippingRate?.id ? data.shippingRate.id : v4(),
        countryId: values.countryId || data?.countryId || "",
        shippingService: values.shippingService,
        shippingFeePerItem: values.shippingFeePerItem,
        shippingFeeForAdditionalItem: values.shippingFeeForAdditionalItem,
        shippingFeeFixed: values.shippingFeeFixed,
        shippingFeePerKg: values.shippingFeePerKg,
        deliveryTimeMin: values.deliveryTimeMin,
        deliveryTimeMax: values.deliveryTimeMax,
        returnPolicy: values.returnPolicy,
        storeId: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // sonner toast for success
      toast.success(
        data?.shippingRate?.id
          ? "Shipping rate has been updated successfully!"
          : `Congratulations! The \`${response?.shippingService}\` shipping rate has been created successfully!`,
      );

      // redicrect or refresh data
      if (data?.shippingRate?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/shipping-rates");
      }
    } catch (error) {
      console.error("Error submitting shipping rate form:", error);

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
          <CardTitle>Shipping Rate Details</CardTitle>
          <CardDescription>
            Update Shipping rate information {data?.countryName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              {/*country id */}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Country ID"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                {/* 1 */}
                <FormField
                  control={form.control}
                  name="countryName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Country Name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* 2 */}
                <FormField
                  control={form.control}
                  name="shippingService"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Shipping Service"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* 3 */}
                <FormField
                  control={form.control}
                  name="shippingFeePerItem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee Per Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-1.5 shadow-none! rounded-md"
                          placeholder="Shipping Fee Per Item"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeForAdditionalItem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee For Additional Item</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-1.5 shadow-none! rounded-md"
                          placeholder="Shipping Fee For Additional Item"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                {/* 4 */}
                <FormField
                  control={form.control}
                  name="shippingFeePerKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee Per Kg</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="pl-1.5 shadow-none! rounded-md"
                          placeholder="Shipping Fee Per Kg"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingFeeFixed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Fee Fixed</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={0}
                          className="shadow-none! rounded-md"
                          placeholder="Shipping Fee Fixed"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time Min</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={1}
                          className="shadow-none! rounded-md"
                          placeholder="Delivery Time Min"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryTimeMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time Max</FormLabel>
                      <FormControl>
                        <NumberInput
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          step={0.1}
                          min={2}
                          className="shadow-none! rounded-md"
                          placeholder="Delivery Time Max"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                />
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
              </div>

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

export default ShippingRateDetails;
