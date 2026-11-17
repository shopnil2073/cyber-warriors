import type { Metadata } from "next";
import CategoryHub from "../components/tournament/CategoryHub";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Solo Tournaments | Cyber Warriors" };

export default function SoloPage() {
  return (
    <CategoryHub
      categories={["solo"]}
      badge="Solo arena"
      title="Cyber Warriors Solo"
      subtitle="One player. One controller. Live fixtures, results, rankings and top scorers."
    />
  );
}
