import { WeatherMap } from '../WeatherMap/WeatherMap'
import './Dashboard.css'

interface DashboardProps {
  onJoinCall: () => void
}

export const Dashboard = ({ onJoinCall }: DashboardProps): JSX.Element => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Emergency Coordination Dashboard</h1>
        <p className="dashboard-subtitle">
          Live weather alerts &amp; seismic data &middot; Secure video conferencing
        </p>
      </header>

      <section className="dashboard-map-section">
        <h2 className="card-title">Active Weather Alerts</h2>
        <WeatherMap />
      </section>

      <div className="dashboard-call-panel">
        <p className="call-prompt">Coordinate your emergency response team via secure video</p>
        <button className="join-call-btn" onClick={onJoinCall}>
          Join Emergency Call
        </button>
      </div>
    </div>
  )
}
