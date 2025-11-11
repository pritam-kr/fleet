# Fleet Tracking Dashboard

A real-time fleet tracking dashboard built with React, Vite, Leaflet, and TailwindCSS.

## Features

- **Real-time Vehicle Tracking**: Visualize 5 vehicles on an interactive Leaflet map
- **Playback Controls**: Play, pause, and adjust simulation speed (1x, 5x, 10x)
- **Trip Progress Tracking**: Monitor individual trip progress with real-time updates
- **Event Handling**: Track vehicle events (MOVING, STOPPED, CANCELLED, FUEL_LOW)
- **Fleet Summary**: Overview of all trips (completed, running, cancelled)
- **Performance Optimized**: Handles up to 10,000 events with throttled updates

## Installation

\`\`\`bash
npm install
\`\`\`

## Running Locally

\`\`\`bash
npm run dev
\`\`\`

The app will open at `http://localhost:5173`

## Project Structure

\`\`\`
src/
├── components/
│   ├── MapView.tsx         # Leaflet map with vehicle markers
│   ├── TripCard.tsx        # Individual trip status card
│   ├── FleetSummary.tsx    # Fleet-wide statistics
│   └── PlaybackControls.tsx # Simulation controls
├── hooks/
│   └── useFleetSimulation.ts # Main simulation logic
├── data/
│   └── trips.ts            # Sample trip data
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── simulation.ts       # Simulation utilities
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
\`\`\`

## How to Add Your Own Data

1. Create JSON files in `public/data/` (trip1.json, trip2.json, etc.)
2. Each file should contain an array of trip events:

\`\`\`json
{
  "tripId": "T1",
  "events": [
    {
      "tripId": "T1",
      "timestamp": 1699101600000,
      "lat": 37.7749,
      "lng": -122.4194,
      "speed": 50,
      "eventType": "MOVING"
    }
  ]
}
\`\`\`

3. Update `src/data/trips.ts` to load from the JSON files using `fetch()`

## Event Types

- **MOVING**: Vehicle is in motion
- **STOPPED**: Vehicle has stopped
- **CANCELLED**: Trip has been cancelled
- **FUEL_LOW**: Low fuel warning

## Building for Production

\`\`\`bash
npm run build
\`\`\`

Output will be in the `dist/` folder.

## Deployment

### Vercel

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Netlify

\`\`\`bash
npm i -g netlify-cli
netlify deploy --prod --dir dist
\`\`\`

## Technologies Used

- **React 18**: UI framework
- **Vite**: Fast build tool and dev server
- **Leaflet**: Interactive maps
- **TailwindCSS**: Styling
- **TypeScript**: Type safety

## Performance Notes

- Markers are created once and updated efficiently
- Polylines are rendered with throttled updates
- Simulation runs at 60fps using `requestAnimationFrame`
- Memory optimized for handling 10,000+ events
# fleet
