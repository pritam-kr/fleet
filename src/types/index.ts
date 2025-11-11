// Trip event data structure
export interface TripEvent {
  tripId: string
  timestamp: number
  lat: number
  lng: number
  speed: number
  eventType: "MOVING" | "STOPPED" | "CANCELLED" | "FUEL_LOW"
}

// Trip data with all events
export interface Trip {
  tripId: string
  events: TripEvent[]
  startTime: number
  endTime: number
}

// Current trip state
export interface TripState {
  tripId: string
  currentEvent: TripEvent | null
  progress: number // 0-100
  status: "RUNNING" | "COMPLETED" | "CANCELLED"
  alerts: string[]
}

// Simulation state
export interface SimulationState {
  isPlaying: boolean
  simulationTime: number
  speed: 1 | 5 | 10
  trips: TripState[]
}
