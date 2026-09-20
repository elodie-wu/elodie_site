# 🌙 ElodieWu

A dreamcore portfolio built with React, TypeScript, and Vite.

[Visit the website](https://elodiewu.com)

## ✨ Features

- 🐇 Five responsive rabbit scenes: Home, Work, Play, Logs, and About
- 🪟 Paginated project and log views with translucent glass panels
- 🎮 A playable neon Snake game with keyboard controls and session restoration
- 🌠 Subtle stars, meteors, fireflies, and optional ambient music
- 🚀 Static deployment to GitHub Pages

## 🛠️ Development

Use Node.js 22 and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Useful checks:

```sh
pnpm check
pnpm build
pnpm preview
```

## 🗂️ Project layout

- `src/app/` — routing, layout, navigation, and scene transitions
- `src/pages/` — page-specific content and presentation
- `src/features/` — Snake and background-audio features
- `src/components/` — reusable scene and UI components
- `src/styles/` — reset, tokens, and global styles
- `public/assets/` — only assets used by the deployed website
- `design/prototypes/` — current high-resolution scene masters and their prompt notes

Runtime asset paths and page order are centralized in `src/config/site.ts`. The `public/` directory intentionally contains only deployable assets; replaced concepts and legacy games are not kept in the application repository.

## 🚀 Deployment

The GitHub Pages workflow runs checks and builds the site on pushes to `main`. The custom domain is configured by `public/CNAME`.
