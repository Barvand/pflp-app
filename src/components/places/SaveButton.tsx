'use client'

import { useTransition } from 'react'
import { toggleSave } from '@/lib/actions/saves'

export default function SaveButton({ placeId, saved }: { placeId: string; saved: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => toggleSave(placeId, saved))}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        saved
          ? 'border-[color:rgba(231,111,81,0.24)] bg-[color:rgba(231,111,81,0.12)] text-[var(--accent)] hover:bg-[color:rgba(231,111,81,0.18)]'
          : 'border-[color:rgba(47,111,94,0.18)] bg-white text-[var(--brand)] hover:bg-[color:rgba(47,111,94,0.06)]'
      }`}
    >
      <span>{saved ? '🔖' : '🏷️'}</span>
      {saved ? 'Lagret' : 'Lagre'}
    </button>
  )
}
