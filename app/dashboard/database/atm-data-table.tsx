"use client";

import { DataTable } from "@/app/dashboard/database/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AtmData } from "./types";
import { AtmDataDialog } from "./atm-data-dialog";
import { useEditAtmDialog } from "./states";

const supabase = createClient();

type PaginatedAtmData = {
  data: AtmData[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const getAtmData = async (
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedAtmData | null> => {
  // Calculate range for pagination (Supabase uses 0-based indexing)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let {
    data: atmData,
    error,
    count,
  } = await supabase
    .from("atm_refined")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching ATM data:", error);
    return null;
  }

  if (!atmData || count === null) {
    return null;
  }

  const totalPages = Math.ceil(count / pageSize);

  return {
    data: atmData,
    count,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

const useAtmData = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["atm-data", pageSize],
    queryFn: ({ pageParam }) => getAtmData(pageParam, pageSize),
    getNextPageParam: (lastPage) =>
      lastPage?.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

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

const AtmDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, fetchNextPage, fetchPreviousPage, isFetching, isLoading } =
    useAtmData(pagination.pageSize);

  const currentPageIndex = pagination.pageIndex;
  const currentPageData =
    data?.pages[pagination.pageIndex]?.data ??
    data?.pages[pagination.pageIndex - 1]?.data ??
    [];

  const totalPages = data?.pages[0]?.totalPages || 0;

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-[40px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

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
    </div>
  );
};

export { AtmDataTable };
