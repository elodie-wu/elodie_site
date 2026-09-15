# ElodieWu

My personal corner of the internet — a cyberpunk tavern for projects, experiments, notes, and small games.

[Visit the website](https://elodiewu.com)

## Current Features

- Responsive, pixel-art cyberpunk scenes with neon effects and ambient rain audio
- Home / Work / Play / Logs / About navigation with scroll-based scene transitions
- Neon Snake, with keyboard controls, automatic pausing, and session restoration when switching pages
- An About page featuring my background, projects, interests, and social links
- Static deployment to GitHub Pages through GitHub Actions
- Versioned WebP backgrounds, a high-priority homepage preload, and idle prefetching of the next scene

Work and Logs currently display placeholder content. Snake sessions are kept in memory and reset on a browser refresh.

## Tech Stack

- React + React Router
- TypeScript
- Vite
- Plain CSS with shared design tokens and page/component styles
- SonyCam Original pixel font
- Vitest
- pnpm
- GitHub Actions + GitHub Pages

## Local Development

Use Node.js 22 and pnpm 11.22.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the address printed by the development server.

```sh
pnpm check    # Type checks, unit tests, and architecture checks
pnpm build    # Generate the production site in dist/
pnpm preview  # Preview the production build locally
```

Background PNG originals are retained in `public/assets/`. Run `pnpm optimize:backgrounds` to generate high-quality WebP copies with content-hashed filenames. If generated names change, update `src/config/site.ts` and the homepage preload in `index.html`. Image conversion is a development task, not part of every production build.

Next-scene prefetch waits for the current background to load and is skipped when the browser reports data-saving mode or a 2G connection. Browser HTTP caching still follows the hosting server's cache headers; no service worker is installed.

## Future Work

- Expand Work into project pages with dates, tags, and search
- Turn Logs into a website changelog and technical blog
- Improve game interactions, animations, and mobile controls
- Explore bringing Shell Stack back alongside Snake
- Build a .NET backend for content and admin management
- Add a database, authentication, and comments
- Explore Azure hosting, backend CI/CD, and monitoring
- Add an online game leaderboard

## Notes

This version is a static frontend. Backend services, a database, authentication, an admin dashboard, and an online leaderboard are not implemented yet.

Built by one human and several very opinionated AI agents.

## Deployment

The GitHub Pages workflow runs checks, builds the site, and deploys `dist/` on pushes to `main`. The custom domain is configured as [elodiewu.com](https://elodiewu.com).
