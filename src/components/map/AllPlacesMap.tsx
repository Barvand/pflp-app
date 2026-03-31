'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

export interface PlacePin {
  id: string
  lat: number
  lng: number
  title: string
}

interface AllPlacesMapProps {
  places: PlacePin[]
  userLocation?: { lat: number; lng: number } | null
  radiusKm?: number
}

export default function AllPlacesMap({ places, userLocation, radiusKm = 2 }: AllPlacesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const userLayerRef = useRef<import('leaflet').Layer[]>([])

  // Initialise the map once on mount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      }).setView([60.3913, 5.3221], 12)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const placeIcon = L.divIcon({
        html: `<div style="
          width:22px;height:22px;
          background:#f43f5e;
          border:2.5px solid white;
          border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          cursor:pointer;
        "></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        className: '',
      })

      places.forEach((place) => {
        L.marker([place.lat, place.lng], { icon: placeIcon })
          .bindPopup(
            `<div style="min-width:150px">` +
              `<strong style="display:block;margin-bottom:4px">${place.title}</strong>` +
              `<a href="/place/${place.id}" style="color:#2563eb;font-size:13px;text-decoration:underline">Gå til sted →</a>` +
              `</div>`,
          )
          .addTo(map)
      })

      if (places.length === 1) {
        map.setView([places[0].lat, places[0].lng], 15)
      } else if (places.length > 1) {
        const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }

      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update the user-location layer whenever userLocation changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    import('leaflet').then((L) => {
      userLayerRef.current.forEach((layer) => map.removeLayer(layer))
      userLayerRef.current = []

      if (!userLocation) return

      const userIcon = L.divIcon({
        html: `<div style="
          width:18px;height:18px;
          background:#2563eb;
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 0 6px rgba(37,99,235,0.2);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        className: '',
      })

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup('<strong>Du er her</strong>')
        .addTo(map)

      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: radiusKm * 1000,
        color: '#2563eb',
        fillColor: '#2563eb',
        fillOpacity: 0.07,
        weight: 2,
        dashArray: '6 4',
      }).addTo(map)

      userLayerRef.current = [marker, circle]
      map.setView([userLocation.lat, userLocation.lng], 14)
    })
  }, [userLocation, radiusKm])

  return <div ref={containerRef} className="h-full w-full" />
}
