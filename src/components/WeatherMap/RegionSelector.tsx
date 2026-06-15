import type { Region } from '../../hooks/useRegionFilter'
import './RegionSelector.css'

interface RegionSelectorProps {
  selectedContinent: Region | null
  selectedCountry: Region | null
  selectedAdminArea: Region | null
  continents: Region[]
  availableCountries: Region[]
  availableAdminAreas: Region[]
  breadcrumb: string[]
  hasSelection: boolean
  onSetContinent: (region: Region | null) => void
  onSetCountry: (region: Region | null) => void
  onSetAdminArea: (region: Region | null) => void
  onReset: () => void
}

const findById = (regions: Region[], id: string): Region | null =>
  regions.find((r) => r.id === id) ?? null

export const RegionSelector = ({
  selectedContinent,
  selectedCountry,
  selectedAdminArea,
  continents,
  availableCountries,
  availableAdminAreas,
  breadcrumb,
  hasSelection,
  onSetContinent,
  onSetCountry,
  onSetAdminArea,
  onReset,
}: RegionSelectorProps): JSX.Element => {
  const countryDisabled = selectedContinent == null
  const adminDisabled = selectedCountry == null || availableAdminAreas.length === 0

  return (
    <div className="region-selector">
      <div className="region-controls">
        {/* Continent */}
        <select
          className="region-select"
          value={selectedContinent?.id ?? ''}
          onChange={(e) => {
            onSetContinent(e.target.value ? findById(continents, e.target.value) : null)
          }}
          aria-label="Select continent"
        >
          <option value="">All Regions</option>
          {continents.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Country */}
        <select
          className="region-select"
          value={selectedCountry?.id ?? ''}
          disabled={countryDisabled}
          onChange={(e) => {
            onSetCountry(e.target.value ? findById(availableCountries, e.target.value) : null)
          }}
          aria-label="Select country"
        >
          <option value="">
            {countryDisabled ? '— Country —' : 'All Countries'}
          </option>
          {availableCountries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Admin area (state / territory) */}
        <select
          className="region-select"
          value={selectedAdminArea?.id ?? ''}
          disabled={adminDisabled}
          onChange={(e) => {
            onSetAdminArea(e.target.value ? findById(availableAdminAreas, e.target.value) : null)
          }}
          aria-label="Select admin area"
        >
          <option value="">
            {adminDisabled ? '— Admin Area —' : `All in ${selectedCountry?.name ?? ''}`}
          </option>
          {availableAdminAreas.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {hasSelection && (
          <button className="region-reset-btn" onClick={onReset} aria-label="Reset to global view">
            ↺ Global
          </button>
        )}
      </div>

      {hasSelection && (
        <div className="region-breadcrumb" aria-label="Current region selection">
          {breadcrumb.map((segment, i) => (
            <span key={i}>
              {i > 0 && <span className="region-breadcrumb-sep">›</span>}
              <span className="region-breadcrumb-item">{segment}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
