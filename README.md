# Pinoy Arcade

A browser gaming platform inspired by Y8 focused on preserving and modernizing Filipino games.

Current game: **Sipa** — keep the ball in the air with well-timed kicks.
Future: Piko, Patintero, Tumbang Preso, Sungka, Chinese Garter, Jackstone.

## Monorepo layout

- `apps/portal` — Next.js portal that lists and hosts the games
- `games/sipa` — Phaser 3 Sipa game package
- `packages/shared` — shared types and the game registry
- `docs` — vision, design, and architecture docs

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000 and hit Play on Sipa.

## Controls

- Move: arrow keys or A/D
- Jump: ↑ or W
- Kick: SPACE (when close to the ball)

## Scripts

- `pnpm dev` — run the portal in dev mode
- `pnpm build` — build all packages
- `pnpm typecheck` — strict TypeScript check across the workspace
