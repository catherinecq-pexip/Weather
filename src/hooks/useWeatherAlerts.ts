import { useState, useEffect } from 'react'

export type AlertSeverity = 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'

export type AlertGeometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'Polygon'; coordinates: number[][][] }
  | { type: 'MultiPolygon'; coordinates: number[][][][] }

export interface WeatherEvent {
  id: string
  title: string
  type: string
  severity: AlertSeverity
  areaDesc: string
  description: string
  start: string
  end: string
  lat: number | null
  lon: number | null
  geometry: AlertGeometry | null
  markerShape?: 'circle' | 'triangle'
  rawMagnitude?: number
}

interface NWSAlertProperties {
  event: string
  headline: string | null
  severity: string
  areaDesc: string
  effective: string
  expires: string
  ends: string | null
  description: string
  status: string
  messageType: string
}

interface RawGeometry {
  type: string
  coordinates: unknown
}

interface NWSAlertFeature {
  id: string
  geometry: RawGeometry | null
  properties: NWSAlertProperties
}

interface NWSAlertsResponse {
  features: NWSAlertFeature[]
}

const toSeverity = (s: string): AlertSeverity => {
  if (s === 'Extreme' || s === 'Severe' || s === 'Moderate' || s === 'Minor') return s
  return 'Unknown'
}

const parseGeometry = (raw: RawGeometry | null): AlertGeometry | null => {
  if (raw == null) return null
  if (raw.type === 'Point') return raw as AlertGeometry
  if (raw.type === 'Polygon') return raw as AlertGeometry
  if (raw.type === 'MultiPolygon') return raw as AlertGeometry
  return null
}

const computeCentroid = (geometry: AlertGeometry): [number, number] | null => {
  if (geometry.type === 'Point') {
    return [geometry.coordinates[1], geometry.coordinates[0]]
  }
  if (geometry.type === 'Polygon') {
    const ring = geometry.coordinates[0]
    if (ring.length === 0) return null
    const lat = ring.reduce((s, c) => s + c[1], 0) / ring.length
    const lon = ring.reduce((s, c) => s + c[0], 0) / ring.length
    return [lat, lon]
  }
  // MultiPolygon
  const allPoints = geometry.coordinates.flatMap((poly) => poly[0])
  if (allPoints.length === 0) return null
  const lat = allPoints.reduce((s, c) => s + c[1], 0) / allPoints.length
  const lon = allPoints.reduce((s, c) => s + c[0], 0) / allPoints.length
  return [lat, lon]
}

const normalizeFeature = (feature: NWSAlertFeature): WeatherEvent => {
  const { properties: p } = feature
  const geometry = parseGeometry(feature.geometry)

  let lat: number | null = null
  let lon: number | null = null
  if (geometry != null) {
    const centroid = computeCentroid(geometry)
    if (centroid != null) {
      lat = centroid[0]
      lon = centroid[1]
    }
  }

  return {
    id: feature.id,
    title: p.headline ?? p.event,
    type: p.event,
    severity: toSeverity(p.severity),
    areaDesc: p.areaDesc,
    description: p.description,
    start: p.effective,
    end: p.ends ?? p.expires,
    lat,
    lon,
    geometry,
  }
}

interface WeatherAlertsState {
  loading: boolean
  error: string | null
  events: WeatherEvent[]
}

export const useWeatherAlerts = (): WeatherAlertsState => {
  const [state, setState] = useState<WeatherAlertsState>({
    loading: true,
    error: null,
    events: [],
  })

  useEffect(() => {
    const fetchAlerts = async (): Promise<void> => {
      const res = await fetch(
        'https://api.weather.gov/alerts/active?status=actual&message_type=alert',
        { headers: { 'User-Agent': 'EmergencyDashboard/1.0' } },
      )
      if (!res.ok) throw new Error(`NWS alerts API responded with ${res.status}`)
      const data = (await res.json()) as NWSAlertsResponse

      const events = data.features
        .filter((f) => f.properties.status === 'Actual')
        .map(normalizeFeature)

      setState({ loading: false, error: null, events })
    }

    fetchAlerts().catch((err: unknown) => {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather alerts',
        events: [],
      })
    })
  }, [])

  return state
}
