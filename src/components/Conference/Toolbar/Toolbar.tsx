import './Toolbar.css'

interface ToolbarProps {
  className: string
  audioMuted: boolean
  videoMuted: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onDisconnect: () => void
}

export const Toolbar = ({
  className,
  audioMuted,
  videoMuted,
  onToggleAudio,
  onToggleVideo,
  onDisconnect,
}: ToolbarProps): JSX.Element => {
  return (
    <div className={[className, 'Toolbar'].join(' ').trim()}>
      <button
        className="toolbar-btn"
        data-active={String(!audioMuted)}
        onClick={onToggleAudio}
        title={audioMuted ? 'Unmute microphone' : 'Mute microphone'}
        aria-label={audioMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {audioMuted ? '🔇' : '🎤'}
      </button>
      <button
        className="toolbar-btn"
        data-active={String(!videoMuted)}
        onClick={onToggleVideo}
        title={videoMuted ? 'Enable camera' : 'Disable camera'}
        aria-label={videoMuted ? 'Enable camera' : 'Disable camera'}
      >
        {videoMuted ? '📵' : '📹'}
      </button>
      <button
        className="toolbar-btn hangup-btn"
        onClick={onDisconnect}
        title="End call"
        aria-label="End call"
      >
        📞
      </button>
    </div>
  )
}
