import type { WeatherEvent, AlertSeverity } from '../../hooks/useWeatherAlerts'
import './AlertList.css'

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
}

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  Extreme: '#b71c1c',
  Severe: '#e65100',
  Moderate: '#f57f17',
  Minor: '#2e7d32',
  Unknown: '#546e7a',
}

interface AlertListProps {
  events: WeatherEvent[]
  selectedId: string | null
  onSelect: (event: WeatherEvent) => void
}

export const AlertList = ({ events, selectedId, onSelect }: AlertListProps): JSX.Element => {
  const sorted = [...events].sort((a, b) => {
    const sd = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    if (sd !== 0) return sd
    return new Date(b.start).getTime() - new Date(a.start).getTime()
  })

  if (sorted.length === 0) {
    return (
      <div className="alert-list-empty">
        No alerts match the current filters
      </div>
    )
  }

  return (
    <ul className="alert-list">
      {sorted.map((event) => (
        <li
          key={event.id}
          className={`alert-list-item${selectedId === event.id ? ' selected' : ''}${event.lat == null ? ' no-geo' : ''}`}
          onClick={() => { onSelect(event) }}
        >
          <span
            className="list-sev-badge"
            style={{ background: SEVERITY_COLORS[event.severity] }}
          >
            {event.severity.slice(0, 3).toUpperCase()}
          </span>
          <div className="list-item-body">
            <span className="list-item-type">{event.type}</span>
            <span className="list-item-area">{event.areaDesc.split(';')[0]}</span>
          </div>
          {event.lat == null && (
            <span className="list-no-geo-badge" title="No map location">—</span>
          )}
        </li>
      ))}
    </ul>
  )
}
