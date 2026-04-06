import { cn } from "@/lib/utils";

export function Badge({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200",
        className
      )}
    >
      {children}
    </span>
  );
}
