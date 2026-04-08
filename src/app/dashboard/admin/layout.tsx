import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import ModalProvider from "@/provider/modal-provider";

// Header
import Header from "@/components/dashboard/header/header";

// Sidebar
import Sidebar from "@/components/dashboard/sidebar/sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Block non admins accessing this admin dashboard
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== "ADMIN") redirect("/");

  return (
    <ModalProvider>
      <div className="w-full h-full">
        {/* Sidebar */}
        <Sidebar isAdmin></Sidebar>
        <div className="ml-[300px]">
          {/* Header */}
          <Header></Header>

          <div className="w-full mt-[75px] p-4">{children}</div>
        </div>
      </div>
    </ModalProvider>
  );
}
