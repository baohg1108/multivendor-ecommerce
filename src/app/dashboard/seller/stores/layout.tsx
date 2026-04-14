import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { db } from "@/lib/db";
import ModalProvider from "@/provider/modal-provider";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerStoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <ModalProvider>
      <div className="h-full w-full flex">
        <Sidebar stores={stores}></Sidebar>
        <div className="w-full md:ml-[300px]">
          <Header></Header>
          <div className="w-full p-4 pt-[75px]">{children}</div>
        </div>
      </div>
    </ModalProvider>
  );
}
