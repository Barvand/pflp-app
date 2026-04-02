'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BrandButton } from '@/components/ui/Button'

export default function PasswordLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setStatus('error')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="pw-email">
          E-post
        </label>
        <input
          id="pw-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700" htmlFor="pw-password">
            Passord
          </label>
          <a href="/forgot-password" className="text-xs text-[var(--accent)] hover:underline">
            Glemt passordet?
          </a>
        </div>
        <input
          id="pw-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <BrandButton type="submit" disabled={status === 'loading'} fullWidth className="rounded-lg">
        {status === 'loading' ? 'Logger inn...' : 'Logg inn'}
      </BrandButton>
    </form>
  )
}
