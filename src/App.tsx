import { Dashboard } from './components/Dashboard/Dashboard'
import { MEETING_URL } from './config/meeting'
import './App.css'

export const App = (): JSX.Element => {
  const handleJoinCall = (): void => {
    window.open(MEETING_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="App view-dashboard">
      <Dashboard onJoinCall={handleJoinCall} />
    </div>
  )
}
