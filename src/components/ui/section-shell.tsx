import { cn } from "@/lib/utils";

export function SectionShell({
  title,
  description,
  children,
  className
}: React.PropsWithChildren<{ title: string; description?: string; className?: string }>) {
  return (
    <section className={cn("rounded-3xl border border-white/10 bg-card/80 p-6 shadow-glow backdrop-blur", className)}>
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
