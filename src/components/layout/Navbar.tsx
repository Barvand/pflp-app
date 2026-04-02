import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from '@/components/auth/UserMenu'
import { AccentButton, BrandButton } from '@/components/ui/Button'

export default async function Navbar() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from('profiles')
        .select('display_name, avatar_url, role')
        .eq('id', user.id)
        .single()
    : { data: null }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="text-xl">📍</span>
          <span>KidSpots Bergen</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Steder
          </Link>

          {user && (
            <AccentButton href="/submit" className="min-h-9 rounded-md px-3 py-1.5">
              + Legg til sted
            </AccentButton>
          )}

          {user ? (
            <UserMenu
              displayName={profile?.display_name ?? user.user_metadata?.full_name ?? null}
              avatarUrl={profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null}
              role={profile?.role ?? 'contributor'}
            />
          ) : (
            <BrandButton href="/login" className="min-h-9 rounded-md px-3 py-1.5">
              Logg inn
            </BrandButton>
          )}
        </nav>
      </div>
    </header>
  )
}
