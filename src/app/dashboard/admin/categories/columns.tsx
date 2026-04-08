// "use client";

// // Raect, Nextjs
// import { useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // custom components
// import CategoryDetails from "@/components/dashboard/forms/category-details";
// // Ui components
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// // import { DataTable } from "@/components/ui/data-table";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";

// // hooks and icons
// import { useModal } from "@/provider/modal-provider";
// // import { useToast } from "@/components/ui/use-toast";
// import { toast } from "sonner";

// // lucides icons
// import {
//   Badge,
//   BadgeCheck,
//   BadgeMinus,
//   Edit,
//   MoreHorizontal,
//   Trash,
// } from "lucide-react";

// // Queries
// import { deleteCategory, getCategory } from "@/queries/category";

// // Tanstack table
// import { ColumnDef } from "@tanstack/react-table";

// // Prisma models
// import { Category } from "@prisma/client";
// import { CustomModal } from "@/components/dashboard/shared/custom-modal";

// const CLOUDINARY_CLOUD_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_KEY || "";

// export const columns: ColumnDef<Category>[] = [
//   {
//     accessorKey: "image",
//     header: "",
//     cell: ({ row }) => {
//       return (
//         <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
//           <Image
//             src={row.original.image}
//             alt=""
//             width={1000}
//             height={1000}
//             className="w-40 h-40 rounded-full object-cover shadow-2xl"
//           ></Image>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "name",
//     id: "name",
//     header: "Name",
//     cell: ({ row }) => {
//       return (
//         <span className="font-extrabold text-lg capitalize">
//           {row.original.name}
//         </span>
//       );
//     },
//   },
//   {
//     accessorKey: "url",
//     header: "URL",
//     cell: ({ row }) => {
//       return <span>{row.original.url}</span>;
//     },
//   },
//   {
//     accessorKey: "featured",
//     header: "Featured",
//     cell: ({ row }) => {
//       return (
//         <span className="text-muted-foreground flex justify-center">
//           {row.original.featured ? (
//             <Badge className="stroke-green-300"></Badge>
//           ) : (
//             <BadgeMinus></BadgeMinus>
//           )}
//         </span>
//       );
//     },
//   },
//   {
//     id: "action",
//     cell: ({ row }) => {
//       const rowData = row.original;

//       return <CellActions rowData={rowData}></CellActions>;
//     },
//   },
// ];

// // define props interface for cell actions
// interface CellActionsProps {
//   rowData: Category;
// }

// // CellActions component definition
// const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
//   // hooks
//   const { setOpen, setClose } = useModal();
//   const [loading, setLoading] = useState(false);
//   // const { toast } = useToast();
//   const router = useRouter();

//   // return null if rowData or rowData.id dont exist
//   if (!rowData || !rowData.id) {
//     return null;
//   }

//   return (
//     <AlertDialog>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuLabel>Actions</DropdownMenuLabel>
//           <DropdownMenuItem
//             className="flex gap-2"
//             onClick={() => {
//               // custom modal components
//               setOpen(
//                 <CustomModal>
//                   {/* store details component */}
//                   <CategoryDetails data={{ ...rowData }}></CategoryDetails>
//                 </CustomModal>,

//                 async () => {
//                   return {
//                     rowData: await getCategory(rowData?.id),
//                   };
//                 },
//               );
//             }}
//           >
//             <Edit size={15}>Edit Details</Edit>
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//         <DropdownMenuSeparator></DropdownMenuSeparator>

//         <AlertDialogTrigger asChild>
//           <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
//             <Trash size={15}>Delete category</Trash>
//           </DropdownMenuItem>
//         </AlertDialogTrigger>
//       </DropdownMenu>
//       <AlertDialogContent className="max-w-lg">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="text-left">
//             Are you absolutely sure?
//           </AlertDialogTitle>
//           <AlertDialogDescription className="text-left">
//             This action cannot be undone. This will permanently delete the
//             category and all of its associated data. Please type the name of the
//             category to confirm.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter className="flex items-center">
//           <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             disabled={loading}
//             className="bg-destructive hover:bg-destructive mb-2 text-white"
//             onClick={async () => {
//               setLoading(true);
//               await deleteCategory(rowData.id);
//               // toast notification - use sonner
//               toast.success("Category deleted", {
//                 description: "The category has been deleted successfully.",
//               });
//               setLoading(false);
//               router.refresh();
//               setClose();
//             }}
//           >
//             Delete
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

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
import { Category } from "@prisma/client";

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
