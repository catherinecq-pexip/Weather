import { useState, useMemo, useCallback } from 'react'
import {
  getContinents,
  getCountriesFor,
  getAdminAreasFor,
  isEventInRegion,
} from '../config/geography'
import type { Region, RegionBounds } from '../config/geography'

export type { Region }

interface HasLatLon {
  lat: number | null
  lon: number | null
}

export interface UseRegionFilterReturn {
  // Current selections (null = "all")
  selectedContinent: Region | null
  selectedCountry: Region | null
  selectedAdminArea: Region | null
  // Available options for lower-level dropdowns
  continents: Region[]
  availableCountries: Region[]
  availableAdminAreas: Region[]
  // Actions — setting a parent clears all children
  setContinent: (region: Region | null) => void
  setCountry: (region: Region | null) => void
  setAdminArea: (region: Region | null) => void
  reset: () => void
  // Derived
  filterEvent: (event: HasLatLon) => boolean
  targetBounds: RegionBounds | null
  breadcrumb: string[]
  hasSelection: boolean
}

export const useRegionFilter = (): UseRegionFilterReturn => {
  const [selectedContinent, setSelectedContinentState] = useState<Region | null>(null)
  const [selectedCountry, setSelectedCountryState] = useState<Region | null>(null)
  const [selectedAdminArea, setSelectedAdminAreaState] = useState<Region | null>(null)

  const continents = useMemo(() => getContinents(), [])

  const availableCountries = useMemo(
    () => (selectedContinent != null ? getCountriesFor(selectedContinent.id) : []),
    [selectedContinent],
  )

  const availableAdminAreas = useMemo(
    () => (selectedCountry != null ? getAdminAreasFor(selectedCountry.id) : []),
    [selectedCountry],
  )

  // Setting a parent always clears children
  const setContinent = useCallback((region: Region | null) => {
    setSelectedContinentState(region)
    setSelectedCountryState(null)
    setSelectedAdminAreaState(null)
  }, [])

  const setCountry = useCallback((region: Region | null) => {
    setSelectedCountryState(region)
    setSelectedAdminAreaState(null)
  }, [])

  const setAdminArea = useCallback((region: Region | null) => {
    setSelectedAdminAreaState(region)
  }, [])

  const reset = useCallback(() => {
    setSelectedContinentState(null)
    setSelectedCountryState(null)
    setSelectedAdminAreaState(null)
  }, [])

  // Most-specific selected region drives the bounds and filtering
  const activeRegion = selectedAdminArea ?? selectedCountry ?? selectedContinent

  const filterEvent = useCallback(
    (event: HasLatLon): boolean => {
      if (activeRegion == null) return true
      if (event.lat == null || event.lon == null) return true // no coords → include (shown in list, not on map)
      return isEventInRegion(event.lat, event.lon, activeRegion.bounds)
    },
    [activeRegion],
  )

  const targetBounds: RegionBounds | null = activeRegion?.bounds ?? null

  const breadcrumb = useMemo(() => {
    const parts: string[] = []
    if (selectedContinent != null) parts.push(selectedContinent.name)
    if (selectedCountry != null) parts.push(selectedCountry.name)
    if (selectedAdminArea != null) parts.push(selectedAdminArea.name)
    return parts
  }, [selectedContinent, selectedCountry, selectedAdminArea])

  const hasSelection = activeRegion != null

  return {
    selectedContinent,
    selectedCountry,
    selectedAdminArea,
    continents,
    availableCountries,
    availableAdminAreas,
    setContinent,
    setCountry,
    setAdminArea,
    reset,
    filterEvent,
    targetBounds,
    breadcrumb,
    hasSelection,
  }
}
