import ThemeToggle from "@/components/shared/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function Header() {
  return (
    <div className="fixed left-0 right-0 top-0 z-20 flex items-center gap-4 border-b bg-background/80 p-4 backdrop-blur-md md:left-[300px]">
      <div className="flex items-center gap-2 ml-auto">
        <UserButton />
        <ThemeToggle></ThemeToggle>
      </div>
    </div>
  );
}
