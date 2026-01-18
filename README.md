# EnrollHire

## Pilot v1 — Stable (Locked)
This version is stable and being used for pilot testing.
Do not change core logic during the pilot window.

# EnrollHire Pilot v1 — Deploy Ready (v2)

This version fixes a common TypeScript build issue by importing `ReactNode`
properly in `app/layout.tsx` (avoids "Cannot find namespace 'React'").

## Local run
```bash
npm install
npm run dev
```

## Vercel deploy
- Framework preset: Next.js
- Root directory: ./
