# Privika Child Development Center — Supabase-backed admin build

This version replaces the browser-local editor with a Supabase email/password login and persistent `site_content` record.

## Files
- `src/main.jsx` — public SPA and `/admin` login/editor
- `src/style.css` — responsive styling
- `public/privika-logo.png` — supplied Privika Child Development Center logo
- `public/parent-guidance-inspiration.png` — supplied Initial Parent Consultation poster/inspiration image
- `netlify.toml` and `public/_redirects` — Netlify SPA route fallback
- `.env.example` — required environment variable names
- `supabase-followup.sql` — optional initial-content insert policy if the public site needs to seed the row

## Required Supabase schema
The app expects:
- `public.site_content(id integer primary key, content jsonb, updated_at timestamptz)`
- `public.admin_users(user_id uuid primary key references auth.users(id))`
- RLS enabled
- Public SELECT on `site_content`
- Authenticated UPDATE policy on `site_content` restricted to `admin_users`
- Authenticated SELECT on `admin_users` restricted to the current user's own row

Use the SQL previously provided to create the tables and policies. Ensure the admin user's UUID is inserted into `public.admin_users`.

## Netlify deployment
Build command: `npm run build`
Publish directory: `dist`

Set these in Netlify Site configuration → Environment variables:
- `VITE_SUPABASE_URL` = the Supabase Project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` = the Supabase publishable key (sb_publishable_...)

Do NOT put any secret/service-role key in frontend environment variables.

Then trigger a new deploy. Visit `/admin`, sign in with the Supabase Auth email/password user that is also in `admin_users`, edit content and Save. Public visitors read the saved JSON content.

## Important production notes
- Test login, logout, unauthorized account, public content read, admin update, and reload from a second browser.
- The app currently falls back to bundled starter content if Supabase content is missing or unavailable. Before production, initialize `site_content` id=1 with the content shown in the app, and verify policies.
- The supplied logo image says “PRIVIKA” while the requested center name is “Privika”; confirm spelling and use matching brand assets.
- Verify credentials, provider qualifications, locations and service claims before public launch.
- This build hasn't been deployed to your Netlify site; you must deploy it and set environment variables.


## Image refresh
The 22 service photographs have been upscaled and lightly sharpened for clearer display on modern screens. A responsive high-resolution services overview graphic is included above the individual service cards. The overview graphic is a visual summary; use the individual service titles and descriptions as the authoritative service information.
