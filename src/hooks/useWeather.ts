import { useState, useEffect } from 'react'

export interface ForecastPeriod {
  name: string
  temperature: number
  temperatureUnit: string
  windSpeed: string
  windDirection: string
  shortForecast: string
  icon: string
  isDaytime: boolean
}

export interface WeatherData {
  location: string
  forecast: ForecastPeriod
}

interface NwsPointsResponse {
  properties: {
    forecast: string
    relativeLocation: {
      properties: {
        city: string
        state: string
      }
    }
  }
}

interface NwsForecastResponse {
  properties: {
    periods: ForecastPeriod[]
  }
}

interface WeatherState {
  loading: boolean
  error: string | null
  data: WeatherData | null
}

export const useWeather = (): WeatherState => {
  const [state, setState] = useState<WeatherState>({
    loading: true,
    error: null,
    data: null,
  })

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number): Promise<void> => {
      const pointsRes = await fetch(
        `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
        { headers: { 'User-Agent': 'EmergencyDashboard/1.0' } },
      )
      if (!pointsRes.ok) {
        throw new Error('Location not supported by NWS API (US locations only)')
      }
      const pointsData = (await pointsRes.json()) as NwsPointsResponse
      const { forecast: forecastUrl, relativeLocation } = pointsData.properties
      const { city, state: stateCode } = relativeLocation.properties

      const forecastRes = await fetch(forecastUrl)
      if (!forecastRes.ok) throw new Error('Failed to fetch forecast data')
      const forecastData = (await forecastRes.json()) as NwsForecastResponse

      setState({
        loading: false,
        error: null,
        data: {
          location: `${city}, ${stateCode}`,
          forecast: forecastData.properties.periods[0],
        },
      })
    }

    const handleError = (err: unknown): void => {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'Weather fetch failed',
        data: null,
      })
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather(pos.coords.latitude, pos.coords.longitude).catch(handleError)
      },
      () => {
        // Default to Washington, DC when geolocation is unavailable
        fetchWeather(38.8951, -77.0364).catch(handleError)
      },
    )
  }, [])

  return state
}
