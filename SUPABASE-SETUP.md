# Supabase Setup — ESKALATOR Academy

## Step 1: Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in / create a free account
2. Click **New Project**
3. Name it `eskalator-academy`, choose a region closest to Indonesia (e.g. Singapore)
4. Set a database password (save it somewhere safe)
5. Wait ~2 minutes for the project to provision

---

## Step 2: Create the `progress` table

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
create table public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  completed text[] not null default '{}',
  hints_used jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Only the owner can read/write their own row
alter table public.progress enable row level security;

create policy "Users can read own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update
  using (auth.uid() = user_id);
```

---

## Step 3: Get your API keys

In the Supabase dashboard, go to **Project Settings → API**.

Copy:
- **Project URL** — looks like `https://abcdefgh.supabase.co`
- **anon / public key** — the long `eyJ...` string under "Project API keys"

---

## Step 4: Add keys to the project

Create `.env.local` in the `eskalator-academy/` folder:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Do **not** commit `.env.local` — it's already in `.gitignore`.

---

## Step 5: Add keys to Vercel (for production)

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy (push any commit, or click **Redeploy** in Vercel)

---

## Step 6: Configure Auth settings (optional but recommended)

In Supabase → **Authentication → Settings**:

- **Site URL**: set to your Vercel production URL (e.g. `https://eskalator-academy.vercel.app`)
- **Redirect URLs**: add your Vercel URL + `http://localhost:3000`
- **Email confirmations**: you can **disable** "Confirm email" for a simpler student experience (they can log in right after registering without checking email)

To disable email confirmation: **Authentication → Settings → Email** → uncheck "Enable email confirmations"

---

## How it works

| Action | Behavior |
|---|---|
| Register | Creates account in Supabase Auth, no email confirmation needed if disabled |
| Login | Authenticates, fetches progress row from DB, loads into Zustand store |
| Complete mission | Zustand updates, `ProgressSync` upserts the row to Supabase |
| Switch device | Login → fetches latest progress from DB → continues where left off |
| Logout | Clears local Zustand state, redirects to `/login` |

Progress is synced whenever `xp`, `completed`, or `hintsUsed` changes in the Zustand store.
