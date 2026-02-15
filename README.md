# Event Management App

## Setup

```bash
git clone git@github.com:elkhayder/sec3-tp-dw.git && cd tp-dw
```

### Backend

```bash
cd backend
pnpm install
```

Create `backend/.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/events
```

Run migrations and generate Prisma client:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start:

```bash
pnpm dev          # development (tsx watch)
pnpm build && pnpm start  # production
```

Server runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Runs on `http://localhost:5173`, proxies `/api` to the backend.
