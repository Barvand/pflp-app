'use client'

import { useRef, useState, useTransition } from 'react'
import { submitReview } from '@/lib/actions/reviews'

export default function ReviewForm({ placeId, existingRating }: { placeId: string; existingRating?: number | null }) {
  const [rating, setRating] = useState(existingRating ?? 0)
  const [hovered, setHovered] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.set('rating', String(rating))

    startTransition(async () => {
      await submitReview(placeId, formData)
      setDone(true)
      formRef.current?.reset()
    })
  }

  if (done) {
    return (
      <div className="rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700">
        ✅ Anmeldelse sendt – takk!
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Skriv en anmeldelse</h3>

      {/* Star rating */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Vurdering</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl leading-none transition-transform hover:scale-110"
            >
              <span className={(hovered || rating) >= star ? 'text-amber-400' : 'text-gray-200'}>★</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="review-body">
          Kommentar <span className="text-gray-400 font-normal">(valgfritt)</span>
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={3}
          placeholder="Hva synes du om dette stedet?"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Stroller confirmed */}
      <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" name="stroller_confirmed" className="rounded" />
        Jeg kan bekrefte at dette er barnevognvennlig 🍼
      </label>

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? 'Sender inn…' : 'Send anmeldelse'}
      </button>
    </form>
  )
}
