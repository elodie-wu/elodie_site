import { Link, NavLink } from 'react-router-dom'
import { navigationItems, siteConfig } from '../../config/site'
import { BackgroundAudio } from '../../features/background-audio/BackgroundAudio'
import { assetUrl } from '../../shared/lib/assetUrl'
import './site-header.css'

export function SiteHeader({ isScene }: { readonly isScene: boolean }) {
  return (
    <header className={`site-header${isScene ? ' site-header-scene' : ''}`}>
      <Link to="/" className="brand" aria-label="Elodie Wu home">
        <img className="brand-logo" src={assetUrl(siteConfig.logo)} alt="" />
      </Link>
      <nav aria-label="Primary navigation" className="nav-shell">
        <BackgroundAudio />
        {navigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
