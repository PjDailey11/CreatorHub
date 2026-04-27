# Contributing to OnlyFans Creator SaaS

## Branch Naming Conventions

| Prefix | Use for | Example |
|--------|---------|---------|
| `features/` | New features or enhancements | `features/dm-funnel-builder` |
| `fix/` | Bug fixes | `fix/ppv-pricing-calc` |
| `hw/` | Exploratory / personal work | `hw/test-stripe-webhooks` |
| `chore/` | Deps, config, non-code tasks | `chore/upgrade-nextjs-16` |
| `docs/` | Documentation only | `docs/subscriber-api` |

### Rules
- Use **lowercase kebab-case** after the prefix
- Keep branch names short (3-5 words)
- Always branch off `main`
- Delete branches after merging

## Commit Messages

```
feat: add subscriber churn prediction model
fix: resolve DM funnel step sequencing bug
chore: bump ai sdk to v6
```

## Pull Requests

- Reference GitHub Issues: `Closes #12`
- Vercel preview deploys automatically on every PR

## Notion → GitHub Flow

> Notion task → GitHub Issue → branch → PR → merge → Vercel auto-deploy
