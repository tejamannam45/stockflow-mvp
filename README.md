# StockFlow MVP

Multi-tenant SaaS inventory management app built for the Wexa AI Full Stack Developer assessment.

**Stack:** Next.js 15 (App Router) · Node.js API routes · Prisma · SQLite (local) / PostgreSQL (production) · JWT sessions (httpOnly cookie)

## Features

- Sign up / log in with email, password, and organization name
- Organization-scoped products (no cross-tenant data access)
- Product CRUD with SKU uniqueness per org
- Dashboard: total products, total units, low-stock table
- Settings: default low-stock threshold

## Quick start

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `file:./dev.db` for SQLite, or PostgreSQL URL in production |
| `JWT_SECRET` | Random secret (`openssl rand -base64 32`) |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run db:migrate` — run Prisma migrations

## Deployment

1. Create a PostgreSQL database (e.g. [Neon](https://neon.tech)).
2. Set `DATABASE_URL` and `JWT_SECRET` on your host (e.g. Vercel).
3. Deploy; `postinstall` runs `prisma generate`, and `build` runs migrations.

**Live URL:** _(add after deploy)_

## GitHub

Repository: https://github.com/tejamannam45/stockflow-mvp

## Assessment checklist

- [x] Signup creates Organization + User
- [x] Products scoped by organization
- [x] Dashboard summary + low stock
- [x] Product list with search
- [x] Settings for default threshold
- [ ] Deployed live URL
