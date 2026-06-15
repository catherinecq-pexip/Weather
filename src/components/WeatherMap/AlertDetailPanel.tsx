import type { WeatherEvent, AlertSeverity } from '../../hooks/useWeatherAlerts'
import './AlertDetailPanel.css'

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  Extreme: '#b71c1c',
  Severe: '#e65100',
  Moderate: '#f57f17',
  Minor: '#2e7d32',
  Unknown: '#546e7a',
}

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return iso
  }
}

interface AlertDetailPanelProps {
  event: WeatherEvent
  onClose: () => void
}

export const AlertDetailPanel = ({ event, onClose }: AlertDetailPanelProps): JSX.Element => {
  return (
    <aside className="alert-detail-panel">
      <button className="panel-close-btn" onClick={onClose} aria-label="Close panel">
        ×
      </button>

      <div className="panel-badges">
        <span
          className="panel-type-badge"
          style={{ borderColor: 'currentColor' }}
        >
          {event.type}
        </span>
        <span
          className="panel-severity-badge"
          style={{ background: SEVERITY_COLORS[event.severity] }}
        >
          {event.severity}
        </span>
      </div>

      <h3 className="panel-title">{event.title}</h3>

      <dl className="panel-meta">
        <dt>Area</dt>
        <dd>{event.areaDesc}</dd>

        {event.rawMagnitude != null && (
          <>
            <dt>Magnitude</dt>
            <dd>M{event.rawMagnitude.toFixed(1)}</dd>
          </>
        )}

        <dt>{event.markerShape === 'triangle' ? 'Time' : 'Effective'}</dt>
        <dd>{formatDate(event.start)}</dd>

        {event.markerShape !== 'triangle' && (
          <>
            <dt>Expires</dt>
            <dd>{formatDate(event.end)}</dd>
          </>
        )}
      </dl>

      <div className="panel-description">
        <p className="panel-desc-label">Description</p>
        <p className="panel-desc-text">{event.description}</p>
      </div>
    </aside>
  )
}
