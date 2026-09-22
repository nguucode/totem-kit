# Totem Kit

> **Early stage, not production-ready.** Only two components exist
> (Button, Text Input), the color palette is still Tailwind's untouched
> default (no real brand/Figma tokens yet), and none of it has had a
> design or accessibility review beyond what's in the test files. Expect
> breaking changes on any `0.x` version bump. Fine to poke around or
> reference the setup; not ready to build a real product on top of yet.

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
| **Foundations** (atoms) | `src/foundations/` | `Foundations/*` | Design tokens: color, typography, spacing, radius, shadows, cursors — mirrors [Radix Themes' own foundation categories](https://www.radix-ui.com/themes/docs/theme/overview) |
| **Components** (molecules) | `src/components/<category>/` | `Components/<Category>/*` | Single components (Button, Input, Modal, ...) — see [`src/components/Overview.mdx`](src/components/Overview.mdx) for the full category list |
| **Patterns** (organisms) | `src/patterns/<category>/` | `Patterns/<Category>/*` | Full sections assembled from Components (Marketing, Application UI, E-commerce) — see [`src/patterns/Overview.mdx`](src/patterns/Overview.mdx) |

Every story file tags its `meta` with `['autodocs']` and gives `component` a
real description (`parameters.docs.description.component`) — a story alone
is a visual, not documentation. That description is what shows up as the
**Docs** entry in the sidebar; write it like you're explaining the concept
to someone who's never seen the code.

## Design tokens

`src/tokens.css` is the source of truth: raw values live in `:root` / `.dark`
(swap them there when real brand colors exist), aliased to Tailwind utilities
(`bg-primary`, `text-muted-foreground`, `rounded-lg`, `shadow-md`, ...) via
`@theme inline`. Colors are currently seeded with Tailwind's default neutral
scale as OKLCH values, grouped the way [Radix Themes groups its color
scale](https://www.radix-ui.com/themes/docs/theme/color) (backgrounds →
subtle surfaces → solid actions → borders) — these are the values to sync
out to Figma variables later. `--cursor-*` tokens follow [Radix's cursor
convention](https://www.radix-ui.com/themes/docs/theme/cursors): interactive
elements keep the regular arrow, not `pointer`. Toggle the "Theme" control
in the Storybook toolbar to preview light/dark.

Components should always use the semantic tokens (`bg-primary`, not
`bg-neutral-900`) so a token swap doesn't require touching component code.

`registry.json`'s `theme` item mirrors these tokens for the copy-source
path. One known quirk: `shadcn add`-ing it into a project that already has
its own shadcn-generated theme produces a few harmless duplicate/self-
referencing `--shadow-elevation-*` lines inside `@theme inline` (a limitation
in how the shadcn CLI merges a value that references a variable outside the
`theme` cssVars band) — the correct `:root`/`.dark` values still win in the
cascade, verified end-to-end, but it's worth knowing if you go looking at
the merged file.

## Using Totem Kit in a project

Two ways to consume it — pick per project.

### Copy-source (recommended), shadcn/ui-style

No package to install or keep in sync; the component's source lands directly
in the consumer's repo. [`registry.json`](registry.json) declares each item;
`npx shadcn build` turns it into static JSON served at `/r/<name>.json`
(deployed alongside Storybook, always live at
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

### npm package

For projects that would rather version-pin than own the source. Published
at [npmjs.com/package/totem-kit](https://www.npmjs.com/package/totem-kit):

```bash
npm install totem-kit
```

```ts
import { Button } from 'totem-kit/button'
import { TextInput } from 'totem-kit/text-input'
```

```css
/* after @import "tailwindcss"; */
@import "totem-kit/tokens.css";
@source "../node_modules/totem-kit/dist"; /* so Tailwind generates the utility classes the components use */
```

`react`/`react-dom` are peer dependencies; `radix-ui`, `class-variance-authority`,
`clsx`, `tailwind-merge` install automatically. `npm run build:lib` builds
`dist/` (bundled JS + `.d.ts` + `tokens.css`); CI runs it on every push so a
breaking change surfaces before the next `npm publish` (a manual step, not
automated by CI).

## Adding a component

1. Build it in `src/components/<category>/` (pick a category from the Components overview), styling with Tailwind and Radix primitives — see `actions/Button.tsx` for the pattern: `cva` for variants, `cn()` from `src/lib/utils.ts` to merge classes. Import shared code via the `@/` alias (e.g. `@/lib/utils`), not a relative path — that's what lets the CLI rewrite it to the consumer's own alias.
2. Add a `*.stories.tsx` file next to it, titled `Components/<Category>/<Component>`, tagged `['autodocs']` with a real `parameters.docs.description.component`.
3. Add an entry for it in [`registry.json`](registry.json) so it's installable via the CLI.
4. Figma designs will be synced in as the source of truth for new components.
