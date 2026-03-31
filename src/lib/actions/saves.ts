'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function toggleSave(placeId: string, currentlySaved: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  if (currentlySaved) {
    await supabase
      .from('saves')
      .delete()
      .eq('user_id', user.id)
      .eq('place_id', placeId)
  } else {
    await supabase
      .from('saves')
      .insert({ user_id: user.id, place_id: placeId })
  }

  revalidatePath(`/place/${placeId}`)
}
