import Link from 'next/link'

export default function HeroBanner({ cityName, placeCount }: { cityName?: string; placeCount: number }) {
  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 45%, #fbbf24 100%)' }}
    >
      {/* Colourful blurred orbs */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-yellow-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 right-0 h-[28rem] w-[28rem] rounded-full bg-sky-400 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500 opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-16 h-64 w-64 rounded-full bg-teal-400 opacity-30 blur-3xl" />

      {/* Floating family / nature icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: '12%', left: '6%',  size: 'text-3xl', delay: '0s',   duration: '6s',   icon: '🌳' },
          { top: '65%', left: '4%',  size: 'text-2xl', delay: '1s',   duration: '7s',   icon: '⛺' },
          { top: '20%', right: '8%', size: 'text-4xl', delay: '2s',   duration: '5s',   icon: '🎡' },
          { top: '72%', right: '6%', size: 'text-2xl', delay: '0.5s', duration: '8s',   icon: '🌻' },
          { top: '42%', left: '12%', size: 'text-xl',  delay: '1.5s', duration: '6s',   icon: '🎪' },
          { top: '82%', left: '38%', size: 'text-3xl', delay: '3s',   duration: '7s',   icon: '🌈' },
          { top: '8%',  left: '52%', size: 'text-2xl', delay: '2.5s', duration: '5.5s', icon: '🦋' },
        ].map((item, i) => (
          <div
            key={i}
            className={`absolute ${item.size} opacity-40`}
            style={{
              top: item.top,
              left: 'left' in item ? item.left : undefined,
              right: 'right' in item ? (item as { right: string }).right : undefined,
              animation: `float ${item.duration} ease-in-out ${item.delay} infinite`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">

        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          {cityName ? `Utforsker ${cityName}` : 'Familieventyr venter'}
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-5xl font-black leading-tight tracking-tight drop-shadow-sm sm:text-6xl lg:text-7xl">
          De beste stedene{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-yellow-100">
              for dine barn
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full bg-white/50" />
          </span>
          {cityName && (
            <span className="mt-2 block text-4xl font-bold text-white/80"> i {cityName}</span>
          )}
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/85">
          Steder anbefalt av fellesskapet for familier – lekeplasser, naturstier, regnværsdagstilbud og mer. Alt vurdert av foreldre som deg.
        </p>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          {[
            { value: placeCount.toString(), label: 'steder listet' },
            { value: '100%', label: 'gratis å bruke' },
            { value: '★ 5.0', label: 'fellesskapsvurdert' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl border border-white/25 bg-white/15 px-6 py-3 backdrop-blur-sm"
            >
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <span className="mt-0.5 text-white/75">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#places"
            className="rounded-full bg-white px-8 py-3 text-sm font-bold text-orange-500 shadow-xl shadow-orange-900/20 transition hover:scale-105 hover:shadow-orange-900/30 active:scale-100"
          >
            Utforsk steder →
          </a>
          <Link
            href="/submit"
            className="rounded-full border-2 border-white/50 bg-white/15 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            Legg til et sted
          </Link>
        </div>
      </div>

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-12px) rotate(5deg); }
          66%       { transform: translateY(-6px) rotate(-3deg); }
        }
      `}</style>
    </div>
  )
}
