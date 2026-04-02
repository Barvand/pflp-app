'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BrandButton } from '@/components/ui/Button'

export default function MagicLinkForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl bg-blue-50 px-5 py-6 text-center">
        <div className="mb-2 text-3xl">📬</div>
        <h2 className="font-semibold text-gray-900">Sjekk e-posten din</h2>
        <p className="mt-1 text-sm text-gray-500">
          Vi sendte en innloggingslenke til <span className="font-medium text-gray-700">{email}</span>.
          Klikk pa den for a fortsette, ingen passord nodvendig.
        </p>
        <button
          onClick={() => {
            setStatus('idle')
            setEmail('')
          }}
          className="mt-4 text-xs text-[var(--brand)] hover:underline"
        >
          Bruk en annen e-post
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
          E-post
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{errorMsg}</p>
      )}

      <BrandButton type="submit" disabled={status === 'loading'} fullWidth className="rounded-lg">
        {status === 'loading' ? 'Sender...' : 'Send magisk lenke'}
      </BrandButton>
    </form>
  )
}
