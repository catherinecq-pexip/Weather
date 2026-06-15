import { useEffect, useRef, useState } from 'react'
import { Toolbar } from './Toolbar/Toolbar'
import './Conference.css'

export interface ConferenceProps {
  nodeDomain: string
  vmr: string
  displayName: string
  onDisconnect: () => void
  onError: (message: string) => void
  onPinRequired: (required: boolean) => void
}

export const Conference = ({
  nodeDomain,
  vmr,
  displayName,
  onDisconnect,
  onError,
  onPinRequired,
}: ConferenceProps): JSX.Element => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const selfViewRef = useRef<HTMLVideoElement>(null)
  const [audioMuted, setAudioMuted] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)

  useEffect(() => {
    let stopped = false
    let localTracks: MediaStreamTrack[] = []

    const connect = async (): Promise<void> => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (stopped) {
        stream.getTracks().forEach((t) => { t.stop() })
        return
      }
      localTracks = stream.getTracks()
      if (selfViewRef.current != null) {
        selfViewRef.current.srcObject = stream
      }

      // TODO: Complete Pexip Infinity connection following the tutorial at:
      // https://developer.pexip.com/docs/category/npm-packages
      //
      // import { createInfinityClient, createInfinityClientSignals, createCallSignals } from '@pexip/infinity'
      //
      // const infinityClientSignals = createInfinityClientSignals([])
      // const callSignals = createCallSignals([])
      //
      // callSignals.onRemoteStream.add((remoteStream) => {
      //   if (remoteVideoRef.current != null) remoteVideoRef.current.srcObject = remoteStream
      // })
      // infinityClientSignals.onPinRequired.add(({ required }) => { onPinRequired(required) })
      //
      // const client = createInfinityClient(infinityClientSignals, callSignals)
      // await client.call({ host: `https://${nodeDomain}`, conferenceAlias: vmr, displayName })
      //
      // Return cleanup: () => { client.disconnect().catch(console.error) }

      // Temporary: log connection intent until Pexip is integrated
      console.debug('Ready to connect:', { nodeDomain, vmr, displayName, onPinRequired })
    }

    connect().catch((err: unknown) => {
      if (!stopped) {
        onError(err instanceof Error ? err.message : 'Failed to access camera/microphone')
      }
    })

    return () => {
      stopped = true
      localTracks.forEach((t) => { t.stop() })
    }
  }, [nodeDomain, vmr, displayName, onError, onPinRequired])

  const handleToggleAudio = (): void => {
    setAudioMuted((prev) => !prev)
    // TODO: infinityClient.mute({ audio: !audioMuted })
  }

  const handleToggleVideo = (): void => {
    setVideoMuted((prev) => !prev)
    // TODO: infinityClient.mute({ video: !videoMuted })
  }

  return (
    <div className="Conference">
      <div className="VideoContainer">
        <video ref={remoteVideoRef} className="remote-video" autoPlay playsInline />
        <video ref={selfViewRef} className="local-video" autoPlay playsInline muted />
        <div className="toolbar">
          <Toolbar
            className=""
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </div>
  )
}
