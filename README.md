# Wells Fargo mobile demo

Static HTML/CSS/JS bank demo backed by Supabase. Customers sign in on the mobile pages; admins manage profiles at `/admin/`.

## Quick start

1. Apply SQL (linked CLI project):

```bash
supabase db push
```

2. Set env vars (never commit real keys):

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

On **Vercel**: Project → Settings → Environment Variables → add both for Production (and Preview if needed).

Locally: copy `.env.example` to `.env`, then run `vercel dev` (API routes need Vercel).

3. Open:
   - Bank login: `/index.html`
   - Admin: `/admin/`

The browser talks only to `/api/rpc` and `/api/upload-avatar`. Supabase URL/anon key stay on the server.

## Demo logins

| Customer | Username | Password |
|----------|----------|----------|
| Melissa Santiago | `Santiago1994` | `Santiamelissa2020$` |
| Lynda Karen Jack | `Lyndakaren399` | `Passcode123$` |
| Vivian Jasmine Yu | `Vivian1997@` | `Vivian$1997` |

Admin credentials and deeper setup notes: see [`ADMIN.md`](ADMIN.md).

## Seed / migrate customers (optional / recovery only)

Demo customers already live in Supabase. Re-import only if you need to restore them:

- **CLI (photos + history):** `node scripts/migrate-to-db.mjs`
- **CLI (JSON only):** `SUPABASE_ANON_KEY=... node scripts/seed-customers.mjs`

## Deploy checklist

- [ ] Vercel env has `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Production)
- [ ] All migrations applied (`supabase migration list` shows Local = Remote)
- [ ] `avatars` storage bucket is public (photos)
- [ ] Smoke-test: login, admin save, customer dashboard refresh (~3s in proxy mode)
- [ ] Smoke-test: transfer appends a History row; restricted users stay pending
- [ ] Do **not** put service_role or DB password in the frontend or git

## Architecture notes

- Customer login RPC: `authenticate_bank_user`
- Live refresh RPC: `get_bank_customer`
- Presence heartbeat: `bank_user_heartbeat` (online / last seen / user agent)
- Transfers: `bank_user_record_transfer` appends `history_extras` (and adjusts balances when not restricted)
- Admin CRUD uses token RPCs (`admin_login`, `admin_list_customers`, `admin_upsert_customer`, …)
- Direct table access is blocked by RLS; the anon key + RPCs are the trust boundary for this demo
