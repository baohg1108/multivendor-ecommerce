"use client";

import React from "react";
import { Category, OfferTag } from "@prisma/client"; // define these types according to your data structure
import CategoriesMenu from "./categories-menu";
import OfferTagLinks from "./offerTags-links";

export default function CategoryHeaderContainer({
  categories,
  offerTags = [],
}: {
  categories: Category[];
  offerTags: OfferTag[];
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <div className="w-full px-4 flex items-center gap-x-1">
      {/* category menu */}
      <CategoriesMenu
        categories={categories}
        open={open}
        setOpen={setOpen}
      ></CategoriesMenu>
      {/* offertag links */}
      <OfferTagLinks offerTags={offerTags} open={open} />
    </div>
  );
}
