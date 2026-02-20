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

The app uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_PROJECT_REF`

### If the link is ever lost

Run:

```bash
supabase link --project-ref uprfiwxfgooeqdfasggh
```

## Local development

```bash
npm run dev
```
