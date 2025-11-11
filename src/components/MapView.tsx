"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import type { Trip, TripState } from "../types"

interface MapViewProps {
  trips: Trip[]
  tripStates: TripState[]
}

// Helper function to smoothly animate marker movement
function animateMarker(marker: L.Marker, targetLat: number, targetLng: number, duration: number = 500) {
  const startLat = marker.getLatLng().lat
  const startLng = marker.getLatLng().lng
  const startTime = Date.now()

  function animate() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeInOutQuad = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

    const currentLat = startLat + (targetLat - startLat) * easeInOutQuad
    const currentLng = startLng + (targetLng - startLng) * easeInOutQuad

    marker.setLatLng([currentLat, currentLng])

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

export function MapView({ trips, tripStates }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const polyinesRef = useRef<Map<string, L.Polyline>>(new Map())
  const previousPositionsRef = useRef<Map<string, { lat: number; lng: number }>>(new Map())

  // Color mapping for trips
  const tripColors = {
    T1: "#ef4444",
    T2: "#3b82f6",
    T3: "#10b981",
    T4: "#f59e0b",
    T5: "#8b5cf6",
  }

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return

    const map = L.map("map").setView([39.8283, -98.5795], 4)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
  }, [])

  // Update markers and polylines
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Update each trip's marker and route
    tripStates.forEach((state) => {
      const trip = trips.find((t) => t.tripId === state.tripId)
      if (!trip || !state.currentEvent) return

      // Update or create marker
      let marker = markersRef.current.get(state.tripId)
      const color = tripColors[state.tripId as keyof typeof tripColors]

      if (!marker) {
        // Create custom marker icon
        const html = `
          <div class="fleet-marker ${state.tripId}" style="background-color: ${color}">
            ${state.tripId.slice(1)}
          </div>
        `

        marker = L.marker([state.currentEvent.lat, state.currentEvent.lng], {
          icon: L.divIcon({
            html,
            className: "custom-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
          }),
        }).addTo(map)

        markersRef.current.set(state.tripId, marker)
        previousPositionsRef.current.set(state.tripId, {
          lat: state.currentEvent.lat,
          lng: state.currentEvent.lng,
        })
      } else {
        const previousPos = previousPositionsRef.current.get(state.tripId)
        const newPos = { lat: state.currentEvent.lat, lng: state.currentEvent.lng }
        
        // Check if position actually changed
        if (!previousPos || previousPos.lat !== newPos.lat || previousPos.lng !== newPos.lng) {
          if (previousPos) {
            // Animate marker movement smoothly
            animateMarker(marker, newPos.lat, newPos.lng, 300)
          } else {
            // First update - set position immediately
            marker.setLatLng([newPos.lat, newPos.lng])
          }
          previousPositionsRef.current.set(state.tripId, newPos)
        }
      }

      // Update popup
      marker.bindPopup(`
        <div class="text-sm">
          <p class="font-bold">${state.tripId}</p>
          <p>Speed: ${state.currentEvent.speed} km/h</p>
          <p>Progress: ${state.progress}%</p>
          <p>Status: ${state.status}</p>
        </div>
      `)

      // Draw route polyline
      const routeEvents = trip.events.filter((e) => e.timestamp <= (state.currentEvent?.timestamp || 0))

      if (routeEvents.length > 1) {
        let polyline = polyinesRef.current.get(state.tripId)
        const latlngs = routeEvents.map((e) => [e.lat, e.lng] as [number, number])

        if (!polyline) {
          polyline = L.polyline(latlngs, {
            color,
            weight: 2,
            opacity: 0.6,
            className: `route-line ${state.tripId}`,
          }).addTo(map)
          polyinesRef.current.set(state.tripId, polyline)
        } else {
          polyline.setLatLngs(latlngs)
        }
      }
    })
  }, [tripStates, trips])

  return <div id="map" className="w-full h-full rounded-lg overflow-hidden" />
}
