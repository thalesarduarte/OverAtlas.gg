import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/ui/section-shell";
import { news } from "@/lib/mock-data";

export default function NewsPage() {
  return (
    <SectionShell title="Notícias" description="Lista inicial de matérias, análises e updates competitivos.">
      <div className="space-y-4">
        {news.map((item) => (
          <article key={item.slug} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <Badge className="mb-4">{item.tag}</Badge>
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.excerpt}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
