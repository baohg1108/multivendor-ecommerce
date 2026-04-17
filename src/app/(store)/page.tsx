import { UserButton } from "@clerk/nextjs";
import { seedCountries } from "@/migration-scripts/seed-contries";

export default async function StoreHomePage() {
  await seedCountries();

  return (
    <div className="">
      <UserButton />
    </div>
  );
}
