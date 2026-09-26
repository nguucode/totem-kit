# Zweihänder

> **Early stage, not production-ready.** Only a few components exist
> (Button, Text Input, Divider) and no Figma file has been applied yet — the
> palettes are placeholders, picked for contrast rather than designed.
> Expect breaking changes on any `0.x` version bump. Fine to poke around
> or reference the setup; not ready to build a real product on top of yet.

Front-end UI kit for React, documented in Storybook. No CSS framework and no
primitive library — components are plain elements styled with CSS Modules
against a token layer of CSS custom properties.

**Storybook:** https://ontheshore.biz/zweihander/ (auto-deployed from `main` via [GitHub Actions](.github/workflows/deploy-storybook.yml))

## Stack

- **Vite** — build tool
- **CSS Modules** — component styling, scoped per file
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

The source of truth is **`tokens/*.json`**, in the W3C
[DTCG](https://tr.designtokens.org/format/) format. `npm run tokens` runs
`scripts/build-tokens.mjs` over them and writes every downstream artefact:

| Generated | What reads it |
| --- | --- |
| `src/tokens.css` | every component, as custom properties |
| `src/theme/palettes.ts` | `Theme`'s `accentColor` / `grayColor` unions |
| `src/foundations/palette.ts` | the Primitives story |
| `tokens/design-tokens.json` | the export — this is what goes to Figma |

Those four files carry a `GENERATED` header and must not be hand-edited;
`npm run tokens:check` fails CI if they drift from the JSON.

`tokens/primitives.json` holds the raw ramps (17 accents × 9 grays × 11
steps). `tokens/semantic.json` holds what components actually read, and
every colour in it is an **alias** — `{gray.950}`, `{accent.solid}` — so no
semantic token carries a literal and swapping a ramp swaps everything
downstream. Components use the semantic names (`var(--primary)`, never
`var(--gray-900)`) for the same reason.

The generator is not a templating pass: it *measures*. Each accent's solid
step and label colour are chosen by computing OKLCH → sRGB → WCAG contrast
and taking the first step that clears 4.5:1, and the focus ring is a
separate pick against the page at 3:1. Edit a ramp so that no step can
carry a readable label and the build throws rather than shipping it.

### Exporting to Figma

`tokens/design-tokens.json` keeps `semantic` as **aliases** into `primitive`
(`"primary": "{primitive.accent.indigo.600}"`) rather than flattening them,
because a Figma variable is supposed to point at another variable — a
flattened export imports as a pile of disconnected colours. `light` and
`dark` are the two modes of one collection; `space`, `text` and `radius`
stay separate groups because Figma types them differently.

The stylesheet and the export are built by different code paths, so the
generator follows every alias back to its literal and asserts the two
agree. They cannot drift apart silently.

Shadows export as **structured layers** (`offsetX` / `offsetY` / `blur` /
`spread` / `color`) rather than CSS strings, which is both what the token
spec defines and what an effect-style importer can read. They land as
Figma effect styles, not variables, so they import on a separate path from
everything else. The generator re-composes every exported layer and
asserts it rebuilds the exact CSS declaration.

Two things do not survive the trip: values are `oklch()`, so a plugin that
only parses hex needs a conversion step; and the 16 non-default accents are
selected at runtime by `[data-accent]`, which Figma has no equivalent for —
they export as primitives only.

`--cursor-*` tokens keep the regular arrow on elements that act on the
current page and the hand on ones that navigate. Toggle the "Theme" control in the Storybook toolbar to
preview light/dark.

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
[Foundations → Overview](https://ontheshore.biz/zweihander/?path=/docs/foundations-overview--docs).

Globally, it is plain CSS — redeclare the variables after Zweihänder's
stylesheet, or set `data-accent` / `data-gray` on `<html>`.

`registry.json`'s `tokens` item ships `tokens.css` itself for the
copy-source path, and its `theme` item ships the component.

## Using Zweihänder in a project

Two ways to consume it — pick per project.

### Copy-source (recommended)

No package to install or keep in sync; the component's source lands directly
in the consumer's repo. [`registry.json`](registry.json) declares each item;
`npx shadcn build` turns it into static JSON served at `/r/<name>.json`
(deployed alongside Storybook, always live at
https://ontheshore.biz/zweihander/r/<name>.json).

In a project with a `components.json` (run `npx shadcn@latest init` there
first if it has none):

```bash
npx shadcn@latest add https://ontheshore.biz/zweihander/r/tokens.json  # design tokens, once
npx shadcn@latest add https://ontheshore.biz/zweihander/r/theme.json   # <Theme> scope component
npx shadcn@latest add https://ontheshore.biz/zweihander/r/button.json
npx shadcn@latest add https://ontheshore.biz/zweihander/r/text-input.json
npx shadcn@latest add https://ontheshore.biz/zweihander/r/divider.json
```

Or register Zweihänder as a named registry in the project's `components.json`
so components can be added by name:

```json
{ "registries": { "@zweihander": "https://ontheshore.biz/zweihander/r/{name}.json" } }
```

```bash
npx shadcn@latest add @zweihander/button
```

The CLI resolves `registryDependencies` (e.g. `button` → `utils`, `slot`)
and installs npm `dependencies` automatically, and rewrites the `@/...`
import in the copied file to match whatever alias the target project uses.

### npm package

For projects that would rather version-pin than own the source. Published
at [npmjs.com/package/zweihander](https://www.npmjs.com/package/zweihander):

```bash
npm install zweihander
```

```ts
import { Button } from 'zweihander/button'
import { TextInput } from 'zweihander/text-input'
import { Divider } from 'zweihander/divider'
```

```css
@import "zweihander/tokens.css";  /* the token layer */
@import "zweihander/styles.css";  /* the component styles */
```

Order matters: the component styles read the tokens. Nothing else is
required — no framework config, no content scanning, no build plugin.

`react`/`react-dom` are peer dependencies; `clsx` — the only runtime
dependency — installs automatically. `npm run build:lib` builds
`dist/` (bundled JS + `.d.ts` + `tokens.css`); CI runs it on every push so a
breaking change surfaces before the next `npm publish` (a manual step, not
automated by CI).

## Adding a component

1. Build it in `src/components/<category>/` (pick a category from the Components overview) — see `buttons/Button.tsx` for the pattern: a `<Name>.module.css` beside the component, one class per variant and size, looked up as `styles[variant]` and merged with `cn()` from `src/lib/utils.ts`. Read tokens (`var(--primary)`), never literals, and set `font-family: var(--font-sans)` explicitly rather than inheriting — a consumer's page may set no font at all. Import shared code via the `@/` alias (e.g. `@/lib/utils`), not a relative path — that's what lets the CLI rewrite it to the consumer's own alias.
2. Add a `*.stories.tsx` file next to it, titled `Components/<Category>/<Component>`, and a hand-written `<Component>.mdx` beside it (Anatomy, props, usage, accessibility) — no `autodocs` tag, per Structure above.
3. Add an entry for it in [`registry.json`](registry.json) so it's installable via the CLI.
4. Figma designs will be synced in as the source of truth for new components.
