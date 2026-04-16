"use client";

import { useParams } from "next/navigation";
import { CustomModal } from "@/components/dashboard/shared/custom-modal";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/provider/modal-provider";
import { Edit, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { CountryWithShippingRatesType } from "@/lib/types";
import ShippingRateDetails from "@/components/dashboard/forms/shippingRate-details.tsx";

export const columns: ColumnDef<CountryWithShippingRatesType>[] = [
  {
    accessorKey: "countryName",
    header: "Country",
    cell: ({ row }) => {
      return <span>{row.original.countryName}</span>;
    },
  },
  {
    accessorKey: "shippingService",
    header: "Shipping Service",
    cell: ({ row }) => (
      <span>{row.original.shippingRate?.shippingService || "Default"}</span>
    ),
  },
  {
    accessorKey: "shippingFeePerItem",
    header: "Shipping Fee Per Item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerItem;
      return (
        <span>
          {value === 0 ? "Free" : value > 0 ? <span>${value}</span> : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeeForAdditionalItem",
    header: "Shipping Fee For Additional Item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeForAdditionalItem;
      return (
        <span>
          {value === 0 ? "Free" : value > 0 ? <span>${value}</span> : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeePerKg",
    header: "Shipping Fee Per Kg",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerKg;
      return (
        <span>
          {value === 0 ? "Free" : value > 0 ? <span>${value}</span> : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "shippingFeeFixed",
    header: "Shipping Fee Fixed",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeFixed;
      return (
        <span>
          {value === 0 ? "Free" : value > 0 ? <span>${value}</span> : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryTimeMin",
    header: "Delivery Time (Min)",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMin
            ? `${row.original.shippingRate?.deliveryTimeMin} days`
            : "N/A"}
        </span>
      );
    },
  },

  {
    accessorKey: "deliveryTimeMax",
    header: "Delivery Time (Max)",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMax
            ? `${row.original.shippingRate?.deliveryTimeMax} days`
            : "N/A"}
        </span>
      );
    },
  },

  {
    accessorKey: "returnPolicy",
    header: "Return Policy",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.returnPolicy
            ? `${row.original.shippingRate?.returnPolicy} days`
            : "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

interface CellActionsProps {
  rowData: CountryWithShippingRatesType;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen } = useModal();
  const params = useParams<{ storeUrl: string }>();
  const storeUrl = params?.storeUrl;

  if (!rowData?.countryId || !storeUrl) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal>
                  <ShippingRateDetails data={rowData} storeUrl={storeUrl} />
                </CustomModal>,
              );
            }}
          >
            S
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </AlertDialog>
  );
};
