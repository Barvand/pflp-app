'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { BERGEN_BYDELER } from '@/lib/bergen'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`)
  }

  if (profile.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return { user }
}

export async function submitPlace(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const rawBydel = (formData.get('bydel') as string | null)?.trim() ?? ''
  const bydel = rawBydel && BERGEN_BYDELER.includes(rawBydel as (typeof BERGEN_BYDELER)[number])
    ? rawBydel
    : null

  const tags = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { data: place, error } = await supabase
    .from('places')
    .insert({
      city_id: formData.get('city_id') as string,
      bydel,
      submitted_by: user.id,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      lat: parseFloat(formData.get('lat') as string),
      lng: parseFloat(formData.get('lng') as string),
      status: 'pending',
      difficulty: (formData.get('difficulty') as 'flat' | 'moderate' | 'steep') || null,
      stroller_friendly: formData.get('stroller_friendly') === 'on',
      car_accessible: formData.get('car_accessible') === 'on',
      rainy_day: formData.get('rainy_day') === 'on',
      has_toilet: formData.get('has_toilet') === 'on',
      has_shelter: formData.get('has_shelter') === 'on',
      min_age: formData.get('min_age') ? parseInt(formData.get('min_age') as string) : null,
      max_age: formData.get('max_age') ? parseInt(formData.get('max_age') as string) : null,
      walk_minutes: formData.get('walk_minutes') ? parseInt(formData.get('walk_minutes') as string) : null,
    })
    .select('id')
    .single()

  if (error || !place) throw new Error(error?.message ?? 'Failed to submit place')

  if (tags.length > 0) {
    await supabase.from('place_tags').insert(tags.map((tag) => ({ place_id: place.id, tag })))
  }

  revalidatePath('/')
  redirect('/?submitted=1')
}

export async function deletePlace(placeId: string) {
  await requireAdmin()
  const supabase = createAdminClient()

  const { data: place, error: placeError } = await supabase
    .from('places')
    .select('id')
    .eq('id', placeId)
    .maybeSingle()

  if (placeError) {
    throw new Error(`Failed to load place: ${placeError.message}`)
  }

  if (!place) {
    throw new Error('Place not found')
  }

  const deletions = [
    { table: 'moderation_log', column: 'place_id' },
    { table: 'place_tags', column: 'place_id' },
    { table: 'place_images', column: 'place_id' },
    { table: 'reviews', column: 'place_id' },
    { table: 'saves', column: 'place_id' },
    { table: 'places', column: 'id' },
  ] as const

  for (const { table, column } of deletions) {
    const query = supabase.from(table).delete()
    const { error } = column === 'id' ? await query.eq('id', placeId) : await query.eq('place_id', placeId)

    if (error) {
      throw new Error(`Failed to delete ${table}: ${error.message}`)
    }
  }

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/place/${placeId}`)
}

export async function moderatePlace(placeId: string, action: 'approved' | 'rejected') {
  const { user } = await requireAdmin()
  const supabase = createAdminClient()

  const { error: updateError } = await supabase
    .from('places')
    .update({ status: action })
    .eq('id', placeId)

  if (updateError) {
    throw new Error(`Failed to update place status: ${updateError.message}`)
  }

  const { error: logError } = await supabase.from('moderation_log').insert({
    place_id: placeId,
    reviewed_by: user.id,
    action,
  })

  if (logError) {
    throw new Error(`Failed to write moderation log: ${logError.message}`)
  }

  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/place/${placeId}`)
}
