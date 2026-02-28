# My Awesome Bingo — Workspace Instructions

## Mandatory Checklist
Run **all three** before committing. Every check must pass.
- [ ] `npm run lint` — ESLint (no warnings/errors)
- [ ] `npm run build` — TypeScript type-check + Vite production build
- [ ] `npm run test` — Vitest (single run)

## Stack
React 19 · TypeScript 5.9 (strict, `verbatimModuleSyntax`) · Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme`) · Vite 7 · Vitest 4 + Testing Library · ESLint 9 flat config

## Project Layout
`src/components/` PascalCase, named exports, `ComponentNameProps` interface · `src/hooks/` custom hooks (`useBingoGame`) · `src/types/index.ts` all domain types · `src/utils/` pure functions + co-located `*.test.ts` · `src/data/questions.ts` 24+ prompts

## Key Rules
- Functional components only; named exports (except `App.tsx`).
- `import type` for type-only imports; `interface` for objects, `type` for unions.
- Tailwind v4: tokens in `@theme { }` in `src/index.css`; use `bg-black/50` not `bg-opacity-*`; no `@apply`; no `tailwind.config.js`.
- State via hooks (`useState`/`useCallback`/`useMemo`); prop-drill, no context/state libs.
- Tests: Vitest globals (`describe`/`it`/`expect`); logic in `utils/`, components via Testing Library.
- Keep components < ~80 lines; `function` declarations for components, `const` arrows for utilities.

## Game Logic
5×5 board (`BingoSquareData[25]`), center index 12 = free space. Pure functions in `src/utils/bingoLogic.ts`: `generateBoard`, `toggleSquare`, `checkBingo`, `getWinningSquareIds`. State persisted to `localStorage` (`'bingo-game-state'`). States: `'start' | 'playing' | 'bingo'`.

## Design Guide — Retro Terminal Green
- **Theme**: CRT phosphor terminal aesthetic. Dark backgrounds (`#0a0a0a` / `#111111`), bright phosphor green (`#33ff00`) as primary, dim green (`#1a8a00`) for secondary text, amber (`#ffcc00`) for bingo/winning highlights.
- **Fonts**: `VT323` (body/game text) + `Share Tech Mono` (headings/labels). Loaded via Google Fonts in `index.html`. Mapped to `--font-terminal` and `--font-terminal-heading` theme tokens.
- **Color tokens** (in `@theme`): `terminal-green`, `terminal-dim`, `terminal-dark`, `terminal-bg`, `terminal-surface`, `marked`, `marked-border`, `bingo`, `accent`, `accent-light`.
- **CRT effects** (in `src/index.css`): Scanline overlay on `#root::after` (repeating-linear-gradient), `@keyframes` for `flicker`, `blink`, `glowPulse`, `typeIn`, `screenOn`.
- **Visual conventions**: No rounded corners (sharp/square edges). ASCII-style markers (`[X]` for checked, `>` for prompts, `***` for banners). Green `text-shadow` glow on primary elements. Terminal comment syntax (`// ...`) for instructional text.
- **Buttons**: Inverted green (`bg-terminal-green text-terminal-bg`) with hover glow (`box-shadow: 0 0 20px #33ff00`). Labels in `UPPER_SNAKE_CASE` with `>` prefix.
- **Board squares**: Dim green on dark surface (default), bright green with glow (marked), amber pulsing glow (winning). 1px grid gaps for terminal-cell look.
- **Modal overlay**: Heavy dimming (`bg-black/80`), green-bordered card with large glow shadow, `typeIn` animation on appearance.
- Keep all new UI consistent with this aesthetic. No emojis in UI — use ASCII/text art instead.

## Deployment
GitHub Pages via `.github/workflows/deploy.yml`; base path from `VITE_REPO_NAME` env var.
