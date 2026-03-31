import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { moderatePlace, deletePlace } from '@/lib/actions/places'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { data: pending } = await supabase
    .from('places')
    .select('id, title, description, created_at, difficulty, stroller_friendly, car_accessible, lat, lng')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: approved } = await supabase
    .from('places')
    .select('id, title, description, created_at, difficulty, stroller_friendly, car_accessible, lat, lng')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Admin nav */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Modereringskø</h1>
        <Link
          href="/admin/cities"
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          🌍 Administrer byer
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="sr-only">Modereringskø</h1>
        <p className="text-sm text-gray-500 mt-1">
          {pending?.length ?? 0} sted{pending?.length !== 1 ? 'er' : ''} venter på gjennomgang
        </p>
      </div>

      {!pending || pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <span className="text-4xl">✅</span>
          <h2 className="mt-3 text-base font-semibold text-gray-700">Alt er gjennomgått</h2>
          <p className="mt-1 text-sm text-gray-400">Ingen steder venter på gjennomgang.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((place) => (
            <div
              key={place.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{place.title}</h3>
                  {place.difficulty && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 capitalize">
                      {place.difficulty}
                    </span>
                  )}
                  {place.stroller_friendly && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">🍼 stroller</span>
                  )}
                  {place.car_accessible && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">🚗 car</span>
                  )}
                </div>
                {place.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{place.description}</p>
                )}
                <p className="mt-1.5 text-xs text-gray-400">
                  📍 {place.lat.toFixed(4)}, {place.lng.toFixed(4)} &middot; Sendt inn {new Date(place.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <form action={async () => { 'use server'; await moderatePlace(place.id, 'approved') }}>
                  <button
                    type="submit"
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Godkjenn
                  </button>
                </form>
                <form action={async () => { 'use server'; await moderatePlace(place.id, 'rejected') }}>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Avvis
                  </button>
                </form>
                <form action={async () => { 'use server'; await deletePlace(place.id) }}>
                  <button
                    type="submit"
                    className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 transition-colors"
                  >
                    Slett
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Approved places ── */}
      <div className="mt-12">
        <h2 className="mb-1 text-xl font-bold text-gray-900">Godkjente steder</h2>
        <p className="mb-4 text-sm text-gray-500">
          {approved?.length ?? 0} godkjent{approved?.length !== 1 ? 'e' : ''} sted{approved?.length !== 1 ? 'er' : ''}
        </p>

        {!approved || approved.length === 0 ? (
          <p className="text-sm text-gray-400">Ingen godkjente steder ennå.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {approved.map((place) => (
              <div
                key={place.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-green-100 bg-green-50/40 p-5 shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{place.title}</h3>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Godkjent</span>
                    {place.difficulty && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 capitalize">
                        {place.difficulty}
                      </span>
                    )}
                  </div>
                  {place.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{place.description}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-400">
                    📍 {place.lat.toFixed(4)}, {place.lng.toFixed(4)} &middot; {new Date(place.created_at).toLocaleDateString()}
                  </p>
                </div>

                <form action={async () => { 'use server'; await deletePlace(place.id) }}>
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Slett
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
