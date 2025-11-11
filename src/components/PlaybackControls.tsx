"use client"

import type { SimulationState } from "../types"

interface PlaybackControlsProps {
  simulation: SimulationState
  onPlayPause: () => void
  onSpeedChange: (speed: 1 | 5 | 10) => void
  onReset: () => void
}

export function PlaybackControls({ simulation, onPlayPause, onSpeedChange, onReset }: PlaybackControlsProps) {
  const calculateTimelinePercent = () => {
    const maxTime = Math.max(...simulation.trips.map((t) => t.currentEvent?.timestamp || 0))
    if (maxTime === 0) return 0
    return (simulation.simulationTime / maxTime) * 100
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm space-y-4">
      <h2 className="font-bold text-lg">Playback Controls</h2>

      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Timeline</span>
          <span>{calculateTimelinePercent().toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all"
            style={{ width: `${calculateTimelinePercent()}%` }}
          />
        </div>
      </div>

      {/* Play/Pause buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPlayPause}
          className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
            simulation.isPlaying
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {simulation.isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors"
        >
          ↻ Reset
        </button>
      </div>

      {/* Speed control */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Speed: {simulation.speed}x</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 5, 10].map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed as 1 | 5 | 10)}
              className={`py-2 rounded-lg font-semibold transition-colors ${
                simulation.speed === speed ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
