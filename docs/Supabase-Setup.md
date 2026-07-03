# Supabase Setup — Cloud Auth & Data (A6)

This guide gets the Smart Habit Tracker running with Supabase authentication and
per-user cloud data. Without Supabase configured, the app still runs in
**local mode** (Gate 1 behaviour: no login, data in the browser's localStorage).

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. Choose a name, database password, and region. Wait for it to provision.

---

## 2. Run the SQL migration

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Open `supabase/migrations/0001_initial_schema.sql` from this repo, copy its
   **entire** contents, and paste into the editor.
3. Click **Run**. You should see "Success. No rows returned."

This creates four tables and turns on Row Level Security:

| Table           | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `profiles`      | one row per user (auto-created on signup)            |
| `habit_months`  | one row per user per sheet (`example`, `empty-template`), stores year/month |
| `habits`        | habit rows (name, position) under a month            |
| `habit_entries` | one row per **completed** day (presence = checked)   |

To confirm the tables exist: **Table Editor** → you should see all four.

---

## 3. Get your API keys

In the dashboard: **Settings → API**. Copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> The `anon` key is safe to expose in the browser — Row Level Security is what
> protects the data. **Never** put the `service_role` key in this app.

---

## 4. Set environment variables

**Locally** — create `.env.local` in the project root (copy from `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Restart `npm run dev` after adding them.

**On Vercel** — Project → **Settings → Environment Variables** → add the same
two variables (Production + Preview) → redeploy.

---

## 5. (Recommended) Turn off email confirmation for quick testing

By default Supabase requires email confirmation on signup. For fast local
testing: **Authentication → Providers → Email** → toggle **Confirm email** off.
(If you leave it on, the app shows a "check your email to confirm" message after
signup, which is expected.)

---

## 6. Test signup / login / persistence

1. `npm run dev`, open the app. With env vars set, you'll see the **login /
   signup** screen.
2. **Sign up** with an email + password. On first login the app seeds your
   account with the default habit data (or migrates any existing local data).
3. Toggle some checkboxes, add/rename/delete a habit, change the month. Each
   change updates instantly and syncs in the background (a tiny "Saving…" note
   may flash in the top bar).
4. **Refresh the page** → your changes are still there (loaded from Supabase).
5. **Log out and back in** → data persists.
6. **Open in a different browser / device**, log in with the same account →
   the same data appears.

### Verify the data landed in the database

Supabase dashboard → **Table Editor**:

- `habit_months` → 2 rows for your user.
- `habits` → your habit rows.
- `habit_entries` → one row per checked day.

---

## 7. Verify Row Level Security is working

RLS ensures a user can only ever see their own rows.

1. Create **two** accounts (User A and User B), each with different habit data.
2. In **Table Editor → habit_entries**, you'll see both users' rows (the
   dashboard uses the service context). But through the app, each user only
   ever loads their own data — confirmed by logging in as A vs B.
3. Programmatic check (optional): in **SQL Editor**, run
   ```sql
   select auth.uid();          -- null here (SQL editor is not an end user)
   select count(*) from public.habit_entries;
   ```
   Then, as a real signed-in user, the client's `select` only returns that
   user's rows because every policy is `using (auth.uid() = user_id)`.
4. Sanity test that RLS is enabled at all: **Table Editor** shows a shield/"RLS
   enabled" badge on all four tables. If a table shows "RLS disabled", re-run
   the migration.

---

## 8. How the app decides local vs cloud

- **No env vars** → local mode, no login (Gate 1). Data in localStorage.
- **Env vars set** → login required. Data in Supabase, scoped per user.
- **First cloud login** → existing localStorage data is migrated into the
  cloud; if there is none, default seed data is created.
- **Sync failures** → the change stays applied locally and the top bar shows a
  friendly "couldn't save — retry" message; the app stays fully usable.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Still see login screen after adding env vars | Restart the dev server; env vars load at boot. |
| "authentication isn't configured" | One or both env vars are missing/empty. |
| Signup says "check your email" | Email confirmation is on (see step 5). |
| Data doesn't persist | Confirm the migration ran and RLS policies exist; check the browser console/network tab for `401`/`permission denied` (usually a missing policy or wrong key). |
| `permission denied for table ...` | RLS is on but the policy is missing — re-run the migration. |
