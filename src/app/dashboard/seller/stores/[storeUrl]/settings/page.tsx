// DB
import StoreDetails from "@/components/dashboard/forms/store-details";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SellerStoreSettingsPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;

  const storeDetails = await db.store.findUnique({
    where: {
      url: decodeURIComponent(storeUrl),
    },
  });
  if (!storeDetails) redirect("/dashboard/seller/stores");
  // console.log("params --> ", params);
  return (
    <div>
      <StoreDetails data={storeDetails} />
    </div>
  );
}
