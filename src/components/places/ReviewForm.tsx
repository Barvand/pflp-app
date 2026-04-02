'use client'

import { useRef, useState, useTransition } from 'react'
import { submitReview } from '@/lib/actions/reviews'
import { BrandButton } from '@/components/ui/Button'

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
    return <div className="rounded-xl bg-green-50 px-5 py-4 text-sm text-green-700">Anmeldelse sendt, takk.</div>
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-4 font-semibold text-gray-900">Skriv en anmeldelse</h3>

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

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="review-body">
          Kommentar <span className="font-normal text-gray-400">(valgfritt)</span>
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={3}
          placeholder="Hva synes du om dette stedet?"
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]"
        />
      </div>

      <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" name="stroller_confirmed" className="rounded" />
        Jeg kan bekrefte at dette er barnevognvennlig
      </label>

      <BrandButton type="submit" disabled={isPending || rating === 0} fullWidth className="rounded-lg">
        {isPending ? 'Sender inn...' : 'Send anmeldelse'}
      </BrandButton>
    </form>
  )
}
