import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function makeClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    }
  )
}

// GET /api/places?city_id=&stroller_friendly=&rainy_day=&car_accessible=
export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = makeClient(cookieStore)
  const { searchParams } = new URL(request.url)

  let query = supabase
    .from('places')
    .select(`
      id, title, description, lat, lng, status,
      car_accessible, stroller_friendly, rainy_day,
      has_toilet, has_shelter, difficulty,
      min_age, max_age, walk_minutes, created_at,
      place_tags ( tag ),
      place_images ( storage_url, is_cover )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (searchParams.get('city_id')) {
    query = query.eq('city_id', searchParams.get('city_id')!)
  }
  if (searchParams.get('stroller_friendly') === 'true') {
    query = query.eq('stroller_friendly', true)
  }
  if (searchParams.get('rainy_day') === 'true') {
    query = query.eq('rainy_day', true)
  }
  if (searchParams.get('car_accessible') === 'true') {
    query = query.eq('car_accessible', true)
  }
  if (searchParams.get('has_toilet') === 'true') {
    query = query.eq('has_toilet', true)
  }
  if (searchParams.get('has_shelter') === 'true') {
    query = query.eq('has_shelter', true)
  }
  if (searchParams.get('difficulty')) {
    query = query.eq('difficulty', searchParams.get('difficulty')!)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ places: data })
}

// POST /api/places — external clients only (web app uses server action instead)
export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = makeClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, lat, lng, city_id, ...rest } = body

  if (!title || !lat || !lng || !city_id) {
    return NextResponse.json({ error: 'title, lat, lng, city_id are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('places')
    .insert({ title, description, lat, lng, city_id, submitted_by: user.id, status: 'pending', ...rest })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ place: data }, { status: 201 })
}
