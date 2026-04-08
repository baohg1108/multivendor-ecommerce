import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { redirect } from "next/navigation";

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Block non sellers from accessing the seller dashboard
  const user = await currentUser();

  if (user?.privateMetadata.role !== "SELLER") redirect("/");

  return <div>{children}</div>;
}
