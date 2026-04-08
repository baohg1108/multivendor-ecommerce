"use client";
import React from "react";
import { DashboardSidebarMenuInterface } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavSeller({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  const pathname = usePathname();
  const storeUrlStart = pathname.split(`/stores/`)[1];
  const activeStore = storeUrlStart ? storeUrlStart.split("/")[0] : "";
  const baseStorePath = activeStore
    ? `/dashboard/seller/stores/${activeStore}`
    : "/dashboard/seller/stores";

  const getStoreScopedHref = (menuLink: string) => {
    const sellerBase = "/dashboard/seller";
    const suffix = menuLink.startsWith(sellerBase)
      ? menuLink.slice(sellerBase.length)
      : menuLink;

    if (!suffix || suffix === "/") {
      return baseStorePath;
    }

    return `${baseStorePath}${suffix.startsWith("/") ? suffix : `/${suffix}`}`;
  };

  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links Found</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((link, index) => {
              const href = getStoreScopedHref(link.link);
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) {
                const IconComponent = iconSearch.path;
                icon = <IconComponent />;
              }
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent text-accent-foreground": href === pathname,
                  })}
                >
                  <Link
                    href={href}
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                  >
                    {icon}
                    <span>{link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
