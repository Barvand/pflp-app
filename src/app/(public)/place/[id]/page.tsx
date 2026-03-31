import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReviewForm from '@/components/places/ReviewForm'
import SaveButton from '@/components/places/SaveButton'
import MapView from '@/components/map/MapView'

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: place }, { data: { user } }] = await Promise.all([
    supabase
      .from('places')
      .select(`
        *,
        place_images ( storage_url, is_cover ),
        place_tags ( tag ),
        reviews ( id, body, rating, stroller_confirmed, created_at, profiles ( display_name ) )
      `)
      .eq('id', id)
      .eq('status', 'approved')
      .single(),
    supabase.auth.getUser(),
  ])

  if (!place) notFound()

  const images = place.place_images as { storage_url: string; is_cover: boolean }[]
  const cover = images?.find((i) => i.is_cover)?.storage_url ?? images?.[0]?.storage_url ?? null
  const tags = (place.place_tags as { tag: string }[])?.map((t) => t.tag) ?? []
  const reviews = place.reviews as {
    id: string
    body: string | null
    rating: number | null
    stroller_confirmed: boolean
    created_at: string
    profiles: { display_name: string | null } | null
  }[]

  const ratings = reviews.map((r) => r.rating).filter((r): r is number => r != null)
  const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null

  // Check if current user has saved this place
  const { data: save } = user
    ? await supabase.from('saves').select('id').eq('user_id', user.id).eq('place_id', id).maybeSingle()
    : { data: null }

  const userReview = user ? reviews.find((r) => (r as unknown as { user_id: string }).user_id === user.id) : null

  const attrs: { label: string; icon: string; active: boolean }[] = [
    { label: 'Barnevognvennlig', icon: '🍼', active: place.stroller_friendly },
    { label: 'Tilgjengelig med bil', icon: '🚗', active: place.car_accessible },
    { label: 'Regnværsdag', icon: '☔', active: place.rainy_day },
    { label: 'Har toalett', icon: '🚻', active: place.has_toilet },
    { label: 'Har ly', icon: '⛺', active: place.has_shelter },
  ]

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
        ← Tilbake til steder
      </Link>

      {/* Cover */}
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={place.title} className="mb-6 h-64 w-full rounded-xl object-cover" />
      ) : (
        <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
          <span className="text-6xl opacity-30">📍</span>
        </div>
      )}

      {/* Title + rating + save */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{place.title}</h1>
        <div className="flex shrink-0 items-center gap-3">
          {avg && (
            <div className="text-right">
              <div className="text-xl font-bold text-amber-500">★ {avg}</div>
              <div className="text-xs text-gray-400">{ratings.length} anmeldelse{ratings.length !== 1 ? 'r' : ''}</div>
            </div>
          )}
          {user && <SaveButton placeId={id} saved={!!save} />}
        </div>
      </div>

      {place.description && (
        <p className="mb-6 text-gray-600 leading-relaxed">{place.description}</p>
      )}

      {/* Details grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm sm:grid-cols-3">
        {place.difficulty && (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Vanskelighetsgrad</div>
            <div className="mt-0.5 font-medium capitalize">{place.difficulty}</div>
          </div>
        )}
        {place.walk_minutes != null && (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Gange</div>
            <div className="mt-0.5 font-medium">{place.walk_minutes} min</div>
          </div>
        )}
        {(place.min_age != null || place.max_age != null) && (
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Alder</div>
            <div className="mt-0.5 font-medium">
              {place.min_age != null && place.max_age != null
                ? `${place.min_age}–${place.max_age} år`
                : place.min_age != null
                ? `${place.min_age}+ år`
                : `opp til ${place.max_age} år`}
            </div>
          </div>
        )}
      </div>

      {/* Attributes */}
      <div className="mb-6 flex flex-wrap gap-2">
        {attrs.filter((a) => a.active).map((a) => (
          <span key={a.label} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            {a.icon} {a.label}
          </span>
        ))}
      </div>

      {/* Map */}
      <div className="mb-6">
        <h2 className="mb-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Plassering</h2>
        <MapView lat={place.lat} lng={place.lng} title={place.title} />
        <a
          href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          Åpne i Google Maps ↗
        </a>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500">{t}</span>
          ))}
        </div>
      )}

      {/* Reviews */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Anmeldelser {reviews.length > 0 && <span className="text-gray-400 font-normal">({reviews.length})</span>}
        </h2>

        {reviews.length === 0 ? (
          <p className="mb-6 text-sm text-gray-400">Ingen anmeldelser ennå. Vær den første!</p>
        ) : (
          <div className="mb-6 flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-100 bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-gray-700 text-sm">
                    {r.profiles?.display_name ?? 'Anonym'}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {r.rating != null && <span className="text-amber-500 font-semibold">★ {r.rating}</span>}
                    {r.stroller_confirmed && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">🍼 barnevogn ✓</span>
                    )}
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {r.body && <p className="text-sm text-gray-600">{r.body}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Review form — logged-in users only */}
        {user ? (
          <ReviewForm placeId={id} existingRating={userReview?.rating} />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">
            <Link href="/login" className="text-blue-600 hover:underline">Logg inn</Link> for å skrive en anmeldelse.
          </div>
        )}
      </section>
    </main>
  )
}
