import { useWeather } from '../../hooks/useWeather'
import './Weather.css'

export const Weather = (): JSX.Element => {
  const { loading, error, data } = useWeather()

  if (loading) {
    return <div className="weather-widget weather-loading">Loading weather data...</div>
  }

  if (error != null) {
    return <div className="weather-widget weather-error">{error}</div>
  }

  if (data == null) {
    return <div className="weather-widget">No weather data available</div>
  }

  const { location, forecast } = data

  return (
    <div className="weather-widget">
      <div className="weather-header">
        <span className="weather-location">{location}</span>
        <span className="weather-period">{forecast.name}</span>
      </div>
      <div className="weather-main">
        <img className="weather-icon" src={forecast.icon} alt={forecast.shortForecast} />
        <span className="weather-temp">
          {forecast.temperature}&deg;{forecast.temperatureUnit}
        </span>
      </div>
      <p className="weather-desc">{forecast.shortForecast}</p>
      <p className="weather-wind">
        Wind: {forecast.windSpeed} {forecast.windDirection}
      </p>
    </div>
  )
}
