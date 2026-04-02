'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BrandButton } from '@/components/ui/Button'

export default function OnboardingForm({ userId, defaultName }: { userId: string; defaultName: string }) {
  const [name, setName] = useState(defaultName)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setStatus('loading')

    const { error } = await supabase.from('profiles').update({ display_name: name.trim() }).eq('id', userId)

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
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">
          Ditt navn
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Anna"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
        />
        <p className="mt-1 text-xs text-gray-400">Dette er det andre brukere vil se.</p>
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
      )}

      <BrandButton
        type="submit"
        disabled={status === 'loading' || !name.trim()}
        fullWidth
        className="rounded-lg"
      >
        {status === 'loading' ? 'Lagrer...' : 'Fortsett'}
      </BrandButton>
    </form>
  )
}
