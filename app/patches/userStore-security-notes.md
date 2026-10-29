# Legacy userStore safety notes

The current project uses a `players.password` value to check sign-in and calls `.select("*")` in more than one place. This is an unsafe legacy credential design.

Immediate mitigation while planning migration:

- Replace `.select("*")` in the players profile fetches with an explicit list of profile columns that excludes `password`.
- Do not return/store `password` in `UserProfile`, localStorage, API responses, or client state.
- Use Supabase Auth (`signInWithPassword`, `signUp`, reset-password flow) for credential verification.
- Once all current accounts are migrated and register/login no longer depends on `players.password`, remove that column only after taking a verified backup and testing the new auth flow.

The News Panel does not authorize edits from `players.role`, `getActiveUser()`, or localStorage. It checks the signed-in Supabase Auth user against `public.news_admins`, and database RLS policies enforce the write permission.
