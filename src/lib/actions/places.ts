'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitPlace(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const tags = (formData.get('tags') as string)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const { data: place, error } = await supabase
    .from('places')
    .insert({
      city_id: formData.get('city_id') as string,
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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  await supabase.from('moderation_log').delete().eq('place_id', placeId)
  await supabase.from('place_tags').delete().eq('place_id', placeId)
  await supabase.from('place_images').delete().eq('place_id', placeId)
  await supabase.from('reviews').delete().eq('place_id', placeId)
  await supabase.from('saves').delete().eq('place_id', placeId)
  await supabase.from('places').delete().eq('id', placeId)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function moderatePlace(placeId: string, action: 'approved' | 'rejected') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')

  await supabase
    .from('places')
    .update({ status: action })
    .eq('id', placeId)

  await supabase.from('moderation_log').insert({
    place_id: placeId,
    reviewed_by: user.id,
    action,
  })

  revalidatePath('/admin')
  revalidatePath('/')
}
