/** Site-specific content and assets. Paths are relative to public/. */
export const siteConfig = {
  name: 'Elodie Wu',
  logo: 'assets/home/logo-ew.png',
  backgroundAudio: 'assets/audio/rain.mp4',
  backgrounds: {
    home: 'assets/home/home-bg.png',
    work: 'assets/pages/work-bg-v2.png',
    play: 'assets/pages/play-bg.png',
    logs: 'assets/pages/logs-bg-v2.png',
    about: 'assets/pages/about-bg-v2.png',
  },
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/elodie-wu' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/elodie-wu' },
  ],
} as const

/** One source for page paths, navigation labels, and scene order. */
export const pageRoutes = [
  { id: 'home', path: '/', label: 'Home', scene: true, inNavigation: false },
  { id: 'work', path: '/work', label: 'Work', scene: true, inNavigation: true },
  { id: 'play', path: '/play', label: 'Play', scene: true, inNavigation: true },
  { id: 'logs', path: '/logs', label: 'Logs', scene: true, inNavigation: true },
  { id: 'about', path: '/about', label: 'About', scene: true, inNavigation: true },
  { id: 'architecture', path: '/architecture', label: 'Architecture', scene: false, inNavigation: false },
] as const

export type PageId = (typeof pageRoutes)[number]['id']
export const navigationItems = pageRoutes.filter((route) => route.inNavigation)
export const scenePaths: readonly string[] = pageRoutes.filter((route) => route.scene).map((route) => route.path)
