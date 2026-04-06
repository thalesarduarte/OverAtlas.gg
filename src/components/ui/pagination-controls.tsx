import type { Route } from "next";
import Link from "next/link";

import type { PaginationMeta } from "@/lib/atlas-data";

export function PaginationControls({
  pagination,
  basePath,
  searchParams
}: {
  pagination: PaginationMeta;
  basePath: Route;
  searchParams: Record<string, string | undefined>;
}) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    params.set("page", String(page));
    return `${basePath}?${params.toString()}` as Route;
  };

  return (
    <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
      <p>
        Pagina {pagination.page} de {pagination.totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(Math.max(1, pagination.page - 1))}
          className="rounded-full border border-white/10 px-3 py-1.5 transition hover:bg-white/5"
        >
          Anterior
        </Link>
        <Link
          href={buildHref(Math.min(pagination.totalPages, pagination.page + 1))}
          className="rounded-full border border-white/10 px-3 py-1.5 transition hover:bg-white/5"
        >
          Proxima
        </Link>
      </div>
    </div>
  );
}
