// Components
import Header from "@/components/store/layout/header/header";
import React from "react";
import CategoriesHeader from "@/components/store/layout/categories-header/categories-header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <CategoriesHeader></CategoriesHeader>
      <div>{children}</div>
      <div> footer </div>
    </div>
  );
}
