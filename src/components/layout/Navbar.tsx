import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from '@/components/auth/UserMenu'

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
            <Link
              href="/submit"
              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              + Legg til sted
            </Link>
          )}

          {user ? (
            <UserMenu
              displayName={profile?.display_name ?? user.user_metadata?.full_name ?? null}
              avatarUrl={profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null}
              role={profile?.role ?? 'contributor'}
            />
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 transition-colors"
            >
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
