import { cn } from "@/lib/utils";

export function SectionShell({
  title,
  description,
  children,
  className
}: React.PropsWithChildren<{ title: string; description?: string; className?: string }>) {
  return (
    <section
      className={cn(
        "glass-panel card-hover rounded-[2rem] p-6 md:p-7",
        className
      )}
    >
      <div className="mb-5 space-y-2">
        <h2 className="app-heading text-2xl font-bold tracking-tight text-white md:text-[1.8rem]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
