import { UserButton } from "@clerk/nextjs";
import { seedCountries } from "@/migration-scripts/seed-contries";

export default async function HomePage() {
  await seedCountries();
  return (
    <div>
      <UserButton></UserButton>
    </div>
  );
}
