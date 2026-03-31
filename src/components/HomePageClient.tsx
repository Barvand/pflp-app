'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import PlaceCard from '@/components/places/PlaceCard'
import type { Place } from '@/lib/database.types'

const AllPlacesMap = dynamic(() => import('@/components/map/AllPlacesMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

type ShapedPlace = Place & {
  cover_image: string | null
  avg_rating: number | null
  review_count: number
  tags: string[]
}

const FILTERS = [
  { label: '🍼 Barnevogn', key: 'stroller_friendly' as const },
  { label: '☔ Regnværsdag', key: 'rainy_day' as const },
  { label: '🚗 Biltilgang', key: 'car_accessible' as const },
  { label: '🚻 Toalett', key: 'has_toilet' as const },
  { label: '⛺ Ly', key: 'has_shelter' as const },
]

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

interface HomePageClientProps {
  cityName?: string
  places: ShapedPlace[]
}

export default function HomePageClient({ cityName, places }: HomePageClientProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [nearMe, setNearMe] = useState(false)
  const [radiusKm, setRadiusKm] = useState(2)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())

  const handleNearMe = useCallback(() => {
    if (nearMe) {
      setNearMe(false)
      setUserLocation(null)
      setGeoError(null)
      return
    }
    if (!navigator.geolocation) {
      setGeoError('Nettleseren din støtter ikke posisjonering.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNearMe(true)
        setGeoLoading(false)
      },
      () => {
        setGeoError('Kunne ikke hente posisjon. Sjekk posiseringstillatelser i nettleseren.')
        setGeoLoading(false)
      },
    )
  }, [nearMe])

  const toggleFilter = useCallback((key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const filteredPlaces = places.filter((p) => {
    if (nearMe && userLocation) {
      if (haversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng) > radiusKm) return false
    }
    for (const key of activeFilters) {
      if (!p[key as keyof Place]) return false
    }
    return true
  })

  return (
    <>
      {/* ── Map hero ── */}
      <div className="relative w-full" style={{ height: '80vh' }}>
        <AllPlacesMap
          places={places}
          userLocation={userLocation}
          radiusKm={radiusKm}
        />

        {/* Overlay card */}
        <div className="absolute left-4 top-4 z-[1000] w-72 rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {cityName ? `Utforsker ${cityName}` : 'Familieventyr venter'}
            </span>
          </div>

          <h1 className="text-xl font-black leading-tight text-gray-900">
            De beste stedene for dine barn
            {cityName && (
              <span className="mt-0.5 block text-base font-semibold text-rose-500">
                i {cityName}
              </span>
            )}
          </h1>

          <p className="mt-1 text-xs text-gray-400">
            {places.length} steder · 100 % gratis å bruke
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href="#places"
              className="block rounded-xl bg-rose-500 px-4 py-2.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-rose-600"
            >
              Utforsk steder →
            </a>
            <Link
              href="/submit"
              className="block rounded-xl border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Legg til et sted
            </Link>
          </div>
        </div>
      </div>

      {/* ── Places section ── */}
      <main id="places" className="mx-auto max-w-6xl px-4 py-10">
        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap gap-2">
          {/* Near-me button */}
          <button
            onClick={handleNearMe}
            disabled={geoLoading}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors select-none ${
              nearMe
                ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            {geoLoading ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              '📍'
            )}
            Nær meg
          </button>

          {/* Radius selector — only visible when nearMe is active */}
          {nearMe && (
            <div className="flex items-center gap-1">
              {[2, 5, 10, 20].map((km) => (
                <button
                  key={km}
                  onClick={() => setRadiusKm(km)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors select-none ${
                    radiusKm === km
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          )}

          {/* Attribute filters */}
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors select-none ${
                activeFilters.has(f.key)
                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Geo error */}
        {geoError && <p className="mb-4 text-sm text-red-500">{geoError}</p>}

        {/* Near-me result count */}
        {nearMe && userLocation && (
          <p className="mb-4 text-sm font-medium text-blue-600">
            {filteredPlaces.length === 0
              ? `Ingen steder innen ${radiusKm} km fra deg`
              : `Viser ${filteredPlaces.length} sted${filteredPlaces.length !== 1 ? 'er' : ''} innen ${radiusKm} km fra deg`}
          </p>
        )}

        {filteredPlaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-24 text-center">
            <span className="text-5xl">{nearMe ? '📍' : '🗺️'}</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-700">
              {nearMe ? 'Ingen steder nær deg' : 'Ingen steder ennå'}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {nearMe
                ? 'Prøv å fjerne filtre eller beveg deg til et annet område.'
                : 'Godkjente steder vil vises her etter at de er sendt inn og gjennomgått.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
