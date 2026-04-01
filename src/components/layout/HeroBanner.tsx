import Link from 'next/link'

type HeroBannerProps = {
  cityName?: string
  placeCount: number
}

const quickPoints = [
  'Skjulte og rolige steder anbefalt av lokale foreldre',
  'Filtrer pa barnevogn, biltilgang, regnvaersdag og mer',
  'Legg til dine egne favoritter for andre familier',
]

const steps = [
  {
    title: 'Finn et sted',
    body: 'Se steder andre foreldre faktisk bruker nar de vil ha en enkel tur med barn.',
  },
  {
    title: 'Sjekk om det passer',
    body: 'Bruk filtre for avstand, vogn, toalett, ly og andre praktiske behov.',
  },
  {
    title: 'Del videre',
    body: 'Har du et lokalt sted som flere burde vite om? Send det inn i appen.',
  },
]

export default function HeroBanner({ cityName, placeCount }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(180deg,_#fff7ed_0%,_#fffbeb_44%,_#f8fafc_100%)]">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-14 h-28 w-28 rounded-full bg-amber-200/60 blur-3xl" />
        <div className="absolute right-[12%] top-8 h-36 w-36 rounded-full bg-sky-200/70 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-32 w-32 rounded-full bg-emerald-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 sm:pb-14 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-stone-300 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur">
              Lokale tips for familier
            </div>

            <h1 className="mt-6 max-w-4xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Finn skjulte, barnevennlige steder
              <span className="block text-amber-700">som lokale foreldre allerede elsker.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
              Denne appen samler sma, fine steder for barn som ofte ikke dukker opp i vanlige guider:
              korte turer, rolige naturplasser, lekestopp og enkle utflukter naer deg
              {cityName ? ` i ${cityName}` : ''}.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#places"
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Se steder
              </a>
              <Link
                href="/submit"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
              >
                Del et lokalt tips
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {quickPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/80 bg-white/75 p-4 text-sm leading-6 text-stone-700 shadow-sm backdrop-blur"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-[0_20px_80px_-40px_rgba(120,53,15,0.45)] backdrop-blur">
            <div className="rounded-3xl bg-stone-900 p-5 text-stone-50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-300">Hva du far</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-3xl font-semibold text-amber-300">{placeCount}</p>
                  <p className="mt-1 text-sm text-stone-200">godkjente steder delt av fellesskapet</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-sky-300">3 steg</p>
                  <p className="mt-1 text-sm text-stone-200">finn, sjekk, del</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    0{index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-stone-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{step.body}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
