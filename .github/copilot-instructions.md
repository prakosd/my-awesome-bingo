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

## Deployment
GitHub Pages via `.github/workflows/deploy.yml`; base path from `VITE_REPO_NAME` env var.
