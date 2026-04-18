import React from "react";
import { getAllCategories } from "@/queries/category"; // implement this function to fetch categories from your database or API
import { getAllOfferTags } from "@/queries/offer-tag";
import CategoryHeaderContainer from "./container";

export default async function CategoriesHeader() {
  // fetch all categories and display them in a horizontal list with scroll on overflow
  const categories = await getAllCategories(); // implement this function to fetch categories from your database or API
  const offerTags = await getAllOfferTags();
  return (
    <div className="w-full pt-2 pb-3 px-0 bg-gradient-to-r from-slate-500 to-slate-800">
      <CategoryHeaderContainer categories={categories} offerTags={offerTags} />
    </div>
  );
}
