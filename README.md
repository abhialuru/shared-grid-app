# 🟦 Capture the Grid

A real-time multiplayer territory game where players compete to claim cells on a shared grid. Click a cell to capture it — everyone sees it happen instantly.

**Live Demo:** [Frontend](https://capturegrid.vercel.app) · [Backend](https://shared-grid-app-qrnw.onrender.com)

---

## What is this?

Capture the Grid is a shared, persistent game board made up of 600 cells. Any number of players can join simultaneously, click cells to claim them, and watch the board update in real time across all connected browsers.

---

## Features

- **Real-time updates** — cell claims broadcast instantly to all connected users via Socket.io
- **Persistent state** — the board survives refreshes; all cell ownership is stored in PostgreSQL
- **Unique identity** — each player gets a username and a randomly assigned color
- **Cooldown system** — 3-second cooldown between claims, enforced on both frontend and backend
- **Live leaderboard** — ranked by cells owned, updates in real time
- **Conflict handling** — if two players click the same cell simultaneously, the server processes one at a time; first write wins
- **Returning users** — localStorage remembers your identity so you skip the join screen on revisit

---

## Tech Stack

| Layer      | Technology                           | Why                                                 |
| ---------- | ------------------------------------ | --------------------------------------------------- |
| Frontend   | Next.js 14, TypeScript, Tailwind CSS | App Router, fast rendering, type safety             |
| Backend    | Node.js, Express, TypeScript         | Lightweight, works well with Socket.io              |
| Real-time  | Socket.io                            | Handles WebSocket connections with fallback support |
| Database   | PostgreSQL (Supabase)                | Relational, reliable, free hosted tier              |
| ORM        | Prisma                               | Type-safe DB queries, easy schema management        |
| Deployment | Vercel (frontend) + Render (backend) | Free tiers, easy GitHub integration                 |

---

## How It Works

### Joining

```
User opens site → check localStorage
  Found?  → skip join screen → go to /game
  Not found? → show username form → POST /grid/join → save to localStorage → /game
```

### Claiming a Cell (Real-time Flow)

```
User clicks cell
      ↓
Frontend checks cooldown → emits socket event "claim_cell"
      ↓
Server checks cooldown → UPDATE cell in DB
      ↓
Server broadcasts "cell_claimed" to ALL connected clients
      ↓
Every browser updates that cell's color instantly
```

### Conflict Handling

Socket.io processes events sequentially per connection. If two users click the same cell simultaneously, the server handles one at a time, first write to the database wins. The losing user's grid updates automatically when the broadcast arrives.

---

## Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase free tier recommended)

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
DATABASE_URL="your_postgresql_connection_string"
PORT=5000
```

```bash
npx prisma db push       # create tables
npx prisma generate      # generate client
npm run seed             # seed 600 cells
npm run dev              # start server
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev              # start at localhost:3000
```

---

## Deployment

### Backend → Render

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm start`
- Environment variables: `DATABASE_URL`, `NODE_ENV=production`

### Frontend → Vercel

- Connect GitHub repo, select `frontend` as root directory
- Environment variable: `NEXT_PUBLIC_BACKEND_URL=https://your-render-url.onrender.com`

---

## Design Decisions & Tradeoffs

**Username as identity** — players are identified by username only, no passwords. localStorage handles returning users on the same browser. On a different device, re-entering the same username gives access back to the same account. For a production app, JWT auth would be the right call.

**Cooldown on both ends** — the frontend applies cooldown immediately for responsive UX; the backend enforces it authoritatively to prevent cheating. The server's decision always wins.

## **Desktop only** — the grid requires precise clicking and enough screen space. Rather than ship a broken mobile experience, the app shows a "please open on desktop" message on small screens. Zoom/pan support would be the right fix for a future version.
