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
          ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span>{saved ? '🔖' : '🏷️'}</span>
      {saved ? 'Lagret' : 'Lagre'}
    </button>
  )
}
