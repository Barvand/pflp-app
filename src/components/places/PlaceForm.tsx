'use client'

import { useState, useTransition } from 'react'
import { submitPlace } from '@/lib/actions/places'
import type { City } from '@/lib/database.types'
import LocationPicker from '@/components/map/LocationPicker'

export default function PlaceForm({ cities }: { cities: City[] }) {
  const [isPending, startTransition] = useTransition()
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!coords) return
    const formData = new FormData(e.currentTarget)
    formData.set('lat', String(coords.lat))
    formData.set('lng', String(coords.lng))
    startTransition(() => submitPlace(formData))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic info */}
      <section className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Grunnleggende info</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="city_id">By</label>
            <select
              id="city_id"
              name="city_id"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="title">Stedsnavn</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="f.eks. Fløyen lekeplass"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="description">
              Beskrivelse <span className="font-normal text-gray-400">(valgfritt)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Hva gjør dette stedet bra for barn?"
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="tags">
              Stikkord <span className="font-normal text-gray-400">(kommaseparert, valgfritt)</span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="f.eks. lekeplass, natur, piknik"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="mb-1 font-semibold text-gray-900">Plassering</h2>
        <p className="mb-4 text-xs text-gray-400">Klikk på kartet for å sette en pin. Du kan dra den for å finjustere posisjonen.</p>
        <LocationPicker onPick={(lat, lng) => setCoords({ lat, lng })} />
        {!coords && (
          <p className="mt-2 text-xs text-red-400">Vennligst sett en pin før du sender inn.</p>
        )}
      </section>

      {/* Details */}
      <section className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="mb-4 font-semibold text-gray-900">Detaljer</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="difficulty">Vanskelighetsgrad</label>
              <select
                id="difficulty"
                name="difficulty"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">—</option>
                <option value="flat">Flat</option>
                <option value="moderate">Moderat</option>
                <option value="steep">Bratt</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="walk_minutes">Gåavstand (min)</label>
              <input
                id="walk_minutes"
                name="walk_minutes"
                type="number"
                min="0"
                placeholder="10"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="min_age">Min. alder</label>
                <input
                  id="min_age"
                  name="min_age"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="max_age">Maks alder</label>
                <input
                  id="max_age"
                  name="max_age"
                  type="number"
                  min="0"
                  placeholder="12"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { name: 'stroller_friendly', label: '🍼 Barnevognvennlig' },
              { name: 'car_accessible', label: '🚗 Tilgjengelig med bil' },
              { name: 'rainy_day', label: '☔ Bra regnværsdag' },
              { name: 'has_toilet', label: '🚻 Har toalett' },
              { name: 'has_shelter', label: '⛺ Har ly' },
            ].map((f) => (
              <label key={f.name} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name={f.name} className="rounded" />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={isPending || !coords}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? 'Sender inn…' : 'Send sted til gjennomgang'}
      </button>
    </form>
  )
}
