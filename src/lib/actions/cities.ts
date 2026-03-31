'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')
  return supabase
}

export async function addCity(formData: FormData) {
  const supabase = await requireAdmin()

  const { error } = await supabase.from('cities').insert({
    name: formData.get('name') as string,
    country_code: (formData.get('country_code') as string).toUpperCase().slice(0, 2),
    lat: parseFloat(formData.get('lat') as string),
    lng: parseFloat(formData.get('lng') as string),
    is_active: formData.get('is_active') === 'on',
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/cities')
}

export async function toggleCityActive(cityId: string, isActive: boolean) {
  const supabase = await requireAdmin()

  await supabase
    .from('cities')
    .update({ is_active: !isActive })
    .eq('id', cityId)

  revalidatePath('/admin/cities')
  revalidatePath('/submit')
}
