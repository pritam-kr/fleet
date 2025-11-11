"use client"

import { useEffect, useState } from "react"
import type { Trip } from "../src/types"
import { sampleTrips } from "../src/data/trips"
import { MapView } from "../src/components/MapView"
import { TripCard } from "../src/components/TripCard"
import { FleetSummary } from "../src/components/FleetSummary"
import { PlaybackControls } from "../src/components/PlaybackControls"
import { useFleetSimulation } from "../src/hooks/useFleetSimulation"

const tripColors = {
  T1: "#ef4444",
  T2: "#3b82f6",
  T3: "#10b981",
  T4: "#f59e0b",
  T5: "#8b5cf6",
}

export default function Page() {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips)

  // Load trips from JSON files (mock implementation with sample data)
  useEffect(() => {
    // In a real app, you would fetch from /public/data/trip1.json, etc.
    // For now, we use the sample data
    setTrips(sampleTrips)
  }, [])

  const { simulation, togglePlayPause, setSpeed, reset } = useFleetSimulation(
    trips,
    trips.length > 0 ? trips[0].startTime : Date.now(),
  )

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <h1 className="text-3xl font-bold">Fleet Tracking Dashboard</h1>
        <p className="text-blue-100 mt-1">Real-time vehicle tracking and monitoring</p>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Map section */}
        <div className="flex-1 min-w-0">
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <MapView trips={trips} tripStates={simulation.trips} />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-80 overflow-y-auto space-y-4">
          {/* Playback Controls */}
          <PlaybackControls
            simulation={simulation}
            onPlayPause={togglePlayPause}
            onSpeedChange={setSpeed}
            onReset={reset}
          />

          {/* Fleet Summary */}
          <FleetSummary simulation={simulation} />

          {/* Trip Cards */}
          <div className="space-y-3">
            <h2 className="font-bold text-lg px-1">Trips</h2>
            {simulation.trips.map((trip) => (
              <TripCard key={trip.tripId} trip={trip} color={tripColors[trip.tripId as keyof typeof tripColors]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
