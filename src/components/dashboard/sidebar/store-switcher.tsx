"use client";

import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";
import {
  CommandGroup,
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Array<{ name: string; url: string }>;
}

export const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, className }) => {
  const params = useParams<{ storeUrl?: string }>();
  const router = useRouter();

  //format store data
  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.url,
  }));

  const [open, setOpen] = useState(false);

  // get active store based on the current url
  const activeStore = formattedItems.find(
    (store) => store.value === params.storeUrl,
  );

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/dashboard/seller/stores/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-62.5 justify-between", className)}
        >
          <StoreIcon className="mr-2 w-4 h-4"></StoreIcon>
          {activeStore?.label || "Select a store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"></ChevronsUpDown>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62.5 p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..."></CommandInput>
            <CommandEmpty>No Store Selected.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm cursor-pointer"
                >
                  <StoreIcon className="mr-2 w-4 h-4"></StoreIcon>
                  {store.label}
                  <Check
                    className={cn("ml-auto h-4 w-4 opacity-0", {
                      "opacity-100": activeStore?.value === store.value,
                    })}
                  ></Check>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator></CommandSeparator>
          <CommandList>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => {
                setOpen(false);
                router.push("/dashboard/seller/stores/new");
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5"></PlusCircle> Create
              Store{" "}
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
