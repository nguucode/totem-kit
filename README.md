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

## Using Totem Kit in a project

Copy-source, [shadcn/ui](https://ui.shadcn.com)-style — no npm package to
install or keep in sync. [`registry.json`](registry.json) declares each
component; `npx shadcn build` turns it into static JSON served at
`/r/<name>.json` (deployed alongside Storybook, so it's always live at
https://nguucode.github.io/totem-kit/r/<name>.json).

In a project that already has Tailwind v4 (run `npx shadcn@latest init`
there first if it doesn't have a `components.json` yet):

```bash
npx shadcn@latest add https://nguucode.github.io/totem-kit/r/theme.json   # design tokens, once
npx shadcn@latest add https://nguucode.github.io/totem-kit/r/button.json
npx shadcn@latest add https://nguucode.github.io/totem-kit/r/text-input.json
```

Or register Totem Kit as a named registry in the project's `components.json`
so components can be added by name:

```json
{ "registries": { "@totem": "https://nguucode.github.io/totem-kit/r/{name}.json" } }
```

```bash
npx shadcn@latest add @totem/button
```

The CLI resolves `registryDependencies` (e.g. `button` → `utils`) and
installs npm `dependencies` (`radix-ui`, `class-variance-authority`, ...)
automatically, and rewrites the `@/...` import in the copied file to match
whatever alias the target project uses.

## Adding a component

1. Build it in `src/components/<category>/` (pick a category from the Components overview), styling with Tailwind and Radix primitives — see `actions/Button.tsx` for the pattern: `cva` for variants, `cn()` from `src/lib/utils.ts` to merge classes. Import shared code via the `@/` alias (e.g. `@/lib/utils`), not a relative path — that's what lets the CLI rewrite it to the consumer's own alias.
2. Add a `*.stories.tsx` file next to it, titled `Components/<Category>/<Component>`.
3. Add an entry for it in [`registry.json`](registry.json) so it's installable via the CLI.
4. Figma designs will be synced in as the source of truth for new components.
