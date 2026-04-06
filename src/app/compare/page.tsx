import { CompareClient } from "@/components/compare/compare-client";
import { comparePlayerProfiles } from "@/lib/profile-service";

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ player1?: string; player2?: string }>;
}) {
  const params = await searchParams;
  const initialPlayer1 = params.player1 ?? "Proper#1111";
  const initialPlayer2 = params.player2 ?? "Thales#1234";
  const initialComparePayload =
    (await comparePlayerProfiles(initialPlayer1, initialPlayer2)).comparison ??
    (await comparePlayerProfiles("Proper#1111", "Thales#1234")).comparison;

  if (!initialComparePayload) {
    return null;
  }

  return (
    <CompareClient
      initialComparison={{
        left: initialComparePayload.player1,
        right: initialComparePayload.player2
      }}
      initialDiffSummary={initialComparePayload.diffSummary}
      initialPlayer1={initialPlayer1}
      initialPlayer2={initialPlayer2}
    />
  );
}
