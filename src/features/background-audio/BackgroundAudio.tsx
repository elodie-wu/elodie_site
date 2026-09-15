import { useRef, useState } from 'react'
import { siteConfig } from '../../config/site'
import { assetUrl } from '../../shared/lib/assetUrl'
import './background-audio.css'

/** Remains mounted in the shared header, so music continues across routes. */
export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) { audio.pause(); return }
    audio.volume = 0.45
    try { await audio.play() } catch { setIsPlaying(false) }
  }

  return (
    <>
      <button
        type="button"
        className={`music-toggle${isPlaying ? ' music-toggle-active' : ''}`}
        aria-label={isPlaying ? 'Turn background music off' : 'Turn background music on'}
        aria-pressed={isPlaying}
        title={isPlaying ? 'Music off' : 'Music on'}
        onClick={toggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9.5v5h3.4l4.1 3.4V6.1L7.4 9.5H4Z" />
          {isPlaying ? (
            <>
              <path className="music-wave music-wave-near" d="M14.4 9a4.2 4.2 0 0 1 0 6" />
              <path className="music-wave music-wave-far" d="M17.2 6.5a7.8 7.8 0 0 1 0 11" />
            </>
          ) : <path className="music-muted-mark" d="m15.2 9.2 5.2 5.2m0-5.2-5.2 5.2" />}
        </svg>
      </button>
      <audio
        ref={audioRef}
        src={assetUrl(siteConfig.backgroundAudio)}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </>
  )
}
