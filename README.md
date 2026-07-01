# Flux Mobile App

A cosmetic frontend prototype for **Flux** — a wearable patch companion app that turns physiology signals into practical supplement and hydration plans using your real pantry inventory.

## Pages

| Tab | Description |
|-----|-------------|
| **Today** | Readiness score, BioBase patch status, predicted limiter, next workout, quick pack plan |
| **Workout** | Upcoming session details, pack/timing plans; live view with sensor data and Next Move when started |
| **Dashboard** | Sensor charts (lactate, sweat, temp, SpO₂), workout history, monthly reports |
| **Pantry** | Medicine-cabinet UI with shelves, quantity controls, manual add, intake logs, issue reporting |
| **Profile** | Medical conditions, athlete profile, account & billing |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — best viewed in a mobile viewport (375×812) or device emulator.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide icons

No backend or database — all state is in-memory with mock data.
