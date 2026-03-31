'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitReview(placeId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const rating = formData.get('rating') ? parseInt(formData.get('rating') as string) : null
  const body = (formData.get('body') as string).trim() || null
  const stroller_confirmed = formData.get('stroller_confirmed') === 'on'

  const { error } = await supabase.from('reviews').upsert(
    {
      place_id: placeId,
      user_id: user.id,
      body,
      rating,
      stroller_confirmed,
    },
    { onConflict: 'place_id,user_id' }
  )

  if (error) throw new Error(error.message)

  revalidatePath(`/place/${placeId}`)
}
