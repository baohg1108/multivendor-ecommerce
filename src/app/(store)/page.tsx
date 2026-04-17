import getUserCountry from "@/lib/utils";

export default async function StoreHomePage() {
  const res = await getUserCountry();

  return <div></div>;
}
