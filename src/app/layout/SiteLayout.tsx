import { Outlet } from 'react-router-dom'
import { useSceneNavigation } from '../hooks/useSceneNavigation'
import { SiteHeader } from './SiteHeader'
import './site-layout.css'

/** Shared frame. Outlet is where React Router renders the selected page. */
export function SiteLayout() {
  const { isScene, transition } = useSceneNavigation()
  return (
    <div className="site-layout">
      <a className="skip-link" href="#main-content" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>Skip to content</a>
      <div className="noise" aria-hidden="true" />
      <SiteHeader isScene={isScene} />
      <main
        id="main-content"
        tabIndex={-1}
        className={`route-stage${transition ? ` route-stage-exiting-${transition}` : ''}`}
      >
        <Outlet />
      </main>
      {!isScene && (
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Elodie Wu</span>
          <span className="system-status"><i /> Static system online</span>
        </footer>
      )}
    </div>
  )
}
