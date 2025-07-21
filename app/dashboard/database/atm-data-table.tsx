"use client";

import { DataTable } from "@/app/dashboard/database/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAtmData } from "./atm-api";
import { AtmDataDialog } from "./atm-data-dialog";
import { AtmRemovalDialog } from "./atm-removal-dialog";
import { useDeleteAtmDialog, useEditAtmDialog } from "./states";

const EditAtmDialog = () => {
  const { editAtm, setEditAtm } = useEditAtmDialog();
  return (
    <AtmDataDialog
      open={!!editAtm}
      onOpenChange={() => setEditAtm(undefined)}
      initialData={editAtm}
    />
  );
};

const RemoveAtmDialog = () => {
  const { deleteAtm, setDeleteAtm } = useDeleteAtmDialog();
  return (
    <AtmRemovalDialog
      open={!!deleteAtm}
      atm={deleteAtm!}
      onOpenChange={() => setDeleteAtm(undefined)}
    />
  );
};

const useSearchKeyword = (
  onDebouncedSearchKeywordChange?: (searchKeyword: string) => void
) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      onDebouncedSearchKeywordChange?.(searchKeyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword, onDebouncedSearchKeywordChange]);

  return { searchKeyword, setSearchKeyword, debouncedSearchKeyword };
};

const AtmDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const onDebouncedSearchKeywordChange = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [setPagination]);

  const { searchKeyword, setSearchKeyword, debouncedSearchKeyword } =
    useSearchKeyword(onDebouncedSearchKeywordChange);

  const { data, fetchNextPage, fetchPreviousPage, isFetching } = useAtmData(
    pagination.pageSize,
    debouncedSearchKeyword
  );

  const currentPageIndex = pagination.pageIndex;
  const currentPageData =
    data?.pages[pagination.pageIndex]?.data ??
    data?.pages[pagination.pageIndex - 1]?.data ??
    [];

  const totalPages = data?.pages[0]?.totalPages || 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFetching || event.metaKey || event.ctrlKey || event.shiftKey)
        return;

      // Option/Alt + h/l to navigate through pages
      if (!event.altKey) return;

      switch (event.key) {
        case "˙":
          event.preventDefault();
          fetchPreviousPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.max(0, prev.pageIndex - 1),
          }));
          break;
        case "¬":
          event.preventDefault();
          fetchNextPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
          }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fetchNextPage, fetchPreviousPage, isFetching, totalPages, setPagination]);

  return (
    <div className={cn("relative flex flex-col", isFetching && "opacity-50")}>
      <DataTable
        stickyHeaderContent={
          <div className="flex flex-1 items-center gap-2">
            <AtmDataDialog>
              <Button size="sm">
                <PlusIcon className="size-4" />
                Create
              </Button>
            </AtmDataDialog>
            <div className="relative max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Tìm kiếm theo tên, địa chỉ, quận huyện..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        }
        totalPages={totalPages}
        currentPageIndex={currentPageIndex}
        data={currentPageData}
        hasNextPage={!(currentPageData?.length < pagination.pageSize)}
        hasPreviousPage={pagination.pageIndex > 0}
        pageSize={pagination.pageSize}
        onPageSizeChange={(pageSize) => {
          setPagination({
            pageIndex: 0,
            pageSize,
          });
        }}
        // onFirstPage={() => {
        //   setPagination((prev) => ({
        //     ...prev,
        //     pageIndex: 0,
        //   }));
        // }}
        // onLastPage={() => {
        //   setPagination((prev) => ({
        //     ...prev,
        //     pageIndex: totalPages - 1,
        //   }));
        // }}
        onPreviousPage={() => {
          fetchPreviousPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }));
        }}
        onNextPage={() => {
          fetchNextPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
          }));
        }}
      />

      <EditAtmDialog />
      <RemoveAtmDialog />
    </div>
  );
};

export { AtmDataTable };
