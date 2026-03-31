import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/auth/OnboardingForm'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  // Already has a real name set — skip onboarding
  const emailPrefix = user.email ? user.email.split('@')[0] : ''
  const hasRealName = profile?.display_name && profile.display_name !== emailPrefix
  if (hasRealName) redirect('/')

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mb-3 text-4xl">👋</div>
          <h1 className="text-xl font-bold text-gray-900">Velkommen til KidSpots!</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bare én ting før du starter – hva skal vi kalle deg?
          </p>
        </div>

        <OnboardingForm
          userId={user.id}
          defaultName={profile?.display_name ?? emailPrefix}
        />
      </div>
    </main>
  )
}
