import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-[calc(100%-2.5rem)] max-w-[1280px] sm:w-[calc(100%-4rem)] lg:w-[calc(100%-7rem)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
