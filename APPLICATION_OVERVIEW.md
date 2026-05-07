# CreatorHub Application Overview

This document is the single-source reference for the `only-fans-saas` application.

## 1) What This Application Is

CreatorHub is a SaaS platform for creators to:

- Manage subscribers
- Build DM automation funnels
- Optimize PPV pricing
- Track growth and revenue analytics

Primary product areas:

- Auth and onboarding
- Subscriber CRM
- Funnel builder and execution logic
- Pricing and billing (Stripe)
- Analytics dashboard
- Account and subscription settings

## 2) Tech Stack

- Framework: `Next.js 16` (App Router)
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- UI: `Radix UI` + custom UI components
- Database/Auth: `Supabase` (`@supabase/ssr`, `@supabase/supabase-js`)
- Billing: `Stripe` (`stripe`, `@stripe/stripe-js`)
- Observability: `Sentry` (`@sentry/nextjs`)
- CI/CD: `GitHub Actions` + `Vercel`

## 3) Repository Structure

Key folders:

- `src/app`: App Router pages and API routes
- `src/components`: UI and feature components
- `src/hooks`: client-side hooks
- `src/lib`: service utilities (Stripe, Supabase, logger, etc.)
- `src/types`: shared TypeScript types
- `.github/workflows`: CI/CD pipelines
- `supabase/migrations`: SQL migrations

Key backend routes:

- `src/app/api/auth/callback/route.ts`
- `src/app/api/stripe/checkout/route.ts`
- `src/app/api/stripe/portal/route.ts`
- `src/app/api/stripe/webhook/route.ts`

## 4) Core Domain Model

Main tables in Supabase:

- `profiles`
  - User profile + subscription metadata
  - Tracks Stripe customer/subscription IDs
- `subscribers`
  - Creator-managed subscriber records
  - Tier, engagement, status, spend
- `funnels`
  - Funnel definitions per user
- `funnel_steps`
  - Step-by-step funnel actions/conditions
- `stripe_webhook_events`
  - Idempotency and reliability table for Stripe webhook events
  - Tracks `stripe_event_id`, `status`, `attempts`, `last_error`, timestamps

## 5) Authentication and Session Flow

Supabase Auth supports:

- Email/password
- Magic links
- Google OAuth

Server-side session management:

- `src/lib/supabase/middleware.ts` updates auth session state
- `src/proxy.ts` is the Next.js 16 runtime entrypoint for request/session middleware
- `src/lib/supabase/server.ts` creates server and admin clients

## 6) Billing and Stripe Flow

### Checkout

`/api/stripe/checkout`:

1. Validates plan input
2. Gets current authenticated user
3. Resolves Stripe price ID from plan
4. Finds or creates Stripe customer
5. Creates Stripe checkout session
6. Returns session URL

### Billing Portal

`/api/stripe/portal`:

1. Authenticates user
2. Fetches user Stripe customer ID
3. Creates billing portal session
4. Returns portal URL

### Webhook Processing

`/api/stripe/webhook`:

1. Verifies Stripe signature
2. Checks `stripe_webhook_events` for duplicate success
3. Marks event `processing` and increments attempts
4. Handles relevant Stripe events
5. Marks event `succeeded` or `failed`
6. Stores `last_error` on failure

This design makes webhook handling idempotent and replay-safe.

## 7) Logging and Observability

### Structured Logging

`src/lib/logger.ts` emits structured JSON logs with:

- `scope`
- `event`
- optional `requestId`
- optional `userId`
- contextual fields

Used in Stripe API routes and Supabase env validation paths.

### Sentry

Configured files:

- `next.config.ts` (Sentry wrapper)
- `instrumentation.ts`
- `instrumentation-client.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

Captures backend and route-level failures, including webhook exceptions.

## 8) Environment Variables

### App Runtime

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_AGENCY_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

### Sentry

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN` (source maps during CI/deploy)

### GitHub Actions (for Vercel deploy)

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 9) CI/CD Pipelines

### `ci.yml`

Runs on PRs and pushes to `main`:

- `lint`
- `typecheck`
- `build`

The build job uses safe placeholder env vars to allow static build verification in CI.

### `vercel-deploy.yml`

Runs on PRs and pushes to `main`:

- Runs CI checks first
- Deploys PRs to Vercel preview
- Deploys `main` to production
- Validates pulled Vercel env vars before build
- Prints linked `.vercel/project.json` for quick diagnosis
- Uses workflow concurrency to avoid overlapping deploys

## 10) Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local env:

```bash
cp .env.example .env.local
```

3. Fill required env variables.

4. Run app:

```bash
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## 11) Operations Runbook (Quick)

Before production deploy:

- CI must be green
- Vercel project link must match this app
- Required env vars must be set in Vercel

If deploy fails:

1. Check Vercel pull target in workflow logs (`.vercel/project.json` output)
2. Check env validation step output
3. Check Supabase env errors in logs (`supabase.server` scope)
4. Check Stripe API/webhook logs (`stripe.checkout`, `stripe.portal`, `stripe.webhook`)
5. Check Sentry for server exceptions

Webhook verification:

- Confirm event row exists in `stripe_webhook_events`
- Confirm successful status and attempts
- Replay same Stripe event and verify no duplicate mutations

## 12) Contribution Workflow

Branch prefixes:

- `features/`
- `fix/`
- `hw/`
- `chore/`
- `docs/`

Commit style:

- `feat: ...`
- `fix: ...`
- `chore: ...`

Typical flow:

Notion task -> GitHub issue -> branch -> PR -> merge -> Vercel deploy

## 13) Current State Summary

The application now includes:

- Hardened CI gates before deploy
- Vercel project/env validation in pipeline
- Next.js 16 proxy/middleware compatibility
- Stripe lazy runtime client init to avoid build-time failures
- Webhook idempotency and retry tracking
- Structured backend logging
- Baseline Sentry integration

