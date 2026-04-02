import type { Metadata } from 'next'
import { Manrope, Newsreader } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  title: 'KidSpots Bergen',
  description: 'Oppdag familievennlige steder i Bergen, Norge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no" className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)]">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
