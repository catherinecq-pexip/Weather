import { useMemo } from 'react'
import type { WeatherEvent, AlertSeverity } from '../../hooks/useWeatherAlerts'
import './AlertFilters.css'

const SEVERITIES: AlertSeverity[] = ['Extreme', 'Severe', 'Moderate', 'Minor']

interface AlertFiltersProps {
  events: WeatherEvent[]
  typeFilter: string
  severityFilter: string
  showList: boolean
  mapCount: number
  totalCount: number
  onTypeChange: (type: string) => void
  onSeverityChange: (severity: string) => void
  onToggleList: () => void
}

export const AlertFilters = ({
  events,
  typeFilter,
  severityFilter,
  showList,
  mapCount,
  totalCount,
  onTypeChange,
  onSeverityChange,
  onToggleList,
}: AlertFiltersProps): JSX.Element => {
  const uniqueTypes = useMemo(
    () => [...new Set(events.map((e) => e.type))].sort(),
    [events],
  )

  return (
    <div className="alert-filters">
      <div className="filter-controls">
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => { onTypeChange(e.target.value) }}
          aria-label="Filter by event type"
        >
          <option value="">All Types</option>
          {uniqueTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={severityFilter}
          onChange={(e) => { onSeverityChange(e.target.value) }}
          aria-label="Filter by severity"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          className={`filter-list-btn${showList ? ' active' : ''}`}
          onClick={onToggleList}
          aria-pressed={showList}
        >
          {showList ? 'Hide List' : 'Show List'}
        </button>
      </div>

      <span className="filter-count">
        {mapCount} of {totalCount} alert{totalCount !== 1 ? 's' : ''} on map
      </span>
    </div>
  )
}
