import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Where to send the user after sign-in (defaults to homepage)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const emailPrefix = data.user.email?.split('@')[0] ?? ''

      // Ensure profile row exists (covers users who signed up before the trigger was added)
      const { data: profile } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            display_name:
              data.user.user_metadata?.full_name ??
              data.user.user_metadata?.name ??
              emailPrefix,
            avatar_url: data.user.user_metadata?.avatar_url ?? null,
            role: 'contributor',
          },
          { onConflict: 'id', ignoreDuplicates: true }
        )
        .select('display_name')
        .single()

      const needsOnboarding = !profile?.display_name || profile.display_name === emailPrefix
      return NextResponse.redirect(`${origin}${needsOnboarding ? '/onboarding' : next}`)
    }
  }

  // Something went wrong — send to an error page or back to login
  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
