import type { SimulationState } from "../types"
import { calculateFleetProgress } from "../utils/simulation"

interface FleetSummaryProps {
  simulation: SimulationState
}

export function FleetSummary({ simulation }: FleetSummaryProps) {
  const stats = calculateFleetProgress(simulation.trips)
  const totalTrips = simulation.trips.length

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-4">
      <h2 className="font-bold text-lg mb-3">Fleet Summary</h2>

      <div className="grid grid-cols-3 gap-3">
        {/* Completed */}
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-1">{totalTrips} total</p>
        </div>

        {/* Running */}
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Running</p>
          <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
          <p className="text-xs text-gray-500 mt-1">{totalTrips} total</p>
        </div>

        {/* Cancelled */}
        <div className="bg-red-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          <p className="text-xs text-gray-500 mt-1">{totalTrips} total</p>
        </div>
      </div>

      {/* Simulation time */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">Simulation Time</p>
        <p className="text-lg font-mono font-bold">{new Date(simulation.simulationTime).toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
