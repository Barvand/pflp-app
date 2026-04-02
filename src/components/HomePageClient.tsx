"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import PlaceCard from "@/components/places/PlaceCard";
import HeroBanner from "@/components/layout/HeroBanner";
import type { Place } from "@/lib/database.types";
import { BERGEN_BYDELER, isBergenCity } from "@/lib/bergen";

const AllPlacesMap = dynamic(() => import("@/components/map/AllPlacesMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-stone-100" />,
});

type ShapedPlace = Place & {
  cover_image: string | null;
  avg_rating: number | null;
  review_count: number;
  tags: string[];
};

const FILTERS = [
  { label: "Barnevogn", key: "stroller_friendly" as const },
  { label: "Regnvaersdag", key: "rainy_day" as const },
  { label: "Biltilgang", key: "car_accessible" as const },
  { label: "Toalett", key: "has_toilet" as const },
  { label: "Ly", key: "has_shelter" as const },
];

const highlights = [
  {
    title: "Lokale favoritter",
    body: "Steder som ofte deles fra foreldre til foreldre, ikke bare de mest kjente attraksjonene.",
  },
  {
    title: "Praktisk for barn",
    body: "Filter pa vogn, bil, ly, toalett og avstand gjor det raskere a velge noe som faktisk fungerer.",
  },
  {
    title: "Laget for deling",
    body: "Nar du finner et fint sted, kan du sende det inn sa andre familier far glede av det.",
  },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface HomePageClientProps {
  cityName?: string;
  places: ShapedPlace[];
}

export default function HomePageClient({
  cityName,
  places,
}: HomePageClientProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [radiusKm, setRadiusKm] = useState(2);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedBydel, setSelectedBydel] = useState("");

  const showBydelFilter = isBergenCity(cityName);

  const handleNearMe = useCallback(() => {
    if (nearMe) {
      setNearMe(false);
      setUserLocation(null);
      setGeoError(null);
      return;
    }

    if (!navigator.geolocation) {
      setGeoError("Nettleseren din stotter ikke posisjonering.");
      return;
    }

    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setNearMe(true);
        setGeoLoading(false);
      },
      () => {
        setGeoError(
          "Kunne ikke hente posisjon. Sjekk tillatelser i nettleseren.",
        );
        setGeoLoading(false);
      },
    );
  }, [nearMe]);

  const toggleFilter = useCallback((key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const filteredPlaces = places.filter((p) => {
    if (selectedBydel && p.bydel !== selectedBydel) return false;

    if (nearMe && userLocation) {
      if (
        haversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng) > radiusKm
      )
        return false;
    }

    for (const key of activeFilters) {
      if (!p[key as keyof Place]) return false;
    }

    return true;
  });

  return (
    <>
      <HeroBanner cityName={cityName} placeCount={places.length} />

      <section className="relative -mt-px overflow-hidden bg-[var(--brand)] pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="absolute inset-0 " />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              Derfor finnes KidSpots
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Et roligere sted a starte neste familietur.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] backdrop-blur-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                  Derfor finnes appen
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/74">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="places" className="mx-auto max-w-6xl px-4 pb-14 pt-10">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Utforsk kartet
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-900">
                Se hvilke steder som finnes
                {cityName ? ` i ${cityName}` : ""}.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
                Start med kartet for oversikt, eller bruk filtrene under for a
                finne steder som passer dagen du har foran deg. Dette er ment
                for raske, enkle familieturer.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-stone-100 p-4">
                  <p className="text-2xl font-semibold text-stone-900">
                    {places.length}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">
                    steder klare til bruk
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-2xl font-semibold text-amber-800">
                    {activeFilters.size + (selectedBydel ? 1 : 0)}
                  </p>
                  <p className="mt-1 text-sm text-amber-700">aktive filtre</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-stone-200">
              <div className="h-[320px] w-full bg-stone-100 sm:h-[380px]">
                <AllPlacesMap
                  places={places}
                  userLocation={userLocation}
                  radiusKm={radiusKm}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
              Filtrer steder
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">
              Finn noe som passer barna dine akkurat i dag.
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Velg praktiske behov for turen. Du kan ogsa vise steder naer deg
              dersom du vil ha noe raskt og enkelt.
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {showBydelFilter && (
              <select
                value={selectedBydel}
                onChange={(e) => setSelectedBydel(e.target.value)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 outline-none transition-colors hover:border-amber-300 focus:border-amber-400"
              >
                <option value="">Alle bydeler</option>
                {BERGEN_BYDELER.map((bydel) => (
                  <option key={bydel} value={bydel}>
                    {bydel}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleNearMe}
              disabled={geoLoading}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                nearMe
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-sky-400 hover:text-sky-700"
              }`}
            >
              {geoLoading
                ? "Laster posisjon..."
                : nearMe
                  ? "Viser steder naer deg"
                  : "Finn steder naer meg"}
            </button>

            {nearMe && (
              <div className="flex flex-wrap gap-2">
                {[2, 5, 10, 20].map((km) => (
                  <button
                    key={km}
                    onClick={() => setRadiusKm(km)}
                    className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      radiusKm === km
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900"
                    }`}
                  >
                    {km} km
                  </button>
                ))}
              </div>
            )}

            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => toggleFilter(f.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilters.has(f.key)
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-stone-300 bg-white text-stone-700 hover:border-amber-300 hover:text-amber-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {geoError && <p className="mb-4 text-sm text-red-600">{geoError}</p>}

          {nearMe && userLocation && (
            <p className="mb-4 text-sm font-medium text-sky-700">
              {filteredPlaces.length === 0
                ? `Ingen steder innen ${radiusKm} km fra deg`
                : `Viser ${filteredPlaces.length} sted${filteredPlaces.length !== 1 ? "er" : ""} innen ${radiusKm} km fra deg`}
            </p>
          )}

          {!nearMe && selectedBydel && (
            <p className="mb-4 text-sm font-medium text-amber-800">
              Viser {filteredPlaces.length} sted
              {filteredPlaces.length !== 1 ? "er" : ""} i {selectedBydel}.
            </p>
          )}

          {!nearMe && activeFilters.size === 0 && !selectedBydel && (
            <p className="mb-4 text-sm text-stone-500">
              Viser alle godkjente steder delt av foreldre og lokale
              bidragsytere.
            </p>
          )}

          {filteredPlaces.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-20 text-center">
              <h3 className="text-xl font-semibold text-stone-900">
                {nearMe || selectedBydel
                  ? "Ingen steder passer dette soket enda"
                  : "Ingen steder er publisert enda"}
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
                {nearMe || selectedBydel
                  ? "Prov a utvide soket eller fjerne noen filtre for a se flere forslag."
                  : "Nar nye steder blir sendt inn og godkjent, dukker de opp her."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
