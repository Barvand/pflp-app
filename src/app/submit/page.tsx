import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaceForm from "@/components/places/PlaceForm";

export default async function SubmitPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cities } = await supabase
    .from("cities")
    .select("*")
    .eq("is_active", true)
    .order("name");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Send inn et sted</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kjenner du et flott sted for barn? Del det – det blir gjennomgått før det publiseres.
        </p>
      </div>

      <PlaceForm cities={cities ?? []} />
    </main>
  );
}
