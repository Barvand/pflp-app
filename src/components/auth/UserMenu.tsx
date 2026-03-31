'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface UserMenuProps {
  displayName: string | null
  avatarUrl: string | null
  role: string
}

export default function UserMenu({ displayName, avatarUrl, role }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const initials = displayName
    ? displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 hover:bg-gray-100 transition-colors"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-white">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName ?? 'avatar'} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </span>

        {/* Name */}
        <span className="hidden text-sm font-medium text-gray-800 sm:block max-w-[120px] truncate">
          {displayName ?? 'Du'}
        </span>

        {/* Chevron */}
        <svg
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5">
          {/* User info header */}
          <div className="border-b border-gray-100 px-4 py-2.5">
            <p className="truncate text-sm font-semibold text-gray-900">{displayName ?? 'Anonym'}</p>
            <p className="text-xs text-gray-400 capitalize">{role}</p>
          </div>

          <div className="py-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>🗺️</span> Steder
            </Link>

            {role === 'admin' && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>🛡️</span> Modereringskø
                </Link>
                <Link
                  href="/admin/cities"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>🌍</span> Administrer byer
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={signOut}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <span>↩️</span> Logg ut
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
