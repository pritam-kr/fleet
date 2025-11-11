import type { Trip, TripEvent, TripState } from "../types"

// Initialize trip states
export function initializeTripStates(trips: Trip[]): TripState[] {
  return trips.map((trip) => ({
    tripId: trip.tripId,
    currentEvent: null,
    progress: 0,
    status: "RUNNING" as const,
    alerts: [],
  }))
}

// Get current event for a trip based on simulation time
export function getCurrentEvent(trip: Trip, simulationTime: number): TripEvent | null {
  let lastEvent: TripEvent | null = null

  for (const event of trip.events) {
    if (event.timestamp <= simulationTime) {
      lastEvent = event
    } else {
      break
    }
  }

  return lastEvent
}

// Calculate progress for a trip
export function calculateProgress(trip: Trip, simulationTime: number): number {
  if (trip.events.length === 0) return 0

  const processedEvents = trip.events.filter((e) => e.timestamp <= simulationTime).length
  return Math.round((processedEvents / trip.events.length) * 100)
}

// Update trip state based on simulation time
export function updateTripState(trip: Trip, simulationTime: number): TripState {
  const currentEvent = getCurrentEvent(trip, simulationTime)
  const progress = calculateProgress(trip, simulationTime)

  let status: "RUNNING" | "COMPLETED" | "CANCELLED" = "RUNNING"
  const alerts: string[] = []

  if (currentEvent) {
    if (currentEvent.eventType === "CANCELLED") {
      status = "CANCELLED"
    } else if (currentEvent.eventType === "FUEL_LOW") {
      alerts.push("Fuel Low Warning")
    }
  }

  // Check if trip is completed
  if (simulationTime >= trip.endTime && progress === 100) {
    status = "COMPLETED"
  }

  return {
    tripId: trip.tripId,
    currentEvent,
    progress,
    status,
    alerts,
  }
}

// Calculate total progress across all trips
export function calculateFleetProgress(trips: TripState[]): {
  completed: number
  running: number
  cancelled: number
} {
  return trips.reduce(
    (acc, trip) => {
      if (trip.status === "COMPLETED") acc.completed++
      else if (trip.status === "RUNNING") acc.running++
      else if (trip.status === "CANCELLED") acc.cancelled++
      return acc
    },
    { completed: 0, running: 0, cancelled: 0 },
  )
}
