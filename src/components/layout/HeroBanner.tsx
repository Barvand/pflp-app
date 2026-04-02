import { AccentButton, BrandButton } from '@/components/ui/Button'

type HeroBannerProps = {
  cityName?: string
  placeCount: number
}

export default function HeroBanner({ cityName, placeCount }: HeroBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#f7f3ed_0%,#f5f1ea_44%,#edf4ef_100%)]">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-35 blur-[2px] saturate-[0.7] contrast-[0.82]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://cdn.pixabay.com/photo/2024/06/01/20/07/children-8802431_1280.jpg"
          aria-hidden="true"
        >
          <source
            src="https://cdn.pixabay.com/video/2024/06/01/214776_large.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(245,241,234,0.96)_0%,rgba(245,241,234,0.9)_32%,rgba(245,241,234,0.62)_56%,rgba(231,239,234,0.9)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(231,111,81,0.16),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(47,111,94,0.14),transparent_22%),radial-gradient(circle_at_52%_88%,rgba(255,255,255,0.45),transparent_26%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.46),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
          <div className="animate-fade-up-soft">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand)] shadow-[0_10px_30px_rgba(47,111,94,0.08)] backdrop-blur-md">
              Anbefalt av lokale familier
            </div>

            <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[0.96] font-medium tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl lg:text-[4.8rem]">
              Finn skjulte,
              <span className="block">barnevennlige steder</span>
              <span className="mt-2 block text-[var(--accent)]">
                som lokale foreldre allerede elsker
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[color:rgba(26,26,26,0.72)] sm:text-lg">
              Oppdag sma turer, rolige parker og naturnaere favoritter for barn
              i Bergen. KidSpots samler varme, lokale anbefalinger som gjor det
              lettere a finne noe fint
              {cityName ? ` i ${cityName}` : " i byen"}, selv nar du bare vil ut
              en liten stund.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <BrandButton href="#places" className="min-h-12 px-6">
                Utforsk steder
              </BrandButton>
              <AccentButton href="/submit" className="min-h-12 px-6">
                Del et tips
              </AccentButton>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-[color:rgba(26,26,26,0.68)]">
              <div className="rounded-full border border-white/70 bg-white/55 px-4 py-2 backdrop-blur-sm">
                {placeCount}+ steder delt av lokalkjente foreldre
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <div>Rolig, nyttig og laget for ekte familiedager</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
