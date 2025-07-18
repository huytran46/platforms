"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { z } from "zod";

import { AtmData } from "@/app/dashboard/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const editCoordinatesAtom = atom<string | null>(null);

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const EditCoordinatesItem = ({ id }: { id: string }) => {
  const setEditCoordinatesAtom = useSetAtom(editCoordinatesAtom);
  return (
    <DropdownMenuItem
      onClick={(e) => {
        setEditCoordinatesAtom(id);
        e.stopPropagation();
      }}
    >
      Edit coordinates
    </DropdownMenuItem>
  );
};

const columns: ColumnDef<AtmData>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <EditCoordinatesItem id={row.original.id} />
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: "id",
    header: "ID",
    accessorKey: "id",
  },
  {
    id: "atm",
    header: "ATM",
    accessorKey: "atm",
  },
  {
    id: "district_extracted",
    header: "District",
    accessorKey: "district_extracted",
  },
  {
    id: "coordinates",
    header: "Coordinates",
    accessorKey: "coordinates",
    cell: ({ row }) => {
      const coordinates = row.original.coordinates;
      if (!coordinates) return null;
      if (typeof coordinates === "object" && "type" in coordinates) {
        return (
          <div>
            {coordinates.coordinates[1]}, {coordinates.coordinates[0]}
          </div>
        );
      }
      return null;
    },
  },
  {
    id: "image_src",
    header: "Image",
    accessorKey: "image_src",
  },
  {
    id: "address_extracted",
    header: "Address",
    accessorKey: "address_extracted",
    size: 200,
  },
];

function DraggableRow({ row }: { row: Row<AtmData> }) {
  // const { transform, transition, setNodeRef, isDragging } = useSortable({
  //   id: row.original.id,
  // });

  return (
    <TableRow
      // data-state={row.getIsSelected() && "selected"}
      // data-dragging={isDragging}
      // ref={setNodeRef}
      // style={{
      //   transform: CSS.Transform.toString(transform),
      //   transition: transition,
      // }}
      className="relative data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const EditCoordinatesDialog = () => {
  const [editCoordinates, setEditCoordinates] = useAtom(editCoordinatesAtom);
  return (
    <Dialog
      open={!!editCoordinates}
      onOpenChange={(nextState) => !nextState && setEditCoordinates(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit coordinates</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export function DataTable({
  data,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
  currentPageIndex,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  pageSize,
  onFirstPage,
  onLastPage,
  stickyHeaderContent,
}: {
  data: AtmData[];
  currentPageIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
  stickyHeaderContent?: React.ReactNode;
  onPageSizeChange: (pageSize: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      {/* PAGINATION CONTROLLER */}
      <div className="sticky top-0 flex w-full items-center justify-end gap-8 bg-white px-6 py-2 z-10">
        {stickyHeaderContent}

        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center text-sm font-medium">
          Page {currentPageIndex + 1} of {totalPages}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onFirstPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => {
              onPreviousPage();
            }}
            disabled={!hasPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => {
              onNextPage();
            }}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onLastPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 py-1 z-0">
        {/* TABLE */}
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
