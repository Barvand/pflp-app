import Link from "next/link";
import type { Place } from "@/lib/database.types";

type PlaceWithExtras = Place & {
  cover_image?: string | null;
  avg_rating?: number | null;
  review_count?: number;
  tags?: string[];
};

const difficultyLabel: Record<string, string> = {
  flat: "Flat",
  moderate: "Moderat",
  steep: "Bratt",
};

const difficultyColor: Record<string, string> = {
  flat: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  steep: "bg-red-100 text-red-700",
};

function Badge({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
      <span>{icon}</span>
      {label}
    </span>
  );
}

export default function PlaceCard({ place }: { place: PlaceWithExtras }) {
  const badges: { label: string; icon: string }[] = [];
  if (place.stroller_friendly) badges.push({ label: "Barnevogn", icon: "🍼" });
  if (place.car_accessible) badges.push({ label: "Bil", icon: "🚗" });
  if (place.rainy_day) badges.push({ label: "Regnværsdag", icon: "☔" });
  if (place.has_toilet) badges.push({ label: "Toalett", icon: "🚻" });
  if (place.has_shelter) badges.push({ label: "Ly", icon: "⛺" });

  return (
    <Link
      href={`/place/${place.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-blue-300"
    >
      {/* Cover image / placeholder */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
        {place.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={place.cover_image}
            alt={place.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl opacity-30">📍</span>
        )}
        {place.difficulty && (
          <span
            className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyColor[place.difficulty]}`}
          >
            {difficultyLabel[place.difficulty]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
          {place.title}
        </h3>

        {place.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {place.description}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-gray-500">
          {place.walk_minutes != null && (
            <span>🚶 {place.walk_minutes} min</span>
          )}
          {(place.min_age != null || place.max_age != null) && (
            <span>
              👶{" "}
              {place.min_age != null && place.max_age != null
                ? `${place.min_age}–${place.max_age} år`
                : place.min_age != null
                  ? `${place.min_age}+ år`
                  : `opp til ${place.max_age} år`}
            </span>
          )}
          {place.avg_rating != null && (
            <span className="ml-auto flex items-center gap-0.5 text-amber-500 font-medium">
              ★ {place.avg_rating.toFixed(1)}
              <span className="text-gray-400 font-normal">
                ({place.review_count ?? 0})
              </span>
            </span>
          )}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {badges.map((b) => (
              <Badge key={b.label} {...b} />
            ))}
          </div>
        )}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {place.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-500"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
