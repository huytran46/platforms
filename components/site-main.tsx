import { cn } from "@/lib/utils";

const SiteMain = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="flex flex-1 flex-col">
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div
        className={cn("flex flex-col gap-4 md:gap-6 flex-1 py-4", className)}
      >
        {children}
      </div>
    </div>
  </div>
);

export { SiteMain };
