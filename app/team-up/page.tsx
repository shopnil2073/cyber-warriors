import type { Metadata } from "next";
import CategoryHub from "../components/tournament/CategoryHub";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Team Up | Cyber Warriors" };

export default function TeamUpPage() {
  return (
    <CategoryHub
      categories={["teamup", "duo", "4man", "6man"]}
      badge="Squad zone"
      title="Team Up"
      subtitle="Duo, 4 Man, 6 Man and Team Up tournaments. Build your squad and fight for glory."
    />
  );
}
