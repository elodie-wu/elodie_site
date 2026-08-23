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
  const wheelDistance = useRef(0)
  const wheelDirection = useRef(0)
  const lastWheelNavigation = useRef(0)
  const [routeTransition, setRouteTransition] = useState<'up' | 'down' | null>(null)
  const isFullScene = sceneRoutes.includes(location.pathname as (typeof sceneRoutes)[number])
  const assetBase = `${import.meta.env.BASE_URL}assets/home/`

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
