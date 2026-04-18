import { getAllOfferTags } from "@/queries/offer-tag";

import DataTable from "@/components/ui/data-table";

import { Plus } from "lucide-react";

import OfferTagDetails from "@/components/dashboard/forms/offer-tag-details";

import { columns } from "./columns";

export default async function AdminOfferTagsPage() {
  const categories = await getAllOfferTags();

  if (!categories) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create offer tag
        </>
      }
      modalChildren={<OfferTagDetails />}
      newTabLink={`/dashboard/admin/offer-tags/new`}
      filterValue="name"
      data={categories}
      searchPlaceholder="Search offer tag name..."
      columns={columns}
    />
  );
}
