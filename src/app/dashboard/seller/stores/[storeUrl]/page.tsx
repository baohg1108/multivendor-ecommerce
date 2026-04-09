import { redirect } from "next/navigation";

export default async function SellerStorePage({
  params,
}: {
  params: Promise<{ storeUrl: string }>;
}) {
  const { storeUrl } = await params;

  redirect(`/dashboard/seller/stores/${encodeURIComponent(storeUrl)}/settings`);
}
