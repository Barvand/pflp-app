'use server'

import { createClient } from '@/lib/supabase/server'

export async function ensureProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const emailPrefix = user.email?.split('@')[0] ?? 'User'

  const { data: profile } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          emailPrefix,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: 'contributor',
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
    .select()
    .single()

  return profile
}
