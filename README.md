# MyDegree / MyCareer

## Supabase Project (Locked for this repo)

This repository is configured to use this Supabase project by default:

- Project name: `MyCareer`
- Project ref (ID): `uprfiwxfgooeqdfasggh`
- Region: `us-west-2`
- URL: `https://uprfiwxfgooeqdfasggh.supabase.co`

### Where this is configured

- `supabase/config.toml`  
  `project_id = "uprfiwxfgooeqdfasggh"`
- `.env.local` (local runtime env)
- `.env.example` (shared template for team/repo)

### Frontend env vars

The app may use either of these Supabase key names depending on the helper package/version:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Also required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PROJECT_REF`

> Recommendation: set both key variables to the same **publishable/anon** key value.

## Vercel deployment fix for `@supabase/ssr` missing URL/API key

If Vercel fails with:

- `@supabase/ssr: Your project's URL and API key are required to create a Supabase client!`
- `Error occurred prerendering page "/login"`

then your Vercel project is missing one or more required environment variables at build time.

### Fix steps

1. Open **Vercel → Project → Settings → Environment Variables**.
2. Add these variables for **Production**, **Preview**, and **Development**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same value as publishable key)
   - `NEXT_PUBLIC_SUPABASE_PROJECT_REF`
3. Redeploy (or trigger a new deployment) so the build picks up the new env vars.

### Why this happens

Next.js can execute server components/pages during `next build` while generating static pages. If a login page creates a Supabase client during prerender and env vars are missing, the build fails before deployment completes.

## If the link is ever lost

Run:

```bash
supabase link --project-ref uprfiwxfgooeqdfasggh
```

## Local development

```bash
npm run dev
```
