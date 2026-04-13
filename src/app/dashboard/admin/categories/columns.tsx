"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// components
import CategoryDetails from "@/components/dashboard/forms/category-details";
import { CustomModal } from "@/components/dashboard/shared/custom-modal";

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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// hooks
import { useModal } from "@/provider/modal-provider";
import { toast } from "sonner";

// icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// queries
import { deleteCategory, getCategory } from "@/queries/category";

// table
import { ColumnDef } from "@tanstack/react-table";

// types
import type { Category } from "@prisma/client";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
        <Image
          src={row.original.image}
          alt=""
          width={1000}
          height={1000}
          className="w-40 h-40 rounded-full object-cover shadow-2xl"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-extrabold text-lg capitalize">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => <span>{row.original.url}</span>,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <span className="flex justify-center">
        {row.original.featured ? (
          <BadgeCheck className="text-green-500" />
        ) : (
          <BadgeMinus />
        )}
      </span>
    ),
  },
  {
    id: "action",
    cell: ({ row }) => <CellActions rowData={row.original} />,
  },
];

interface CellActionsProps {
  rowData: Category;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!rowData?.id) return null;

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
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal>
                  <CategoryDetails data={{ ...rowData }} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getCategory(rowData.id),
                  };
                },
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <DropdownMenuItem asChild className="flex gap-2">
            <AlertDialogTrigger>
              <div className="flex items-center gap-2">
                <Trash size={15} />
                Delete category
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
            category and all associated data.
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
                await deleteCategory(rowData.id);

                toast.success("Category deleted", {
                  description: "The category has been deleted successfully.",
                });

                router.refresh();
                setClose();
              } catch (err) {
                toast.error("Error deleting category");
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
