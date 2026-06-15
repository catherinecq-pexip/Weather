import { MEETING_NODE, MEETING_ALIAS } from '../../config/meeting'
import './MeetingEmbed.css'

interface MeetingEmbedProps {
  url: string
  onClose: () => void
}

export const MeetingEmbed = ({ url, onClose }: MeetingEmbedProps): JSX.Element => {
  return (
    <div className="meeting-embed">
      <div className="meeting-embed-bar">
        <div className="meeting-embed-info">
          <span className="meeting-embed-label">Emergency Conference</span>
          <span className="meeting-embed-meta">
            {MEETING_ALIAS} &middot; {MEETING_NODE}
          </span>
        </div>
        <button
          className="meeting-embed-back"
          onClick={onClose}
          aria-label="Return to dashboard"
        >
          ← Dashboard
        </button>
      </div>

      <iframe
        className="meeting-embed-frame"
        src={url}
        title="Emergency Conference"
        allow="camera; microphone; display-capture; autoplay; clipboard-write"
        allowFullScreen
      />
    </div>
  )
}
