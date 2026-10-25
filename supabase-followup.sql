-- Run this in Supabase SQL Editor AFTER the site_content/admin_users tables already exist.
-- It allows the website to seed its initial public content once, while keeping updates admin-only.
-- Existing admin policies from the prior setup are preserved.

grant insert on public.site_content to anon, authenticated;

create policy "Public can insert initial content only when empty"
on public.site_content
for insert
to anon, authenticated
with check (
  id = 1
  and content <> '{}'::jsonb
  and not exists (select 1 from public.site_content as existing where existing.id = 1)
);

-- The app's admin list checks are permitted by the earlier admin_users SELECT policy.
-- Never add an INSERT/UPDATE policy for admin_users to anon or authenticated.
