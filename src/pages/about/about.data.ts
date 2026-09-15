export const profile = {
  greeting: "Hi, I'm Di",
  role: '.NET backend developer who somehow wandered into AI.',
  description:
    "I'm studying Computer Science in Wellington and building things with Python, PyTorch, YOLO, React, and cloud technologies.",
  facts: [
    { icon: '💻', text: 'Mostly backend / full-stack' },
    { icon: '🤖', text: 'Deep into AI, ML, and computer vision' },
    { icon: '🐟', text: 'Building aquaculture and fisheries AI demos' },
    { icon: '☁️', text: 'Learning Azure and cloud deployment' },
    { icon: '🎮', text: 'Occasionally distracted by Apex' },
  ],
} as const

interface AboutProject {
  readonly icon: string
  readonly title: string
  readonly description: string
  readonly href: string
  readonly linkLabel: string
}

export const projects: readonly AboutProject[] = [
  {
    icon: '🐟',
    title: 'AI Aquaculture Research Demos',
    description:
      'Water-quality anomaly detection, salmon health classification with CNN + Grad-CAM, and sea turtle detection with YOLO.',
    href: 'https://github.com/elodie-wu/ai-aquaculture-research-demos',
    linkLabel: 'View repository',
  },
  {
    icon: '🌐',
    title: 'Personal Website',
    description:
      'A React + .NET portfolio website with backend and admin features — the little corner of the internet you are visiting now.',
    href: 'https://www.elodiewu.com',
    linkLabel: 'View website',
  },
  {
    icon: '📈',
    title: 'Stock Prediction & RL Trading',
    description:
      'Exploring stock-price prediction with supervised learning and a simple Q-learning trading agent.',
    href: 'https://github.com/elodie-wu/ai-stock-price-prediction',
    linkLabel: 'View repository',
  },
]

export const tech = [
  'C#',
  '.NET',
  'ASP.NET Core',
  'PostgreSQL',
  'RabbitMQ',
  'Python',
  'PyTorch',
  'Scikit-learn',
  'YOLO',
  'Docker',
  'React',
  'Azure',
]

export const learning = [
  'Computer Vision',
  'Deep Learning',
  'Evolutionary Computation',
  'React',
  'Azure',
]
