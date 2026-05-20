# Deploy StockFlow to Vercel + Neon

## Part 1 — Neon (database)

1. Go to [https://neon.tech](https://neon.tech) and sign up (GitHub login is fine).
2. **New Project** → name: `stockflow-mvp` → region closest to you → **Create**.
3. On the project dashboard, open **Connect**.
4. Copy the **Pooled connection** string (important for Vercel serverless).  
   It looks like:
   ```
   postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```
5. Keep this tab open — you will paste it into Vercel.

### Apply database schema (one time)

On your Mac, with the Neon URL in `.env`:

```bash
cd /Users/ravi/stockflow-mvp
# Edit .env and set DATABASE_URL to your Neon pooled connection string
npx prisma migrate deploy
```

---

## Part 2 — JWT secret

In Terminal:

```bash
openssl rand -base64 32
```

Copy the output — this is your `JWT_SECRET`.

---

## Part 3 — Vercel (hosting)

1. Go to [https://vercel.com](https://vercel.com) → sign up / log in with **GitHub**.
2. **Add New…** → **Project**.
3. Import **`tejamannam45/stockflow-mvp`**.
4. **Framework Preset:** Next.js (auto-detected).
5. **Environment Variables** — add both:

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Neon **pooled** connection string |
   | `JWT_SECRET` | Output from `openssl rand -base64 32` |

   Apply to: **Production**, **Preview**, and **Development**.

6. Click **Deploy** (wait ~2–3 minutes).

7. Copy your live URL, e.g. `https://stockflow-mvp.vercel.app`.

---

## Part 4 — Test live app

1. Open your Vercel URL.
2. **Sign up** with a new email (production DB is empty).
3. Add products → check dashboard → settings.

---

## Part 5 — Update GitHub README

```bash
cd /Users/ravi/stockflow-mvp
# Edit README.md → set Live URL to your Vercel link
git add README.md DEPLOY.md prisma/
git commit -m "chore: PostgreSQL migrations for Vercel deploy"
git push origin main
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set in Vercel env vars |
| `migrate deploy` fails | Run `npx prisma migrate deploy` locally with Neon URL first |
| Login works locally but not live | Use a **new** signup on live (different database) |
| 500 on API routes | Check Vercel **Logs** → Functions; verify `JWT_SECRET` is set |

---

## Email Wexa (final)

**Live demo:** `https://your-app.vercel.app`  
**GitHub:** https://github.com/tejamannam45/stockflow-mvp
