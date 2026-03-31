import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { addCity, toggleCityActive } from '@/lib/actions/cities'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminCitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: cities } = await supabase
    .from('cities')
    .select('*, places(count)')
    .order('name')

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Modereringskø</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Byer</h1>
      </div>

      {/* Add city form */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">Legg til en by</h2>
        <form action={addCity} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">Bynavn</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Oslo"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="country_code">Landskode</label>
              <input
                id="country_code"
                name="country_code"
                type="text"
                required
                maxLength={2}
                placeholder="NO"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="lat">
                Breddegrad
                <a
                  href="https://www.latlong.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs font-normal text-blue-500 hover:underline"
                >
                  slå opp ↗
                </a>
              </label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                required
                placeholder="59.9139"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="lng">Lengdegrad</label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                required
                placeholder="10.7522"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="is_active" defaultChecked className="rounded" />
            Gjør aktiv umiddelbart (vises i skjemaet for å legge til steder)
          </label>

          <button
            type="submit"
            className="self-start rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Legg til by
          </button>
        </form>
      </section>

      {/* Cities list */}
      <section>
        <h2 className="mb-3 font-semibold text-gray-900">
          Alle byer <span className="text-gray-400 font-normal">({cities?.length ?? 0})</span>
        </h2>

        {!cities || cities.length === 0 ? (
          <p className="text-sm text-gray-400">Ingen byer ennå.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {cities.map((city) => {
              const placeCount = (city.places as unknown as { count: number }[])?.[0]?.count ?? 0
              return (
                <div
                  key={city.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{city.name}</span>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 uppercase">{city.country_code}</span>
                      {city.is_active ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Aktiv</span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Inaktiv</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {city.lat.toFixed(4)}, {city.lng.toFixed(4)} &middot; {placeCount} sted{placeCount !== 1 ? 'er' : ''}
                    </p>
                  </div>

                  <form action={async () => { 'use server'; await toggleCityActive(city.id, city.is_active) }}>
                    <button
                      type="submit"
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        city.is_active
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {city.is_active ? 'Deaktiver' : 'Aktiver'}
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
