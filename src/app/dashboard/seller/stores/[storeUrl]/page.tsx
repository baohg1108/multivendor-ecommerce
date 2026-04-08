import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerStoresDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // fetch the current user. if the user is not authenticated, redirect to the login page
  const user = await currentUser();

  if (!user) {
    redirect("/");
    return;
  }

  // retrieve the user's role from their private metadata. If the user is not a seller, redirect to the home page
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="h-full w-full flex">
      <Sidebar stores={stores}></Sidebar>
      <div className="w-full ml-[300px]">
        <Header></Header>
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
