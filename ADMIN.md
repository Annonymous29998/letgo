# Admin dashboard + Supabase setup

Customer profiles (including Melissa, Lynda, and Vivian) live in Supabase `bank_customers`.  
Photos are stored in the public `avatars` bucket. The bank app logs in only through the database.

## Status (Wells project)

Linked project: **Wells** (`htrngcwdplmuhntfhdgl`)  
Config: server env `SUPABASE_URL` + `SUPABASE_ANON_KEY` (Vercel). Frontend uses `/api/rpc` proxy — keys are not in `js/supabase-config.js`.

**Admin login**

- Username: `admin@wells.com`
- Password: `Odusanya2020$`

### One-time migrate (local JSON → database)

If you need to re-import the three demo customers + photos into Supabase:

```bash
node scripts/migrate-to-db.mjs
```

Demo logins (stored in the database after migrate):

| Name | Username | Password |
|------|----------|----------|
| Melissa Santiago | `Santiago1994` | `Santiamelissa2020$` |
| Lynda Karen Jack | `Lyndakaren399` | `Passcode123$` |
| Vivian Jasmine Yu | `Vivian1997@` | `Vivian$1997` |

## Admin dashboard

Open `/admin/`:

- **Overview** — customer counts
- **Customers** — list / edit / delete (passwords visible to admin)
- **Edit Customer** — credentials, photo, balances, auto history from Since year

## Bank app behavior

- Login uses `authenticate_bank_user` and caches the full profile (including photo URL + history) in `localStorage`.
- While logged in, the app refreshes from `get_bank_customer` about every 12s (and on tab focus) so admin edits appear without re-login.
- Transfers call `bank_user_record_transfer` so attempts show in History (pending when restricted).
- There is no local hardcoded user list in `app.js`.
- Deploy with `js/supabase-config.js` present so production uses the same Supabase project.
- Prefer the root [`README.md`](README.md) deploy checklist for hosting.

## Notes

- Profile photos use public Supabase Storage URLs so they work after deploy.
- Do not push until you are ready.
