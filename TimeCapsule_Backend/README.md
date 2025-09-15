# TimeCapsule Backend (Node.js / Express)

Create time-locked, encrypted messages (“capsules”) that can only be opened at or after a specified future time with the correct passphrase.

## Highlights

- AES-256-GCM encryption with passphrase (PBKDF2)
- File-backed store (`data/capsules.json`) with write queue
- REST API to create, list, view, unlock, update meta, and delete capsules
- Live Server-Sent Events stream to know when capsules become unlockable
- Health endpoint and production middlewares (`helmet`, `cors`, `morgan`)

## Requirements

- Node.js 18+ recommended

## Setup

```powershell
cd "c:\Users\mohdi\CODING\GIT HUB\Backend_Templates\TimeCapsule_Backend"
npm install
npm run dev
# or
npm start
```

Server runs at `http://localhost:4000` (configure via `PORT`).

## API

Base: `http://localhost:4000/api/capsules`

- POST `/` — create capsule
  - Body: `{ title: string, message: string, passphrase: string (>=6 chars), unlockAt: number (epoch ms), meta?: object }`
  - 201: `{ id, title, unlockAt, createdAt, meta }`

- GET `/` — list capsules
  - Query: `page`, `limit`, `status?` (`locked`|`unlocked`)
  - 200: `{ page, limit, total, totalPages, data: [...] }`

- GET `/:id` — get capsule (no secret)
  - 200: `{ id, title, unlockAt, createdAt, updatedAt, meta, status }`

- POST `/:id/unlock` — unlock and read message
  - Body: `{ passphrase: string }`
  - 200: `{ id, title, message, unlockedAt, meta }` | 401 if wrong passphrase | 423 if not yet unlocked

- PATCH `/:id/meta` — update metadata
  - Body: object
  - 200: `{ id, title, unlockAt, meta, updatedAt }`

- DELETE `/:id` — delete capsule
  - 204 on success | 404 if not found

### Events (SSE)

- GET `http://localhost:4000/api/events` — stream of `unlocked` events
  - Event: `unlocked` with `{ id, title, unlockAt }`
  - Example (browser):

```js
const es = new EventSource('http://localhost:4000/api/events');
es.addEventListener('unlocked', (e) => {
  const data = JSON.parse(e.data);
  console.log('Capsule unlocked:', data);
});
```

## Notes

- The store is file-based and durable across restarts, but not for heavy concurrency. For production, replace `src/models/capsules.store.js` with a DB.
- The message is only returned from the unlock endpoint when time has passed and passphrase is valid.
