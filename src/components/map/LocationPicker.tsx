'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'

interface LocationPickerProps {
  initialLat?: number
  initialLng?: number
  onPick: (lat: number, lng: number) => void
}

const DEFAULT_LAT = 60.3913
const DEFAULT_LNG = 5.3221

export default function LocationPicker({ initialLat, initialLng, onPick }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Leaflet must be imported client-side only
    import('leaflet').then((L) => {
      // Fix default marker icons
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

      const map = L.map(containerRef.current!).setView(
        [initialLat ?? DEFAULT_LAT, initialLng ?? DEFAULT_LNG],
        13
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Place initial marker if coords provided
      if (initialLat && initialLng) {
        markerRef.current = L.marker([initialLat, initialLng], { icon, draggable: true }).addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng()
          const lat = parseFloat(pos.lat.toFixed(6))
          const lng = parseFloat(pos.lng.toFixed(6))
          setCoords({ lat, lng })
          onPick(lat, lng)
        })
      }

      map.on('click', (e: L.LeafletMouseEvent) => {
        const lat = parseFloat(e.latlng.lat.toFixed(6))
        const lng = parseFloat(e.latlng.lng.toFixed(6))

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current!.getLatLng()
            const lat = parseFloat(pos.lat.toFixed(6))
            const lng = parseFloat(pos.lng.toFixed(6))
            setCoords({ lat, lng })
            onPick(lat, lng)
          })
        }

        setCoords({ lat, lng })
        onPick(lat, lng)
      })

      mapRef.current = map
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-xl border border-gray-200 z-0" />
      {coords ? (
        <p className="text-xs text-gray-500">
          📍 {coords.lat}, {coords.lng} —{' '}
          <span className="text-gray-400">drag the pin to adjust</span>
        </p>
      ) : (
        <p className="text-xs text-gray-400">Click anywhere on the map to drop a pin</p>
      )}
    </div>
  )
}
