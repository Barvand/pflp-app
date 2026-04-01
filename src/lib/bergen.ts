export const BERGEN_BYDELER = [
  'Arna',
  'Bergenhus',
  'Fana',
  'Fyllingsdalen',
  'Laksevåg',
  'Ytrebygda',
  'Årstad',
  'Åsane',
] as const

export type BergenBydel = (typeof BERGEN_BYDELER)[number]

export function isBergenCity(cityName?: string | null) {
  return cityName?.trim().toLowerCase() === 'bergen'
}
