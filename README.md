# Indah Puri menu

The restaurant menu and outlet information for Indah Puri Golf Resort, as a Vue site for guests'
phones, with an admin at `/admin` where staff change the menu, prices and opening hours.

```
guests' phones ──read──▶ Supabase (Postgres + Auth) ◀──read/write── /admin (staff sign in)
```

The menu lives in Supabase. Guests read it with the public anon key; row level security lets them
see only what is shown, and lets only the logins listed in `menu_admins` change anything.

## Setting up Supabase

1. Create a Supabase project.
2. In its SQL editor, run the files in `supabase/migrations/` in order: `0001_menu.sql`,
   `0002_menu_seed.sql`, `0003_item_sold_out.sql`. The seed fills in the menu as it stood before
   the move (214 items in 18 sections), the outlet and its hours. All are safe to run again; the
   seed never overwrites a change made in the admin. When a new file is added later, run just that
   one.
3. **Authentication → Sign In / Providers**: turn off "Allow new users to sign up". Admins are
   invited, never self-registered. (Even with sign-ups on, a new login could not edit anything,
   but there is no reason to allow them.)
4. **Authentication → Users → Add user**: create a login for each person who will edit the menu.
5. Make each of them an admin, in the SQL editor:

   ```sql
   insert into public.menu_admins (user_id)
   select id from auth.users where email = 'name@example.com';
   ```

   To take access away: `delete from public.menu_admins where user_id = (select id from auth.users where email = '…');`

6. Copy **Project Settings → API**: the project URL and the anon (or publishable) key into `.env`
   locally, and into the Vercel project's environment variables:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=…
   ```

   Both end up in the browser by design. Never put the `service_role` key in a `VITE_` variable.

Without these two settings the site still runs, on the bundled copy of the menu in
`src/data/bundled-menu.js`, which is handy for local work. The admin then explains that Supabase is
not set up.

## The admin

`/admin` signs in with email and password and offers:

- **Menu Items**: every item with its price, section and status. Search, filter by section or
  status, add, edit, hide, delete. The **Available** switch marks an item sold out in one tap:
  guests still see it, greyed out and labelled "Sold out", until it is switched back. (Hiding an
  item, in its edit dialog, takes it off the menu altogether.) Picking one section lets you change the order of its items.
  An item can be listed under "Most ordered" by giving it a position; use real sales figures.
- **Setup → Sections**: the headings (Food, Drinks, …) and the sections under them (Rice, Beer, …),
  with their English and Indonesian names, search words, order and visibility.
- **Setup → Outlet & Hours**: name, phone, address, Google Maps link and each day's hours.

It is drawn to match the finance app (finance-apps), so staff who use both find the same layout.

Changes show on guests' phones the next time they open the menu. A phone that has opened it
before shows its saved copy first and swaps in the fresh one as soon as it arrives.

## Development

```sh
npm install
npm run dev        # http://localhost:5173, /admin for the admin
npm run test:unit  # menu building, search, and the database rules (in-process Postgres)
npm run lint
npm run build
```

`supabase/tests/menu-database.spec.js` applies the migrations to an in-process Postgres (PGlite)
and checks who may read and change what. Run it after any change to the migrations.

The `server/` folder is the old MySQL API from before Supabase. Nothing uses it any more.
