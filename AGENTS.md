# AGENTS.md — AI Coding Agent Instruction Manual

## 1. Project Overview & Architecture
**Qelora** is a full-stack spatial knowledge graph and concept synthesis application.
- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Motion (`motion/react`)
- **Backend**: Express 4 with TypeScript (`server.ts` executed via `tsx` in dev and bundled to `dist/server.cjs` via `esbuild` for production)
- **Port Requirement**: Dev and production servers **MUST** listen on `0.0.0.0:3000`.
- **API Security**: All external API keys (e.g. `GEMINI_API_KEY`) are handled server-side in `server.ts` and proxy requests via `/api/*` endpoints.

---

## 2. Directory Structure

```text
.
├── server.ts                  # Express server entry point (Vite middleware in dev, static in prod)
├── index.html                 # Main HTML entry template
├── metadata.json              # Platform application metadata & major capabilities
├── package.json               # Dependencies and npm script lifecycle
├── vite.config.ts             # Vite configuration with Tailwind CSS plugin
├── tsconfig.json              # TypeScript compilation rules
├── eslint.config.js           # ESLint flat configuration file
├── Dockerfile                 # Multi-stage production container setup
├── docker-compose.yml         # Container runtime orchestration
├── .dockerignore              # Exclusions from Docker context
├── .github/workflows/         # CI automation setup
│   └── lint.yml               # Automated workflow running tsc and eslint on check-ins
├── src/
│   ├── main.tsx               # React DOM root entry point
│   ├── App.tsx                # Main canvas container, panning/zooming, node layout state
│   ├── types.ts               # Shared TypeScript interfaces, types, and enums
│   ├── index.css              # Global styles, fonts, dot grid, and Tailwind imports
│   ├── serverFallback.ts      # Resilient semantic fallback generator & vector SVG creator
│   └── components/
│       ├── NodeCard.tsx       # Individual knowledge node (tabs: Insight, Diagram, Audio)
│       ├── BreadcrumbTrail.tsx# Interactive lineage trail navigation bar at top of screen
│       ├── ConnectingLines.tsx# SVG dynamic bezier relationship connections with mode badges
│       ├── Minimap.tsx        # Spatial radar minimap with viewport frustum tracker
│       ├── DiagramViewer.tsx  # Structured causal/component mechanism flowchart component
│       ├── AudioBriefing.tsx  # Neural TTS audio player with animated waveform
│       ├── SynthesisModal.tsx # Cross-disciplinary node fusion modal dialog
│       └── ExportModal.tsx    # Markdown research report & JSON project exporter
```

---

## 3. Build & Run Commands

### Development
```bash
npm run dev
```

### Production Build & Launch
```bash
npm run build

npm start
```

### Docker Build & Launch
```bash
# Build and launch using Docker Compose
docker compose up -d --build

# Run with raw Docker CLI
docker build -t qelora .
docker run -p 3000:3000 --env-file .env qelora
```

### Verification & Linting
```bash
# Performs TypeScript type-checking and ESLint syntax/rule verification
npm run lint
```

---

## 4. Code Style & Engineering Rules

### 4.1 TypeScript & Modularity
- **Strict Typing**: Use explicit interfaces and types from `src/types.ts`. Never use `any` unless explicitly wrapping untyped external boundaries.
- **Top-Level Named Imports**: Place all imports at the top of the file. Use named imports (e.g. `import { useState } from 'react'`).
- **Icons**: Always import icons from `lucide-react`. Do not create raw SVG icon duplicates.
- **Animation**: Use `motion` imported from `motion/react`.

### 4.2 Tailwind CSS & Styling Guidelines
- Use Tailwind utility classes directly in `className`.
- Styling is configured via `@import "tailwindcss";` in `src/index.css`.
- Avoid arbitrary inline CSS `style={{ ... }}` unless calculating dynamic coordinate positions (`transform`, `left`, `top`, `width`).
- Respect mathematical nested border-radius logic (`Inner Radius = Outer Radius - Padding`).
- Maintain high contrast and WCAG AA compliance (slate neutrals, distinct perspective color tokens).

### 4.3 Full-Stack Server Constraints
- Never expose API keys or secrets to the client (no `VITE_` prefix for secrets).
- In `server.ts`, mount API routes **before** Vite or static asset middlewares.
- Always include robust fallback error handling on Gemini API calls to ensure zero UI crashes.

### 4.4 HTML Element IDs
- Add unique `id` attributes to interactive landmark elements (buttons, modals, canvas areas) for testing and accessibility targets.

### 4.5 Linting & CI Standards
- **Zero Errors Policy**: All code modifications must keep the lint check (`npm run lint`) at **0 errors**. Fix all style violations (`prefer-const`, escaping double quotes in JSX) immediately.
- **Actions Sync**: Do not disable or break the `.github/workflows/lint.yml` CI checking flow on check-in.
