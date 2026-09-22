# Totem Kit

Front-end UI kit built with React, TypeScript, Tailwind CSS, and Radix UI primitives, documented in Storybook.

**Storybook:** https://nguucode.github.io/totem-kit/ (auto-deployed from `main` via [GitHub Actions](.github/workflows/deploy-storybook.yml))

## Stack

- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **Radix UI** (`radix-ui` package) — unstyled, accessible primitives
- **class-variance-authority** — variant styling for components
- **Storybook** — component catalog / docs

## Getting started

```bash
npm install
npm run storybook   # component catalog at http://localhost:6006
npm run dev          # app shell at http://localhost:5173
```

## Structure (Atomic Design)

Storybook sidebar is ordered Foundations → Components → Patterns (`.storybook/preview.tsx`).

| Tier (atomic design) | Folder | Storybook title | What goes here |
| --- | --- | --- | --- |
| **Foundations** (atoms) | `src/foundations/` | `Foundations/*` | Design tokens: color, typography, spacing, radius |
| **Components** (molecules) | `src/components/<category>/` | `Components/<Category>/*` | Single components (Button, Input, Modal, ...) — see [`src/components/Overview.mdx`](src/components/Overview.mdx) for the full category list |
| **Patterns** (organisms) | `src/patterns/<category>/` | `Patterns/<Category>/*` | Full sections assembled from Components (Marketing, Application UI, E-commerce) — see [`src/patterns/Overview.mdx`](src/patterns/Overview.mdx) |

## Design tokens

`src/index.css` is the source of truth: raw values live in `:root` / `.dark`
(swap them there when real brand colors exist), aliased to Tailwind utilities
(`bg-primary`, `text-muted-foreground`, `rounded-lg`, ...) via `@theme inline`.
Currently seeded with Tailwind's default neutral scale as OKLCH values —
these are the ones to sync out to Figma variables later. Toggle the "Theme"
control in the Storybook toolbar to preview light/dark.

Components should always use the semantic tokens (`bg-primary`, not
`bg-neutral-900`) so a token swap doesn't require touching component code.

## Adding a component

1. Build it in `src/components/<category>/` (pick a category from the Components overview), styling with Tailwind and Radix primitives — see `actions/Button.tsx` for the pattern: `cva` for variants, `cn()` from `src/lib/utils.ts` to merge classes.
2. Add a `*.stories.tsx` file next to it, titled `Components/<Category>/<Component>`.
3. Figma designs will be synced in as the source of truth for new components.
