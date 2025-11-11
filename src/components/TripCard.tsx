import type { TripState } from "../types"

interface TripCardProps {
  trip: TripState
  color: string
}

export function TripCard({ trip, color }: TripCardProps) {
  const getStatusBadge = () => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold text-white"

    switch (trip.status) {
      case "COMPLETED":
        return <span className={`${baseClasses} bg-green-500`}>Completed</span>
      case "CANCELLED":
        return <span className={`${baseClasses} bg-red-500`}>Cancelled</span>
      default:
        return <span className={`${baseClasses} bg-blue-500`}>Running</span>
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-bold text-lg">{trip.tripId}</h3>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold">{trip.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-200"
            style={{
              width: `${trip.progress}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Current event info */}
      {trip.currentEvent && (
        <div className="mb-3 text-sm">
          <p className="text-gray-600">
            Speed: <span className="font-semibold">{trip.currentEvent.speed} km/h</span>
          </p>
          <p className="text-gray-600">
            Status: <span className="font-semibold">{trip.currentEvent.eventType}</span>
          </p>
        </div>
      )}

      {/* Alerts */}
      {trip.alerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
          {trip.alerts.map((alert, idx) => (
            <p key={idx} className="text-xs text-yellow-800">
              ⚠️ {alert}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
