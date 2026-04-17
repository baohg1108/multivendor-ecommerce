
// Components
import StoreHeader from "@/components/store/layout/header/header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StoreHeader />
      <div>{children}</div>
      <div> footer </div>
    </div>
  );
}
