/** Site-specific content and assets. Paths are relative to public/. */
export const siteConfig = {
  name: 'Elodie Wu',
  logo: 'assets/home/logo-ew-ice.svg',
  backgroundAudio: 'assets/audio/rain.mp4',
  backgrounds: {
    home: 'assets/home/home-bunny-crt-hd.webp',
    work: 'assets/pages/work-bunny-coding.webp',
    play: 'assets/pages/play-bunny-gaming.webp',
    logs: 'assets/pages/logs-bunny-reading.webp',
    about: 'assets/pages/about-bunny-red-city-booth.webp',
  },
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/elodie-wu' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/elodie-wu' },
  ],
} as const

/** One source for page paths, navigation labels, and scene order. */
export const pageRoutes = [
  { id: 'home', path: '/', label: 'Home', scene: true, inNavigation: false, background: siteConfig.backgrounds.home },
  { id: 'work', path: '/work', label: 'Work', scene: true, inNavigation: true, background: siteConfig.backgrounds.work },
  { id: 'play', path: '/play', label: 'Play', scene: true, inNavigation: true, background: siteConfig.backgrounds.play },
  { id: 'logs', path: '/logs', label: 'Logs', scene: true, inNavigation: true, background: siteConfig.backgrounds.logs },
  { id: 'about', path: '/about', label: 'About', scene: true, inNavigation: true, background: siteConfig.backgrounds.about },
  { id: 'architecture', path: '/architecture', label: 'Architecture', scene: false, inNavigation: false },
] as const

export type PageId = (typeof pageRoutes)[number]['id']
export const navigationItems = pageRoutes.filter((route) => route.inNavigation)
export const scenePaths: readonly string[] = pageRoutes.filter((route) => route.scene).map((route) => route.path)
