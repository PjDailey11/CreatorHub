# Auth and OAuth Setup Checklist

Use this checklist when configuring Supabase Auth and Google OAuth for this app.

## Expected environment variables

Set these in local development and in Vercel production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-browser-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
NEXT_PUBLIC_APP_URL=https://only-fans-saa-s.vercel.app
```

For local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## User-facing auth routes

The app should expose these routes to users:

- `/login`
- `/signup`
- `/auth/callback`

The legacy `/api/auth/callback` route is kept only to forward old links to the new branded callback path.

## Supabase Dashboard checklist

1. Confirm the Supabase project is active. An inactive project will make the `*.supabase.co` hostname fail before OAuth can start.
2. Go to `Authentication -> URL Configuration`.
3. Set **Site URL** to:
   - `https://only-fans-saa-s.vercel.app`
4. Add **Redirect URLs**:
   - `https://only-fans-saa-s.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
   - Optional for Vercel previews: `https://*-.vercel.app/**`
5. Go to `Authentication -> Providers -> Google`.
6. Enable Google and paste the Google client ID/secret.

## Google Cloud checklist

In your OAuth 2.0 client configuration, add this **Authorized redirect URI** for Supabase:

```text
https://savugwdyotgimrujwjhg.supabase.co/auth/v1/callback
```

If you move to a different Supabase project, this URI must change to that project's hostname.

## Notes

- The long Supabase hostname is the project URL used by Supabase Auth internally. Your app can keep the visible user flow on `/login`, `/signup`, and `/auth/callback`, but Google still redirects to Supabase first.
- If production is still failing with `DNS_PROBE_FINISHED_NXDOMAIN`, verify the project is active and that Vercel production env vars point at the live project.
