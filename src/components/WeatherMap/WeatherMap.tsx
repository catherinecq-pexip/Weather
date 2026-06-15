import { useState, useMemo, useEffect, Fragment } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Marker,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeatherAlerts } from '../../hooks/useWeatherAlerts'
import type { WeatherEvent, AlertGeometry, AlertSeverity } from '../../hooks/useWeatherAlerts'
import { useEarthquakes } from '../../hooks/useEarthquakes'
import type { Earthquake } from '../../hooks/useEarthquakes'
import { useRegionFilter } from '../../hooks/useRegionFilter'
import type { RegionBounds } from '../../config/geography'
import { AlertFilters } from './AlertFilters'
import { AlertDetailPanel } from './AlertDetailPanel'
import { AlertList } from './AlertList'
import { RegionSelector } from './RegionSelector'
import './WeatherMap.css'

// ─── Colour: weather events by type ──────────────────────────────────────────

export const getEventColor = (type: string): string => {
  const t = type.toLowerCase()
  if (t.includes('tornado')) return '#ff1744'
  if (t.includes('hurricane') || t.includes('typhoon') || t.includes('tropical')) return '#e040fb'
  if (t.includes('flash flood')) return '#1565c0'
  if (t.includes('flood')) return '#1976d2'
  if (
    t.includes('blizzard') ||
    t.includes('winter') ||
    t.includes('snow') ||
    t.includes('ice') ||
    t.includes('freeze') ||
    t.includes('frost')
  )
    return '#80d8ff'
  if (t.includes('thunderstorm')) return '#ff6d00'
  if (t.includes('high wind') || t.includes('wind advisory') || t.includes('wind warning'))
    return '#f9a825'
  if (t.includes('wind')) return '#ffd600'
  if (t.includes('fire') || t.includes('red flag')) return '#bf360c'
  if (t.includes('heat') || t.includes('excessive heat')) return '#e65100'
  if (t.includes('fog') || t.includes('smoke') || t.includes('dust')) return '#78909c'
  if (t.includes('tsunami')) return '#0d47a1'
  return '#546e7a'
}

// ─── Colour: earthquake markers by severity ───────────────────────────────────

const getSeverityColor = (severity: AlertSeverity): string => {
  switch (severity) {
    case 'Extreme':
      return '#b71c1c'
    case 'Severe':
      return '#e65100'
    case 'Moderate':
      return '#f57f17'
    case 'Minor':
      return '#2e7d32'
    default:
      return '#546e7a'
  }
}

// ─── Earthquake → WeatherEvent normalisation ─────────────────────────────────

const magnitudeToSeverity = (mag: number): AlertSeverity => {
  if (mag >= 5.5) return 'Severe'
  if (mag >= 3.5) return 'Moderate'
  return 'Minor'
}

const normalizeEarthquake = (eq: Earthquake): WeatherEvent => {
  const severity = magnitudeToSeverity(eq.magnitude)
  return {
    id: eq.id,
    title: `M${eq.magnitude.toFixed(1)} – ${eq.place}`,
    type: 'Earthquake',
    severity,
    areaDesc: eq.place,
    description: `Magnitude: ${eq.magnitude.toFixed(1)}\nDepth: ${eq.depth.toFixed(1)} km\n\n${eq.place}`,
    start: new Date(eq.time).toISOString(),
    end: new Date(eq.time).toISOString(),
    lat: eq.lat,
    lon: eq.lon,
    geometry: { type: 'Point', coordinates: [eq.lon, eq.lat] },
    markerShape: 'triangle',
    rawMagnitude: eq.magnitude,
  }
}

// ─── Triangle icon factory for earthquake markers ─────────────────────────────

const createTriangleIcon = (color: string, isSelected: boolean): L.DivIcon => {
  const strokeWidth = isSelected ? 2.5 : 1.5
  return L.divIcon({
    className: '',
    html: `<svg width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="10,1 19,18 1,18" fill="${color}" stroke="white" stroke-width="${strokeWidth}" stroke-linejoin="round"/></svg>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    tooltipAnchor: [0, -20],
  })
}

// ─── GeoJSON [lon, lat] → Leaflet [lat, lon] ──────────────────────────────────

const toLeafletRings = (coords: number[][][]): [number, number][][] =>
  coords.map((ring) => ring.map((c): [number, number] => [c[1], c[0]]))

const collectBoundsPoints = (geometry: AlertGeometry): [number, number][] => {
  if (geometry.type === 'Point') {
    return [[geometry.coordinates[1], geometry.coordinates[0]]]
  }
  if (geometry.type === 'Polygon') {
    return geometry.coordinates[0].map((c): [number, number] => [c[1], c[0]])
  }
  return geometry.coordinates.flatMap((poly) =>
    poly[0].map((c): [number, number] => [c[1], c[0]]),
  )
}

// ─── Auto-fit bounds (inside <MapContainer>) ──────────────────────────────────

interface BoundsAdjusterProps {
  events: WeatherEvent[]
  targetBounds: RegionBounds | null
}

const MapBoundsAdjuster = ({ events, targetBounds }: BoundsAdjusterProps): null => {
  const map = useMap()

  useEffect(() => {
    // Region selected → fly to region bounds regardless of event count
    if (targetBounds != null) {
      map.fitBounds(targetBounds as L.LatLngBoundsExpression, { padding: [30, 30] })
      return
    }

    // No region → fit to visible events (existing behaviour)
    const withGeo = events.filter((e) => e.geometry != null)
    if (withGeo.length === 0) {
      map.setView([39.5, -98.35], 4)
      return
    }

    const allPoints = withGeo.flatMap((e) =>
      e.geometry != null ? collectBoundsPoints(e.geometry) : [],
    )
    if (allPoints.length === 0) return

    const bounds = L.latLngBounds(allPoints as L.LatLngExpression[])
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 8 })
  }, [events, targetBounds, map])

  return null
}

// ─── Main component ───────────────────────────────────────────────────────────

export const WeatherMap = (): JSX.Element => {
  // ── Data ──────────────────────────────────────────────────────────────────
  const { loading: wLoading, error: wError, events: weatherEvents } = useWeatherAlerts()
  const { loading: eqLoading, error: eqError, earthquakes } = useEarthquakes()

  const loading = wLoading || eqLoading
  const error = wError ?? eqError

  const earthquakeEvents = useMemo(
    () => earthquakes.map(normalizeEarthquake),
    [earthquakes],
  )

  const allEvents = useMemo(
    () => [...weatherEvents, ...earthquakeEvents],
    [weatherEvents, earthquakeEvents],
  )

  // ── Region filter ────────────────────────────────────────────────────────
  const regionFilter = useRegionFilter()

  // Apply region filter (lat/lon bounding-box) first, preserving events with no
  // coordinates so they still appear in the list view.
  const regionFilteredEvents = useMemo(
    () => allEvents.filter((e) => regionFilter.filterEvent(e)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEvents, regionFilter.filterEvent],
  )

  // ── UI state ─────────────────────────────────────────────────────────────
  const [selectedEvent, setSelectedEvent] = useState<WeatherEvent | null>(null)
  const [typeFilter, setTypeFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [showList, setShowList] = useState(false)

  // ── Derived event sets ────────────────────────────────────────────────────

  // Events on the map: must have geometry AND pass all filters
  const filteredMapEvents = useMemo(
    () =>
      regionFilteredEvents.filter(
        (e) =>
          e.geometry != null &&
          e.lat != null &&
          e.lon != null &&
          (typeFilter === '' || e.type === typeFilter) &&
          (severityFilter === '' || e.severity === severityFilter),
      ),
    [regionFilteredEvents, typeFilter, severityFilter],
  )

  // Events in the list: all region-filtered events passing type/severity
  const filteredAllEvents = useMemo(
    () =>
      regionFilteredEvents.filter(
        (e) =>
          (typeFilter === '' || e.type === typeFilter) &&
          (severityFilter === '' || e.severity === severityFilter),
      ),
    [regionFilteredEvents, typeFilter, severityFilter],
  )

  const noMapEvents = !loading && error == null && filteredMapEvents.length === 0

  // Active region label for the empty-state message
  const activeRegionLabel = regionFilter.breadcrumb[regionFilter.breadcrumb.length - 1] ?? null

  return (
    <div className="weather-map-section">
      {/* ── Geographic region selector ── */}
      <RegionSelector
        selectedContinent={regionFilter.selectedContinent}
        selectedCountry={regionFilter.selectedCountry}
        selectedAdminArea={regionFilter.selectedAdminArea}
        continents={regionFilter.continents}
        availableCountries={regionFilter.availableCountries}
        availableAdminAreas={regionFilter.availableAdminAreas}
        breadcrumb={regionFilter.breadcrumb}
        hasSelection={regionFilter.hasSelection}
        onSetContinent={(r) => { regionFilter.setContinent(r); setSelectedEvent(null) }}
        onSetCountry={(r) => { regionFilter.setCountry(r); setSelectedEvent(null) }}
        onSetAdminArea={(r) => { regionFilter.setAdminArea(r); setSelectedEvent(null) }}
        onReset={() => { regionFilter.reset(); setSelectedEvent(null) }}
      />

      {/* ── Type / severity / list filters ── */}
      <AlertFilters
        events={allEvents}
        typeFilter={typeFilter}
        severityFilter={severityFilter}
        showList={showList}
        mapCount={filteredMapEvents.length}
        totalCount={filteredAllEvents.length}
        onTypeChange={(t) => { setTypeFilter(t); setSelectedEvent(null) }}
        onSeverityChange={(s) => { setSeverityFilter(s); setSelectedEvent(null) }}
        onToggleList={() => { setShowList((v) => !v) }}
      />

      <div className="weather-map-body">
        {/* ── Map canvas ── */}
        <div className="weather-map-canvas">
          <MapContainer
            center={[39.5, -98.35]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            zoomControl
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              maxZoom={19}
            />

            {filteredMapEvents.map((event) => {
              const geometry = event.geometry
              const lat = event.lat
              const lon = event.lon
              if (geometry == null || lat == null || lon == null) return null

              const isSelected = selectedEvent?.id === event.id
              const isEarthquake = event.markerShape === 'triangle'
              const color = isEarthquake
                ? getSeverityColor(event.severity)
                : getEventColor(event.type)
              const fillOpacity = isSelected ? 0.3 : 0.15
              const weight = isSelected ? 2.5 : 1.5

              const tooltipBody = (
                <>
                  <span className="map-tooltip-type">{event.type}</span>
                  <br />
                  <span className="map-tooltip-meta">
                    {event.rawMagnitude != null
                      ? `M${event.rawMagnitude.toFixed(1)}`
                      : event.severity}{' '}
                    &middot; {event.areaDesc.split(';')[0].trim()}
                  </span>
                </>
              )

              return (
                <Fragment key={event.id}>
                  {/* Polygon fills — weather events with area geometry */}
                  {!isEarthquake && geometry.type === 'Polygon' && (
                    <Polygon
                      positions={toLeafletRings(geometry.coordinates)}
                      pathOptions={{ color, fillColor: color, fillOpacity, weight, opacity: 0.8 }}
                      eventHandlers={{ click: () => { setSelectedEvent(event) } }}
                    />
                  )}
                  {!isEarthquake &&
                    geometry.type === 'MultiPolygon' &&
                    geometry.coordinates.map((poly, i) => (
                      <Polygon
                        key={i}
                        positions={toLeafletRings(poly)}
                        pathOptions={{ color, fillColor: color, fillOpacity, weight, opacity: 0.8 }}
                        eventHandlers={{ click: () => { setSelectedEvent(event) } }}
                      />
                    ))}

                  {/* Point marker */}
                  {isEarthquake ? (
                    <Marker
                      position={[lat, lon]}
                      icon={createTriangleIcon(color, isSelected)}
                      eventHandlers={{ click: () => { setSelectedEvent(event) } }}
                    >
                      <Tooltip sticky direction="top">{tooltipBody}</Tooltip>
                    </Marker>
                  ) : (
                    <CircleMarker
                      center={[lat, lon]}
                      radius={isSelected ? 10 : 7}
                      pathOptions={{ color: '#fff', weight: 1.5, fillColor: color, fillOpacity: 1 }}
                      eventHandlers={{ click: () => { setSelectedEvent(event) } }}
                    >
                      <Tooltip sticky direction="top" offset={[0, -8]}>{tooltipBody}</Tooltip>
                    </CircleMarker>
                  )}
                </Fragment>
              )
            })}

            <MapBoundsAdjuster
              events={filteredMapEvents}
              targetBounds={regionFilter.targetBounds}
            />
          </MapContainer>

          {/* Status overlays */}
          {loading && (
            <div className="map-overlay">
              <div className="map-status-msg">Loading alerts &amp; earthquakes&hellip;</div>
            </div>
          )}
          {!loading && error != null && (
            <div className="map-overlay map-overlay-error">
              <div className="map-status-msg">{error}</div>
            </div>
          )}
          {noMapEvents && (
            <div className="map-overlay map-overlay-empty">
              <div className="map-status-msg">
                No active events
                {activeRegionLabel != null && ` in ${activeRegionLabel}`}
                {(typeFilter !== '' || severityFilter !== '') && ' for current filters'}
              </div>
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        {selectedEvent != null && (
          <AlertDetailPanel
            event={selectedEvent}
            onClose={() => { setSelectedEvent(null) }}
          />
        )}
      </div>

      {/* ── Optional list view ── */}
      {showList && (
        <div className="alert-list-panel">
          <AlertList
            events={filteredAllEvents}
            selectedId={selectedEvent?.id ?? null}
            onSelect={(e) => { setSelectedEvent(e) }}
          />
        </div>
      )}
    </div>
  )
}
