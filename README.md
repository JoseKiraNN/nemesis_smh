# nemesis_smh

An interactive explainer for the **Nemesis System** in video games (the
mechanic from *Middle-earth: Shadow of Mordor / Shadow of War*), with a
playable demo where the enemy actually remembers what you did.

Built with Next.js (App Router) + TypeScript. No backend — your nemesis is
persisted in `localStorage`, so each visitor gets their own evolving enemy.
Drop-in deployable to Vercel.

## Features

- **Landing page** explaining what the Nemesis System is and why it mattered.
- **Demo arena** (`/demo`) where you face a single procedurally-generated
  enemy.
- The enemy **remembers** across encounters:
  - If you used fire, they may grow Fire Resistant.
  - If you fled, they become Vengeful and taunt you next time.
  - If you killed them, they may "cheat death" and return scarred (Burned,
    One-Eyed, Limping, Cracked Skull, Missing Arm).
  - If you spared them, they hold a grudge.
  - If they killed you, they get **promoted**: higher rank, more HP, new
    traits.
- **Successor** logic: if a nemesis truly dies, a new one rises inheriting
  some rank.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [vercel.com/new](https://vercel.com/new).
3. Accept the defaults (Vercel auto-detects Next.js). No environment
   variables required.

## Project layout

- [app/page.tsx](app/page.tsx) — landing / explainer page.
- [app/demo/page.tsx](app/demo/page.tsx) — interactive battle UI.
- [lib/nemesis.ts](lib/nemesis.ts) — the nemesis engine: generation, combat,
  memory, scars, promotion and successor logic.
- [app/globals.css](app/globals.css) — styling.

## Notes

This is a learning demo. It is **not** affiliated with Monolith Productions
or WB Games. The original Nemesis System is patented by Warner Bros.; this
project is a small educational reimagining of the same idea.

