# API Route Backend (Node.js / Express)

A minimal, production-ready Express REST API template with CRUD routes and in-memory storage.

## Features

- Express 4 with `helmet`, `cors`, `morgan`
- CRUD for `items` with pagination and search
- Input validation and consistent error handling
- Health endpoint at `/health`
- Zero-DB (in-memory) for quick prototyping

## Requirements

- Node.js 18+ recommended

## Setup

```powershell
# from the repository root
cd "c:\Users\mohdi\CODING\GIT HUB\Backend_Templates\API_ROUTE_BACKEND"

# install deps
npm install

# run in dev (auto-restart on change)
npm run dev

# or run normally
npm start
```

Server runs on `http://localhost:3000` by default, configurable via `PORT` env var.

## API Endpoints

Base path: `/api/items`

- `GET /api/items` — list items with pagination and optional `q` search
  - Query: `page` (number, default 1), `limit` (number, default 10), `q` (string)
  - 200: `{ page, limit, total, totalPages, data: Item[] }`

- `GET /api/items/:id` — get by id
  - 200: `Item`
  - 404: `{ message: 'Item not found' }`

- `POST /api/items` — create
  - Body: `{ name: string, description?: string }`
  - 201: `Item`

- `PUT /api/items/:id` — replace
  - Body: `{ name: string, description?: string }`
  - 200: `Item` | 404

- `PATCH /api/items/:id` — partial update
  - Body: `{ name?: string, description?: string }`
  - 200: `Item` | 404

- `DELETE /api/items/:id` — delete
  - 204 on success | 404

### Health

- `GET /health` — `{ status: 'ok', uptime: number }`

## Item shape

```ts
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
```

## Notes

- Data resets on server restart (in-memory Map). Swap `src/models/items.model.js` with DB-backed logic when ready.
- Add rate-limiting, request-id, and a logger for production.
