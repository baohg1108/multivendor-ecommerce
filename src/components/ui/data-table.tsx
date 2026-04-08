"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/provider/modal-provider";
import { Search } from "lucide-react";
import { CustomModal } from "../dashboard/shared/custom-modal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue?: string;
  searchPlaceholder?: string;
  actionButtonContext?: React.ReactNode;
  modalChildren?: React.ReactNode;
  heading?: string;
  subheading?: string;
  noHeader?: true;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  searchPlaceholder,
  actionButtonContext,
  modalChildren,
  heading,
  subheading,
  noHeader,
}: DataTableProps<TData, TValue>) {
  const { setOpen } = useModal();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center py-4 gap-2">
          <Search />
          <Input
            placeholder={searchPlaceholder}
            value={
              (table
                .getColumn(filterValue ?? "")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterValue ?? "")
                ?.setFilterValue(event.target.value)
            }
            className="h-12"
          />
        </div>

        {modalChildren && (
          <Button
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  heading={heading || ""}
                  subheading={subheading || ""}
                >
                  {modalChildren}
                </CustomModal>,
              );
            }}
          >
            {actionButtonContext}
          </Button>
        )}
      </div>

      <div className="border bg-background rounded-lg">
        <Table>
          {!noHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="max-w-[400px] break-words"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
