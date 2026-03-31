import { createClient } from '@/lib/supabase/server'
import HomePageClient from '@/components/HomePageClient'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const defaultCity = cities?.[0] ?? null

  const { data: places, error } = await supabase
    .from('places')
    .select(`
      *,
      place_images ( storage_url, is_cover ),
      place_tags ( tag ),
      reviews ( rating )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) console.error('Failed to load places:', error.message)

  const shapedPlaces = (places ?? []).map((p) => {
    const cover = (p.place_images as { storage_url: string; is_cover: boolean }[])
      ?.find((img) => img.is_cover)?.storage_url ?? null
    const ratings = (p.reviews as { rating: number | null }[])
      ?.map((r) => r.rating)
      .filter((r): r is number => r != null)
    const avg_rating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null
    const tags = (p.place_tags as { tag: string }[])?.map((t) => t.tag) ?? []
    return { ...p, cover_image: cover, avg_rating, review_count: ratings.length, tags }
  })

  return (
    <HomePageClient
      cityName={defaultCity?.name}
      places={shapedPlaces}
    />
  )
}
