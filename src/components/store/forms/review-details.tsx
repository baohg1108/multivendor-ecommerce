"use client";
import {
  ReviewDetailsType,
  ReviewWithImageType,
  VariantInfoType,
} from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddReviewSchema } from "@/lib/schemas";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Select from "../ui/select";
import Input from "../ui/input";
import { Button } from "../layout/ui/button";
import PulseLoader from "react-spinners/PulseLoader";
import ImageUploadStore from "../shared/upload-images";
import { upsertReview } from "@/queries/review";

import { v4 } from "uuid";

export default function ReviewDetails({
  productId,
  data,
  variantsInfo,
  reviews,
  setReviews,
}: {
  productId: string;
  data?: ReviewDetailsType;
  variantsInfo: VariantInfoType[];
  reviews: ReviewWithImageType[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewWithImageType[]>>;
}) {
  const [activeVariant, setActiveVariant] = useState<VariantInfoType>(
    variantsInfo[0],
  );

  const [sizes, setSizes] = React.useState<{ name: string; value: string }[]>(
    [],
  );

  const form = useForm<z.infer<typeof AddReviewSchema>>({
    mode: "onChange",
    resolver: zodResolver(AddReviewSchema),
    defaultValues: {
      variantName: data?.variant || activeVariant?.variantName || "",
      rating: data?.rating || 0,
      size: data?.size || "",
      review: data?.review || "",
      quantity: data?.quantity || undefined,
      images: data?.images || [],
      color: data?.color || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const errors = form.formState.errors;

  const handleSubmit = async (values: z.infer<typeof AddReviewSchema>) => {
    try {
      const response = await upsertReview(productId, {
        id: data?.id || v4(),
        variant: values.variantName,
        images: values.images,
        rating: values.rating,
        review: values.review,
        size: values.size,
        color: values.color,
        quantity: values.quantity,
      });

      if (response.id) {
        const rev = reviews.filter((rev) => rev.id !== response.id);
        setReviews([...rev, response]);
      }
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const variants = variantsInfo.map((v) => ({
    name: v.variantName,
    value: v.variantName,
    image: v.variantImage,
    colors: v.colors,
  }));

  useEffect(() => {
    form.setValue("size", "");

    const name = form.getValues().variantName;
    const variant = variantsInfo.find((v) => v.variantName === name);

    if (variant) {
      const sizes_data = variant.sizes.map((s) => ({
        name: s.size,
        value: s.size,
      }));

      setActiveVariant(variant);
      if (sizes) setSizes(sizes_data);

      form.setValue("color", variant.colors || "");
    }
  }, [form.getValues().variantName]);

  return (
    <div>
      <div className="p-4 bg-[#F5F5F5] rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col space-y-4">
              {/* Title */}
              <div className="pt-4">
                <h1 className="font-bold text-2xl text-slate-900">
                  Add a review
                </h1>
              </div>
              {/* Form items */}
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center gap-x-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, index) => {
                              const starValue = index + 1;
                              const isActive = starValue <= field.value;

                              return (
                                <button
                                  key={starValue}
                                  type="button"
                                  onClick={() => field.onChange(starValue)}
                                  className="p-0.5"
                                  aria-label={`Rate ${starValue} stars`}
                                >
                                  <Star
                                    className={`h-7 w-7 transition-colors ${
                                      isActive
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-slate-700">
                            ( {form.getValues().rating.toFixed(1)} out of 5.0)
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="w-full flex flex-wrap gap-x-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <FormField
                      control={form.control}
                      name="variantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              options={variants}
                              placeholder="Select product"
                              subPlaceholder="Please select a product"
                              inputClassName="bg-white text-slate-900 ring-1 ring-slate-200 focus:ring-[#11BE86]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            options={sizes}
                            placeholder="Select size"
                            subPlaceholder="Please select a size"
                            inputClassName="bg-white text-slate-900 ring-1 ring-slate-200 focus:ring-[#11BE86]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            name="quantity"
                            type="number"
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            placeholder="Quantity (Optional)"
                            value={field.value ?? ""}
                            className="bg-white text-slate-900 ring-1 ring-slate-200 focus:ring-[#11BE86]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          className="min-h-32 p-4 w-full rounded-xl bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none ring-1 ring-slate-200 focus:ring-[#11BE86]"
                          placeholder="Write your review..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* upload images */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="w-full xl:border-r">
                      <FormControl>
                        <ImageUploadStore
                          value={field.value.map((image) => image.url)}
                          disabled={isLoading}
                          onChange={(url) => {
                            const currentImages = field.value || [];
                            if (currentImages.length >= 3) {
                              return;
                            }
                            field.onChange([...currentImages, { url }]);
                          }}
                          onRemove={(url) =>
                            field.onChange([
                              ...field.value.filter(
                                (current) => current.url !== url,
                              ),
                            ])
                          }
                          maxImages={3}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 text-destructive">
                {errors.rating && <p>{errors.rating.message}</p>}
                {errors.size && <p>{errors.size.message}</p>}
                {errors.review && <p>{errors.review.message}</p>}
                {errors.images && <p>{errors.images.message as string}</p>}
                {errors.color && <p>{errors.color.message}</p>}
              </div>
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="w-36 h-12 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <PulseLoader size={5} color="#fff" />
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
