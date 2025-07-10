import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  href,
  children,
  ref,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLAnchorElement>;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      ref={ref}
      className={cn(
        "relative flex items-center gap-2",
        className,
        isActive && "hover:bg-transparent hover:cursor-default"
      )}
      href={href}
    >
      {children}
      {isActive && (
        <span className="absolute right-2 size-2 rounded-full bg-blue-500 animate-[pulse_0.8s_ease-in-out_infinite]" />
      )}
    </Link>
  );
};

export { ActiveLink };
