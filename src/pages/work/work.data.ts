export interface WorkProject {
  readonly id: string
  readonly title: string
  readonly type: string
  readonly description: string
  readonly tags: readonly string[]
  readonly image: string
  readonly imageAlt: string
  readonly href: string
}

export const workProjects: readonly WorkProject[] = [
  {
    id: 'aquaculture-ai',
    title: 'AI Aquaculture Research Demos',
    type: 'AI / Computer Vision',
    description:
      'A research collection spanning water-quality anomaly detection, salmon health classification with Grad-CAM, and sea-turtle detection with YOLO.',
    tags: ['Python', 'PyTorch', 'YOLO', 'Grad-CAM'],
    image: 'assets/projects/aquaculture-sea-turtle.webp',
    imageAlt: 'A sea turtle detected by a computer-vision model with a confidence score',
    href: 'https://github.com/elodie-wu/ai-aquaculture-research-demos',
  },
  {
    id: 'personal-website',
    title: 'ElodieWu.com',
    type: 'Design / Frontend',
    description:
      'A personal corner of the internet for projects, field notes, experiments, and playful interactive worlds.',
    tags: ['React', 'TypeScript', 'Vite', 'Motion'],
    image: 'assets/home/home-bunny-crt-hd.webp',
    imageAlt: 'A plush rabbit sitting beside a glowing CRT in a field at night',
    href: 'https://github.com/elodie-wu/elodie_site',
  },
  {
    id: 'stock-prediction',
    title: 'Stock Prediction & RL Trading',
    type: 'Machine Learning',
    description:
      'An exploration of stock-price prediction with supervised learning and a compact Q-learning trading agent.',
    tags: ['Python', 'ML', 'Q-Learning', 'Data'],
    image: 'assets/projects/stock-trading-comparison.webp',
    imageAlt: 'A chart comparing reinforcement-learning, buy-and-hold, and random trading strategies',
    href: 'https://github.com/elodie-wu/ai-stock-price-prediction',
  },
]
