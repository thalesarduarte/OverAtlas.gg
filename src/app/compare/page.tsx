import { ComparisonGrid } from "@/components/stats/comparison-grid";
import { HeroChart } from "@/components/stats/hero-chart";
import { SectionShell } from "@/components/ui/section-shell";
import { profiles, sampleComparison } from "@/lib/mock-data";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ left?: string; right?: string }> }) {
  const params = await searchParams;
  const left = params.left ? profiles[params.left] : sampleComparison.left;
  const right = params.right ? profiles[params.right] : sampleComparison.right;

  const comparison = {
    left: left ?? sampleComparison.left,
    right: right ?? sampleComparison.right
  };

  return (
    <div className="space-y-6">
      <SectionShell title="Comparação de perfis" description="Estrutura pronta para comparar o perfil do usuário autenticado com qualquer BattleTag pesquisada.">
        <ComparisonGrid comparison={comparison} />
      </SectionShell>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionShell title={comparison.left.displayName} description={comparison.left.rankSummary}>
          <HeroChart data={comparison.left.topHeroes} />
        </SectionShell>
        <SectionShell title={comparison.right.displayName} description={comparison.right.rankSummary}>
          <HeroChart data={comparison.right.topHeroes} />
        </SectionShell>
      </div>
    </div>
  );
}
