import { useState, useEffect } from 'react'

export interface Earthquake {
  id: string
  magnitude: number
  place: string
  time: number
  url: string
  depth: number
  lat: number
  lon: number
}

interface UsgsFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    url: string
  }
  geometry: {
    coordinates: [number, number, number]
  }
}

interface UsgsResponse {
  features: UsgsFeature[]
}

interface EarthquakeState {
  loading: boolean
  error: string | null
  earthquakes: Earthquake[]
}

export const useEarthquakes = (): EarthquakeState => {
  const [state, setState] = useState<EarthquakeState>({
    loading: true,
    error: null,
    earthquakes: [],
  })

  useEffect(() => {
    const fetchEarthquakes = async (): Promise<void> => {
      const res = await fetch(
        'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=10&orderby=time&minmagnitude=2.5',
      )
      if (!res.ok) throw new Error('Failed to fetch earthquake data')
      const data = (await res.json()) as UsgsResponse

      setState({
        loading: false,
        error: null,
        earthquakes: data.features.map((f) => ({
          id: f.id,
          magnitude: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          url: f.properties.url,
          depth: f.geometry.coordinates[2],
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
        })),
      })
    }

    fetchEarthquakes().catch((err: unknown) => {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'Earthquake fetch failed',
        earthquakes: [],
      })
    })
  }, [])

  return state
}
