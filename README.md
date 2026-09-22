# Totem Kit

> **Early stage, not production-ready.** Only two components exist
> (Button, Text Input) and no Figma file has been applied yet — the
> palettes are placeholders, picked for contrast rather than designed.
> Expect breaking changes on any `0.x` version bump. Fine to poke around
> or reference the setup; not ready to build a real product on top of yet.

Front-end UI kit for React, documented in Storybook. No CSS framework and no
primitive library — components are plain elements styled with CSS Modules
against a token layer of CSS custom properties.

**Storybook:** https://nguucode.github.io/totem-kit/ (auto-deployed from `main` via [GitHub Actions](.github/workflows/deploy-storybook.yml))

## Stack

- **Vite** — build tool
- **CSS Modules** — component styling, scoped per file
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
| **Foundations** (atoms) | `src/foundations/` | `Foundations/*` | Overview, color, dark mode, typography, spacing, breakpoints, radius, shadows, cursors |
| **Components** (molecules) | `src/components/<category>/` | `Components/<Category>/*` | Single components (Button, Input, Modal, ...) — see [`src/components/Overview.mdx`](src/components/Overview.mdx) for the full category list |
| **Patterns** (organisms) | `src/patterns/<category>/` | `Patterns/<Category>/*` | Full sections assembled from Components (Marketing, Application UI, E-commerce) — see [`src/patterns/Overview.mdx`](src/patterns/Overview.mdx) |

**Every topic gets a hand-written `.mdx` doc page**, not an autodocs blurb —
a story alone is a visual, not documentation. The `.mdx` file imports its
`.stories.tsx` neighbour, attaches with `<Meta of={...} />`, and embeds each
story with `<Canvas of={...} />` under the section that explains it; the
stories file keeps no `autodocs` tag and no description parameter.

Write these like reference docs, not captions: what the tokens are, what
each one is *for* (especially where two look identical and differ only in
intent), the measured numbers, where the values came from, what the known
gotchas are, and how to override. Markdown tables work — `remark-gfm` is
enabled in `.storybook/main.ts`, without which tables render as literal
pipes.

## Design tokens

`src/tokens.css` is the source of truth: raw values live in `:root` / `.dark`
(swap them there when real brand colors exist), aliased to utility classes
(`bg-primary`, `text-muted-foreground`, `rounded-lg`, `shadow-md`, ...) via
`@theme inline`. Colors come from two swappable ramps — an accent (indigo)
behind `--primary`/`--ring` and a gray (neutral) behind everything
structural — grouped by role: backgrounds → subtle surfaces → solid
actions → borders. These are the values to sync out to Figma variables
later. `--cursor-*` tokens keep the regular arrow on interactive elements
rather than `pointer`. Toggle the "Theme" control in the Storybook toolbar
to preview light/dark.

Components should always use the semantic tokens (`bg-primary`, not
`bg-neutral-900`) so a token swap doesn't require touching component code.

### Custom themes

Customization is the point of the kit. `src/theme/Theme.tsx` scopes five
independent settings to any subtree:

```tsx
<Theme accentColor="violet" grayColor="slate" appearance="dark" radius="large" scaling="105%">
```

| Prop | Values |
| --- | --- |
| `accentColor` | 17 hues — drives `--primary` and `--ring` (default: **indigo**) |
| `grayColor` | 9 neutral ramps — surfaces, text, borders (default: neutral) |
| `appearance` | `light` / `dark` / `inherit` |
| `radius` | `none` / `small` / `medium` / `large` / `full` |
| `scaling` | `90%` … `110%` — spacing and type together |

Every accent's solid step and label colour are **computed** so each one
clears WCAG AA (4.5:1) for its own label, and the focus ring clears 3:1
against the page — which is why the warm hues carry dark labels and the
ring uses a step darker than the fill.

Scopes nest in either direction (light values live on `:root, .light`), and
`tokens` still accepts any custom property for values the presets don't
cover. Full write-up in
[Foundations → Overview](https://nguucode.github.io/totem-kit/?path=/docs/foundations-overview--docs).

Globally, it is plain CSS — redeclare the variables after Totem Kit's
stylesheet, or set `data-accent` / `data-gray` on `<html>`.

`registry.json`'s `tokens` item mirrors the token values for the
copy-source path, and its `theme` item ships the component. One known quirk: `shadcn add`-ing it into a project that already has
its own shadcn-generated theme produces a few harmless duplicate/self-
referencing `--shadow-elevation-*` lines inside `@theme inline` (a limitation
in how the shadcn CLI merges a value that references a variable outside the
`theme` cssVars band) — the correct `:root`/`.dark` values still win in the
cascade, verified end-to-end, but it's worth knowing if you go looking at
the merged file.

## Using Totem Kit in a project

Two ways to consume it — pick per project.

### Copy-source (recommended)

No package to install or keep in sync; the component's source lands directly
in the consumer's repo. [`registry.json`](registry.json) declares each item;
`npx shadcn build` turns it into static JSON served at `/r/<name>.json`
(deployed alongside Storybook, always live at
https://nguucode.github.io/totem-kit/r/<name>.json).

In a project with a `components.json` (run `npx shadcn@latest init` there
first if it has none):

```bash
npx shadcn@latest add https://nguucode.github.io/totem-kit/r/tokens.json  # design tokens, once
npx shadcn@latest add https://nguucode.github.io/totem-kit/r/theme.json   # <Theme> scope component
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
installs npm `dependencies` (`class-variance-authority`, ...)
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
@import "totem-kit/tokens.css";  /* the token layer */
@import "totem-kit/styles.css";  /* the component styles */
```

Order matters: the component styles read the tokens. Nothing else is
required — no framework config, no content scanning, no build plugin.

`react`/`react-dom` are peer dependencies; `class-variance-authority`,
`clsx` installs automatically. `npm run build:lib` builds
`dist/` (bundled JS + `.d.ts` + `tokens.css`); CI runs it on every push so a
breaking change surfaces before the next `npm publish` (a manual step, not
automated by CI).

## Adding a component

1. Build it in `src/components/<category>/` (pick a category from the Components overview) — see `actions/Button.tsx` for the pattern: `cva` for variants, `cn()` from `src/lib/utils.ts` to merge classes. Import shared code via the `@/` alias (e.g. `@/lib/utils`), not a relative path — that's what lets the CLI rewrite it to the consumer's own alias.
2. Add a `*.stories.tsx` file next to it, titled `Components/<Category>/<Component>`, tagged `['autodocs']` with a real `parameters.docs.description.component`.
3. Add an entry for it in [`registry.json`](registry.json) so it's installable via the CLI.
4. Figma designs will be synced in as the source of truth for new components.
