# Project structure

The application has one runtime entry graph rooted at `src/main.tsx`.

- `app` owns routes, the persistent layout, navigation, and background prefetching.
- `pages` owns page content and page-local styles.
- `features` owns self-contained behavior such as Snake and ambient audio.
- `components` contains shared visual building blocks.
- `shared` contains framework-independent utilities.
- `styles` contains only reset, tokens, and genuinely global rules.

`scripts/check-architecture.mjs` verifies that runtime TypeScript and CSS files are reachable, imports resolve, cycles are absent, and configured public assets exist. Current deployment images live in `public/assets`; only the latest high-resolution source scenes are retained under `design/prototypes`.
