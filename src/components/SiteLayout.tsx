import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  { label: 'Work', path: '/work' },
  { label: 'Play', path: '/play' },
  { label: 'Logs', path: '/logs' },
  { label: 'About', path: '/about' },
]

const sceneRoutes = ['/', '/work', '/play', '/logs', '/about'] as const

export function SiteLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const musicRef = useRef<HTMLAudioElement>(null)
  const wheelDistance = useRef(0)
  const wheelDirection = useRef(0)
  const lastWheelNavigation = useRef(0)
  const [routeTransition, setRouteTransition] = useState<'up' | 'down' | null>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const isFullScene = sceneRoutes.includes(location.pathname as (typeof sceneRoutes)[number])
  const assetBase = `${window.location.pathname}assets/home/`
  const musicSource = `${window.location.pathname}assets/audio/rain.mp4`

  const toggleMusic = async () => {
    const music = musicRef.current
    if (!music) return

    if (!music.paused) {
      music.pause()
      return
    }

    music.volume = 0.45
    try {
      await music.play()
    } catch {
      setIsMusicPlaying(false)
    }
  }

  useEffect(() => {
    if (!isFullScene) return

    const currentIndex = sceneRoutes.indexOf(location.pathname as (typeof sceneRoutes)[number])
    let resetTimer = 0
    let navigationTimer = 0

    const resetWheelDistance = () => {
      wheelDistance.current = 0
      wheelDirection.current = 0
    }

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4 || Date.now() - lastWheelNavigation.current < 720) return

      const direction = event.deltaY > 0 ? 1 : -1
      if (wheelDirection.current !== 0 && wheelDirection.current !== direction) {
        wheelDistance.current = 0
      }
      wheelDirection.current = direction
      wheelDistance.current += event.deltaY

      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(resetWheelDistance, 220)
      if (Math.abs(wheelDistance.current) < 150) return

      const nextIndex = currentIndex + direction
      resetWheelDistance()
      if (nextIndex < 0 || nextIndex >= sceneRoutes.length) return

      lastWheelNavigation.current = Date.now()
      setRouteTransition(direction > 0 ? 'down' : 'up')
      navigationTimer = window.setTimeout(() => {
        navigate(sceneRoutes[nextIndex])
        setRouteTransition(null)
      }, 170)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.clearTimeout(resetTimer)
      window.clearTimeout(navigationTimer)
      resetWheelDistance()
    }
  }, [isFullScene, location.pathname, navigate])

  return (
    <div className="min-h-screen bg-ink text-white">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <header className={`site-header${isFullScene ? ' site-header-home' : ''}`}>
        <Link to="/" className="brand" aria-label="Elodie Wu home">
          <img className="brand-logo" src={`${assetBase}logo-ew.png`} alt="" />
        </Link>

        <nav aria-label="Primary navigation" className="nav-shell">
          <button
            type="button"
            className={`music-toggle${isMusicPlaying ? ' music-toggle-active' : ''}`}
            aria-label={isMusicPlaying ? 'Turn background music off' : 'Turn background music on'}
            aria-pressed={isMusicPlaying}
            title={isMusicPlaying ? 'Music off' : 'Music on'}
            onClick={toggleMusic}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9.5v5h3.4l4.1 3.4V6.1L7.4 9.5H4Z" />
              {isMusicPlaying ? (
                <>
                  <path className="music-wave music-wave-near" d="M14.4 9a4.2 4.2 0 0 1 0 6" />
                  <path className="music-wave music-wave-far" d="M17.2 6.5a7.8 7.8 0 0 1 0 11" />
                </>
              ) : (
                <path className="music-muted-mark" d="m15.2 9.2 5.2 5.2m0-5.2-5.2 5.2" />
              )}
            </svg>
          </button>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link${location.pathname === item.path ? ' nav-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <audio
          ref={musicRef}
          src={musicSource}
          loop
          preload="none"
          onPlay={() => setIsMusicPlaying(true)}
          onPause={() => setIsMusicPlaying(false)}
        />
      </header>

      <main
        id="main-content"
        className={`route-stage${routeTransition ? ` route-stage-exiting-${routeTransition}` : ''}`}
      >
        <Outlet />
      </main>

      {!isFullScene && (
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Elodie Wu</span>
          <span className="system-status"><i /> Static system online</span>
        </footer>
      )}
    </div>
  )
}
