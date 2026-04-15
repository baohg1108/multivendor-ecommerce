import StoreDefaultShippingDetails from "@/components/dashboard/forms/store-default-shipping-details.tsx";
import { getStoreDefaultShippingDetails } from "@/queries/store";

export default async function SellerStoreShippingPage({
  params,
  store,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;

  const shippingDetails = await getStoreDefaultShippingDetails(storeUrl);

  return (
    <div>
      <StoreDefaultShippingDetails data={shippingDetails} storeUrl={storeUrl} />
    </div>
  );
}
