"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// components

// UI
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// hooks
import { useModal } from "@/provider/modal-provider";
import { toast } from "sonner";

// icons
import { CopyPlus, FilePenLine, MoreHorizontal, Trash } from "lucide-react";

import Link from "next/link";

// queries
import { deleteProduct } from "@/queries/product";

// table
import { ColumnDef } from "@tanstack/react-table";

import type { StoreProductType } from "@/lib/types";

export const columns: ColumnDef<StoreProductType>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-3">
        {/* Product name */}
        <h1 className="font-bold truncate pb-3 border-b capitalize">
          {row.original.name}
        </h1>
        {/* Product variant */}
        <div className="relative flex flex-wrap gap-2">
          {row.original.variants.map((variant) => (
            <div key={variant.id} className="flex flex-col gap-y-2 group">
              <div className="relative cursor-pointer">
                <Image
                  src={
                    variant.images?.[0]?.url ??
                    "/assets/images/default-product.jpg"
                  }
                  alt={`${variant.variantName} image`}
                  width={1000}
                  height={1000}
                  className="min-w-72 max-w-72 h-80 rounded-sm object-cover shadow-2xl"
                ></Image>

                <Link
                  href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/${variant.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Edit ${variant.variantName}`}
                >
                  <div className="w-full h-full absolute top-0 bottom-0 right-0 z-0 rounded-sm bg-black/50 transaction-all duration-150 hidden group-hover:block">
                    <FilePenLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"></FilePenLine>
                  </div>
                </Link>
                {/* info */}
                <div className="flex mt-2 gap-2">
                  {/* Color */}
                  <div className="w-7 flex flex-col gap-2 rounded-md">
                    {variant.colors.map((color) => (
                      <span
                        key={color.name}
                        className="w-5 h-5 rounded-full shadow-2xl"
                        style={{ backgroundColor: color.name }}
                      ></span>
                    ))}
                  </div>
                  <div>
                    {/* Name of variant */}
                    <h1 className="max-w-40 capitalize text-sm">
                      {variant.variantName}
                    </h1>
                    {/* Sizes */}
                    <div className="flex flex-wrap gap-2 max-w-72 mt-1">
                      {variant.sizes.map((size) => (
                        <span
                          key={size.size}
                          className="w-fit p-1 rounded text-[11px] font-medium border- bg-white/10"
                        >
                          {size.size} - ({size.quantity}) - ${size.price}$
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span>{row.original.category?.name ?? "Unknown category"}</span>
    ),
  },
  {
    accessorKey: "subCategory",
    header: "Subcategory",
    cell: ({ row }) => (
      <span>{row.original.subCategory?.name ?? "Unknown subcategory"}</span>
    ),
  },
  {
    accessorKey: "offerTag",
    header: "Offer",
    cell: ({ row }) => {
      const offerTag = row.original.offerTag;
      return <span>{offerTag ? offerTag.name : "-"}</span>;
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return <span>{row.original.brand}</span>;
    },
  },
  {
    accessorKey: "new-variant",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original.id}/variants/new`}
        >
          <CopyPlus className="hover:text-blue-200"></CopyPlus>
        </Link>
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: () => (
      <span className="text-muted-foreground flex justify-center">
        {/* {row.original.featured ? (
          <BadgeCheck className="stroke-green-300" />
        ) : (
          <BadgeMinus />
        )} */}
      </span>
    ),
  },
  {
    id: "action",
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions productId={rowData.id}></CellActions>;
    },
  },
];

interface CellActionsProps {
  productId: string;
}

const CellActions: React.FC<CellActionsProps> = ({ productId }) => {
  const { setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!productId) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        {/* Trigger */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        {/* Content */}
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Edit */}
          {/* <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal>
                  <CategoryDetails data={{ ...rowData.category }} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getCategory(rowData.category.id),
                  };
                },
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem> */}

          {/* <DropdownMenuSeparator /> */}

          {/* Delete */}
          <DropdownMenuItem asChild className="flex gap-2">
            <AlertDialogTrigger>
              <div className="flex items-center gap-2">
                <Trash size={15} />
                Delete product
              </div>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog */}
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            product and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            className="bg-destructive text-white"
            onClick={async () => {
              try {
                setLoading(true);
                await deleteProduct(productId);

                toast.success("Product deleted", {
                  description: "The product has been deleted successfully.",
                });

                router.refresh();
                setClose();
              } catch {
                toast.error("Error deleting product");
              } finally {
                setLoading(false);
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
