export interface SiteLog {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly date: string
  readonly intro: string
  readonly content: readonly string[]
}

export const siteLogs: readonly SiteLog[] = [
  {
    id: 'quiet-signal',
    title: 'A quieter signal',
    type: 'Design notes',
    date: '2026.09.19',
    intro: 'The site moves from neon tavern noise into a softer Y2K dreamscape led by a small rabbit and an old CRT.',
    content: [
      'The new visual system keeps the night-time atmosphere, but trades the old cyberpunk bar for open fields, dim bedrooms, books, games, and city phone booths.',
      'A single rabbit now connects every page. It is not a mascot pasted on top of the interface; it is the quiet protagonist moving through each part of the site.',
      'The interface follows the same rule: cool blue light, soft sage accents, translucent panels, and enough empty space for each scene to breathe.',
    ],
  },
  {
    id: 'architecture-pass',
    title: 'The site learned to breathe',
    type: 'Build log',
    date: '2026.09.16',
    intro: 'Large styles were split into page-owned modules and repeated navigation patterns became shared components.',
    content: [
      'The project structure now mirrors the way the site is understood: app shell, shared components, feature modules, and self-contained pages.',
      'Background images are compressed WebP assets and the next scene is prefetched before navigation. The visual result stays rich without making every visit feel heavy.',
      'The goal is not abstraction for its own sake. Each reusable piece exists because at least two pages genuinely need it.',
    ],
  },
  {
    id: 'snake-signal',
    title: 'Snake in the signal',
    type: 'Experiment',
    date: '2026.09.12',
    intro: 'The first playable experiment became a compact signal-grid game with keyboard controls and local scoring.',
    content: [
      'Neon Snake started as a playful break from portfolio pages. Its grid, status console, and tiny rules make it feel like a recovered program from the CRT.',
      'The game supports WASD and arrow keys, pauses cleanly, and keeps its logic separate from the page that presents it.',
      'Future experiments can share the same Play space without inheriting the snake engine itself.',
    ],
  },
  {
    id: 'first-transmission',
    title: 'First transmission',
    type: 'Release',
    date: '2026.09.01',
    intro: 'The static first version went online with Work, Play, Logs, and About as the four main signals.',
    content: [
      'V1 established the core route structure, the full-screen scene format, and the small sound control in the header.',
      'The site remains frontend-only for now. A .NET backend, writing workflow, and richer project pages can arrive later without changing the basic navigation model.',
      'This log marks the point where the site stopped being a mock-up and became a place that can keep growing.',
    ],
  },
]
