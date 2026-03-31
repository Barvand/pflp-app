'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  lat: number
  lng: number
  title: string
}

export default function MapView({ lat, lng, title }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      const icon = L.divIcon({
        html: `<div style="
          width:24px;height:24px;
          background:#2563eb;
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        className: '',
      })

      const map = L.map(containerRef.current!, { zoomControl: true, scrollWheelZoom: false })
        .setView([lat, lng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      L.marker([lat, lng], { icon })
        .bindPopup(title)
        .addTo(map)

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [lat, lng, title])

  return (
    <div ref={containerRef} className="h-52 w-full overflow-hidden rounded-xl border border-gray-200 z-0" />
  )
}
