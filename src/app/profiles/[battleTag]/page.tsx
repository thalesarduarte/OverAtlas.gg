import { redirect } from "next/navigation";

export default async function LegacyProfilePage({
  params
}: {
  params: Promise<{ battleTag: string }>;
}) {
  const { battleTag } = await params;

  redirect(`/profile/${encodeURIComponent(decodeURIComponent(battleTag))}`);
}
