import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative w-full flex items-center justify-center gap-x-1 text-white rounded-3xl leading-6 font-bold whitespace-nowrap border cursor-pointer transition-all duration-300 ease-in-out select-none",
  {
    variants: {
      variant: {
        default: "bg-[#fd384f] border-[#fd384f] hover:bg-[#e63247]",
        black: "bg-black border-black",
        pink: "bg-[#ffe6e7] text-[#fd384f] border-[#ffe6e7] hover:bg-[#e4cdce] hover:text-white",
        outline:
          "bg-transparent border-[#fd384f] text-[#fd384f] hover:bg-[#fd384f] hover:text-white rounded-md px-2 !h-7 text-sm font-normal",
        "orange-gradient":
          "bg-gradient-to-r from-[#ff0a0a] to-[#ff7539] border-none hover:opacity-90",
        gray: "bg-[#f5f5f5] text-[#222] border-[#f5f5f5]",
      },
      size: {
        default: "h-11 py-2",
        icon: "h-11 min-w-11 max-w-11 rounded-full",
      },
      width: {
        default: "w-full",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      width: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, width, rounded, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, width, rounded, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
