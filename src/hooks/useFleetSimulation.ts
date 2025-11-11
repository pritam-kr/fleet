"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Trip, SimulationState } from "../types"
import { initializeTripStates, updateTripState } from "../utils/simulation"

export function useFleetSimulation(trips: Trip[], startTime: number) {
  const [simulation, setSimulation] = useState<SimulationState>({
    isPlaying: false,
    simulationTime: startTime,
    speed: 1,
    trips: initializeTripStates(trips),
  })

  const animationFrameRef = useRef<number>()
  const lastTimeRef = useRef<number>(Date.now())

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    setSimulation((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
    lastTimeRef.current = Date.now()
  }, [])

  // Handle speed change
  const setSpeed = useCallback((speed: 1 | 5 | 10) => {
    setSimulation((prev) => ({
      ...prev,
      speed,
    }))
  }, [])

  // Handle reset
  const reset = useCallback(() => {
    setSimulation((prev) => ({
      ...prev,
      isPlaying: false,
      simulationTime: startTime,
      trips: initializeTripStates(trips),
    }))
  }, [trips, startTime])

  // Update simulation time
  const updateSimulation = useCallback(() => {
    const now = Date.now()
    const deltaTime = (now - lastTimeRef.current) / 1000 // Convert to seconds
    lastTimeRef.current = now

    setSimulation((prev) => {
      const maxEndTime = Math.max(...trips.map((t) => t.endTime))
      let newSimulationTime = prev.simulationTime + deltaTime * 1000 * prev.speed // Convert back to ms

      // Cap at max time
      if (newSimulationTime >= maxEndTime) {
        newSimulationTime = maxEndTime
        // Auto-pause at end
        return {
          ...prev,
          isPlaying: false,
          simulationTime: newSimulationTime,
          trips: prev.trips.map((trip) => {
            const tripData = trips.find((t) => t.tripId === trip.tripId)
            return tripData ? updateTripState(tripData, newSimulationTime) : trip
          }),
        }
      }

      return {
        ...prev,
        simulationTime: newSimulationTime,
        trips: prev.trips.map((trip) => {
          const tripData = trips.find((t) => t.tripId === trip.tripId)
          return tripData ? updateTripState(tripData, newSimulationTime) : trip
        }),
      }
    })

    if (simulation.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateSimulation)
    }
  }, [trips, simulation.isPlaying])

  // Animation loop
  useEffect(() => {
    if (simulation.isPlaying) {
      lastTimeRef.current = Date.now()
      animationFrameRef.current = requestAnimationFrame(updateSimulation)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [simulation.isPlaying, updateSimulation])

  return {
    simulation,
    togglePlayPause,
    setSpeed,
    reset,
  }
}
