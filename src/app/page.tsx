import { Button } from "@/components/ui/button";
import ThemeToggle from "../components/shared/theme-toggle";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex justify-end">
        <ThemeToggle />
      </div>

      <h1 className=" text-red-500 font-barlow text-4xl">Hello, Next.js!</h1>
      <h1 className=" text-red-500 text-4xl">Hello, Next.js!</h1>
      <Button>Click me</Button>
    </div>
  );
}
