# Examensarbete-frontend

This folder contains the React + Vite frontend for the chess app.

## Prerequisites

- Node.js (v16 or later)

## Setup

1. Copy example env and set values:

```bash
cd frontend
copy .env.example .env   # Windows
# or
cp .env.example .env     # macOS / Linux
```

2. Install dependencies and run in development:

```bash
npm install
npm run dev
```

The frontend reads the backend URL from `VITE_BACKEND_URL`.

Example `.env`:

```
VITE_BACKEND_URL=http://localhost:3000
```

## Build & Production

```bash
npm run build
npm run preview
```
