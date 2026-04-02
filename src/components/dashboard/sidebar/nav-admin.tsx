// "use client";

// import React from "react";
// import { DashboardSidebarMenuInterface } from "@/lib/types";
// import {
//   Command,
//   CommandEmpty,
//   CommandInput,
//   CommandList,
//   CommandGroup,
//   CommandItem,
// } from "@/components/ui/command";
// import { icons } from "@/constants/icons";
// import { cn } from "@/lib/utils";
// import Link from "next/dist/client/link";
// import { usePathname } from "next/navigation";
// // import { icons } from "@/lib/icons";

// export default function SidebarNavAdmin({
//   menuLinks,
// }: {
//   menuLinks: DashboardSidebarMenuInterface[];
// }) {
//   const pathname = usePathname();
//   console.log("pathname", pathname);
//   return (
//     <nav className="relative grow">
//       <Command className="rounded-lg overflow-visible bg-transparent">
//         <CommandInput placeholder="Search..." />
//         <CommandList className="py-2 overflow-visible">
//           <CommandEmpty>No Links Found</CommandEmpty>
//           <CommandGroup className="overflow-visible pt-0 relative">
//             {menuLinks.map((link, index) => {
//               let icon;
//               const iconSearch = icons.find((icon) => icon.value === link.icon);
//               if (iconSearch) icon = <iconSearch.path />;
//               return (
//                 <CommandItem
//                   key={index}
//                   className={cn("w-full h-12 cursor-pointer", {
//                     "bg-accent text-accent-foreground": link.link === pathname,
//                   })}
//                 >
//                   <Link
//                     href={link.link}
//                     className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
//                   >
//                     {icon}
//                     <span>{link.label}</span>
//                   </Link>
//                 </CommandItem>
//               );
//             })}
//           </CommandGroup>
//         </CommandList>
//       </Command>
//     </nav>
//   );
// }

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
import Link from "next/dist/client/link";

export default function SidebarNavAdmin({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) {
  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="Search..." />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>No Links Found</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((i) => i.value === link.icon);
              if (iconSearch) {
                const IconComponent = iconSearch.path;
                icon = <IconComponent />;
              }
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer")}
                >
                  <Link
                    href={link.link}
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
