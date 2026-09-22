/**
 * Builds every generated artefact from tokens/*.json.
 *
 *   node scripts/build-tokens.mjs          write the outputs
 *   node scripts/build-tokens.mjs --check  fail if the outputs are stale
 *
 * The interesting part is pickAccent(): the solid step and the label colour
 * for each accent are *measured*, not chosen. If a ramp is edited so that no
 * step can carry a readable label, this throws and the build stops.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { AA_NON_TEXT, AA_TEXT, contrast } from './color.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

const primitives = read('tokens/primitives.json')
const semantic = read('tokens/semantic.json')

const ACCENTS = Object.keys(primitives.accent).filter((k) => !k.startsWith('$'))
const GRAYS = Object.keys(primitives.gray).filter((k) => !k.startsWith('$'))
const ramp = (group, hue, step) => primitives[group][hue][step].$value

const NEAR_WHITE = ramp('gray', 'neutral', '50')
const NEAR_BLACK = ramp('gray', 'neutral', '900')
const PAGE_LIGHT = 'oklch(100% 0 0)'
const PAGE_DARK = ramp('gray', 'neutral', '950')

/**
 * A solid fill has to carry its own label at 4.5:1. Prefer the canonical step
 * so accents stay visually consistent, and prefer a white label so they stay
 * consistent with each other — stepping only when the measurement says to.
 */
function pickAccent(hue, candidates) {
  for (const step of candidates) {
    const solid = ramp('accent', hue, step)
    for (const [label, contrastColor] of [
      ['white', NEAR_WHITE],
      ['black', NEAR_BLACK],
    ]) {
      const ratio = contrast(solid, contrastColor)
      if (ratio >= AA_TEXT) return { step, solid, contrast: contrastColor, label, ratio }
    }
  }
  throw new Error(
    `accent "${hue}": no step in ${candidates.join(', ')} carries a label at ${AA_TEXT}:1. ` +
      `Adjust the ramp in tokens/primitives.json.`,
  )
}

/**
 * The focus ring is a separate pick: it needs 3:1 against the page rather
 * than against itself, and the lighter solids miss that.
 */
function pickRing(hue, page, candidates) {
  for (const step of candidates) {
    const value = ramp('accent', hue, step)
    if (contrast(value, page) >= AA_NON_TEXT) return { step, value }
  }
  throw new Error(`accent "${hue}": no step clears ${AA_NON_TEXT}:1 against the page.`)
}

const palettes = ACCENTS.map((hue) => {
  const light = pickAccent(hue, ['600', '700', '800'])
  const dark = pickAccent(hue, ['400', '500', '300'])
  const ringLight = pickRing(hue, PAGE_LIGHT, ['700', '800', '900'])
  const ringDark = pickRing(hue, PAGE_DARK, [dark.step, '300', '500'])
  return { hue, light, dark, ringLight, ringDark }
})

// ---------------------------------------------------------------- tokens.css

const alias = (value, { accent, gray }) =>
  value.replace(/\{([^}]+)\}/g, (_, ref) => {
    const [group, ...rest] = ref.split('.')
    if (group === 'gray') {
      // {gray.950} is the selected ramp; {gray.neutral.50} pins a specific one.
      return rest.length === 1 ? gray[rest[0]] : ramp('gray', rest[0], rest[1])
    }
    if (group === 'accent') {
      if (rest.length === 1) return accent[rest[0]]
      return ramp('accent', rest[0], rest[1])
    }
    throw new Error(`unknown alias: {${ref}}`)
  })

const entries = (obj) => Object.entries(obj).filter(([k]) => !k.startsWith('$'))
const decls = (obj, indent = '  ') =>
  entries(obj)
    .map(([k, v]) => `${indent}--${k}: ${v.$value};`)
    .join('\n')

const DEFAULT_ACCENT = 'indigo'
const DEFAULT_GRAY = 'neutral'
const defaults = palettes.find((p) => p.hue === DEFAULT_ACCENT)

const accentVars = (p) => `  --accent-solid-light: ${p.light.solid};
  --accent-contrast-light: ${p.light.contrast};
  --accent-ring-light: ${p.ringLight.value};
  --accent-solid-dark: ${p.dark.solid};
  --accent-contrast-dark: ${p.dark.contrast};
  --accent-ring-dark: ${p.ringDark.value};`

const GRAY_STEPS = ['50', '100', '200', '400', '500', '800', '900', '950']
const grayVars = (hue) =>
  GRAY_STEPS.map((s) => `  --gray-${s}: ${ramp('gray', hue, s)};`).join('\n')

const grayOf = () =>
  Object.fromEntries(GRAY_STEPS.map((s) => [s, `var(--gray-${s})`]))
const accentOf = (mode) => ({
  solid: `var(--accent-solid-${mode})`,
  contrast: `var(--accent-contrast-${mode})`,
  ring: `var(--accent-ring-${mode})`,
})

const colorBlock = (mode) =>
  entries(semantic.color[mode])
    .map(([k, v]) => `  --${k}: ${alias(v.$value, { accent: accentOf(mode), gray: grayOf() })};`)
    .join('\n')

const spaceDecls = entries(semantic.space)
  .map(([k, v]) => `  --space-${k}: calc(${v.$value} * var(--scaling));`)
  .join('\n')
const textDecls = entries(semantic.text)
  .map(([k, v]) => `  --text-${k}: calc(${v.$value} * var(--scaling));`)
  .join('\n')
const leadingDecls = entries(semantic.text)
  .map(([k, v]) => `  --leading-${k}: calc(${v.$extensions.leading});`)
  .join('\n')

const css = `/*
 * GENERATED by scripts/build-tokens.mjs — edit tokens/*.json instead.
 *
 * The token layer every component resolves against. One stylesheet holds
 * both appearances; there is no JavaScript theme object and no build step
 * on the consumer's side.
 */

/* Appearance-independent tokens live on :root ALONE, never on \`.light\`. A
   nested light scope re-matches every \`.light\` rule, so anything declared
   there would reset back to its default instead of inheriting the value an
   outer Theme set. */
:root {
${decls(semantic.root)}

  /* Defaults: ${DEFAULT_ACCENT} accent, ${DEFAULT_GRAY} gray. Overridden by
     [data-accent] / [data-gray] below, which the Theme component sets. */
${accentVars(defaults)}
${grayVars(DEFAULT_GRAY)}
}

/* Accent palettes. The solid step and label colour are measured per hue so
   every accent clears ${AA_TEXT}:1 for its own label, and the ring clears
   ${AA_NON_TEXT}:1 against the page — which is why the warm hues take dark
   labels and the ring sits a step darker than the fill. */
${palettes.map((p) => `[data-accent='${p.hue}'] {\n${accentVars(p)}\n}`).join('\n')}

/* Gray ramps. */
${GRAYS.map((hue) => `[data-gray='${hue}'] {\n${grayVars(hue)}\n}`).join('\n')}

/* \`.light\` carries the same values as \`:root\` so a light scope can be nested
   inside a dark one. \`.dark\` is declared after it at equal specificity, so on
   an element carrying both, dark wins. */
:root,
.light {
${colorBlock('light')}

${decls(semantic.shadow.light)}
}

.dark {
${colorBlock('dark')}

${decls(semantic.shadow.dark)}
}

/* A custom property that reads another one is resolved where it is DECLARED
   and inherits as a finished value, so setting --accent-solid-* further down
   the tree cannot reach a --primary already computed at :root. Every element
   that changes the palette therefore has to restate the mapping. */
[data-accent] {
  --primary: var(--accent-solid-light);
  --primary-foreground: var(--accent-contrast-light);
  --ring: var(--accent-ring-light);
}
.dark [data-accent],
[data-accent].dark {
  --primary: var(--accent-solid-dark);
  --primary-foreground: var(--accent-contrast-dark);
  --ring: var(--accent-ring-dark);
}

[data-gray] {
${colorBlock('light')
  .split('\n')
  .filter((l) => l.includes('var(--gray-'))
  .join('\n')}
}
.dark [data-gray],
[data-gray].dark {
${colorBlock('dark')
  .split('\n')
  .filter((l) => l.includes('var(--gray-'))
  .join('\n')}
}

/* Derived tokens are declared on \`*\`, not \`:root\`, and that is load-bearing
   for the same reason as above: on :root they would freeze at the document
   root, so a Theme that sets --scaling or --radius-factor further down would
   change nothing. On \`*\` every element recomputes them from what it
   inherits, which is what makes scoping work. */
* {
  /* Radius steps — the base scale multiplied by the factor. */
  --radius-sm: calc((var(--radius) - 4px) * var(--radius-factor));
  --radius-md: calc((var(--radius) - 2px) * var(--radius-factor));
  --radius-lg: calc(var(--radius) * var(--radius-factor));
  --radius-xl: calc((var(--radius) + 4px) * var(--radius-factor));

  /* Radius intent — what components actually use.

     --radius-full is 0 except under radius="full", where it is 9999px. So
     max(step, --radius-full) resolves to the step normally and to a pill at
     full — that is --radius-control.

     Fields and panels take the same shape with a ceiling wrapped around it:
     min(cap, --radius-full) is 0 normally and the cap at full, so they step
     up with the preset without ever reaching a pill. A fully round text
     field reads as a search pill in a form that is not one, and a fully
     round card stops looking like a container. */
  --radius-control: max(calc((var(--radius) - 2px) * var(--radius-factor)), var(--radius-full));
  --radius-field: max(
    calc((var(--radius) - 2px) * var(--radius-factor)),
    min(calc(var(--radius) * var(--radius-factor)), var(--radius-full))
  );
  --radius-panel: max(
    calc(var(--radius) * var(--radius-factor)),
    min(calc((var(--radius) + 4px) * var(--radius-factor)), var(--radius-full))
  );

  /* Spacing — one multiplier over every gap and pad in the kit. */
${spaceDecls}

  /* Type roles. Leading is a ratio, so it follows the size under --scaling. */
${textDecls}

${leadingDecls}

  /* Shadows read from the elevation tokens each appearance sets. */
  --shadow-sm: var(--elevation-sm);
  --shadow-md: var(--elevation-md);
  --shadow-lg: var(--elevation-lg);
  --shadow-xl: var(--elevation-xl);
}
`

// -------------------------------------------------------------- palettes.ts

const list = (name, values) =>
  `export const ${name} = [\n${values.map((v) => `  '${v}',`).join('\n')}\n] as const`

const palettesTs = `// GENERATED by scripts/build-tokens.mjs — edit tokens/*.json instead.
// These names must match the [data-accent] / [data-gray] blocks in
// tokens.css, which is why both come out of the same build.

${list('ACCENT_COLORS', ACCENTS)}
export type AccentColor = (typeof ACCENT_COLORS)[number]

${list('GRAY_COLORS', GRAYS)}
export type GrayColor = (typeof GRAY_COLORS)[number]
`

// --------------------------------------------------------------- palette.ts

const DOC_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const docHues = [...GRAYS.filter((g) => ['slate', 'gray', 'zinc', 'neutral', 'stone'].includes(g)), ...ACCENTS]
const paletteTs = `// GENERATED by scripts/build-tokens.mjs — edit tokens/*.json instead.
// The raw ramps the semantic tokens are cut from, as data rather than
// generated classes so the docs page can render them without a framework.
export const PALETTE: Record<string, string[]> = {
${docHues
  .map(
    (hue) =>
      `  ${hue}: [\n${DOC_STEPS.map((s) => `    '${ramp(ACCENTS.includes(hue) ? 'accent' : 'gray', hue, s)}',`).join('\n')}\n  ],`,
  )
  .join('\n')}
}

export const STEPS = [${DOC_STEPS.join(', ')}] as const
`

// ------------------------------------------------------- DTCG export (Figma)

const dtcg = {
  $description:
    'Totem Kit design tokens, resolved. Primitives are literal; semantic entries are resolved per appearance so an importer that does not follow aliases still gets usable values.',
  primitive: primitives,
  semantic: {
    light: Object.fromEntries(
      entries(semantic.color.light).map(([k, v]) => [
        k,
        { $type: 'color', $value: alias(v.$value, { accent: { solid: defaults.light.solid, contrast: defaults.light.contrast, ring: defaults.ringLight.value }, gray: Object.fromEntries(GRAY_STEPS.map((s) => [s, ramp('gray', DEFAULT_GRAY, s)])) }) },
      ]),
    ),
    dark: Object.fromEntries(
      entries(semantic.color.dark).map(([k, v]) => [
        k,
        { $type: 'color', $value: alias(v.$value, { accent: { solid: defaults.dark.solid, contrast: defaults.dark.contrast, ring: defaults.ringDark.value }, gray: Object.fromEntries(GRAY_STEPS.map((s) => [s, ramp('gray', DEFAULT_GRAY, s)])) }) },
      ]),
    ),
  },
  dimension: { ...semantic.space, ...semantic.text, radius: semantic.root.radius },
}

// ------------------------------------------------------------------- output

const outputs = [
  ['src/tokens.css', css],
  ['src/theme/palettes.ts', palettesTs],
  ['src/foundations/palette.ts', paletteTs],
  ['tokens/design-tokens.json', JSON.stringify(dtcg, null, 2) + '\n'],
]

const check = process.argv.includes('--check')
let stale = 0
for (const [path, content] of outputs) {
  const full = join(root, path)
  const current = (() => {
    try {
      return readFileSync(full, 'utf8')
    } catch {
      return null
    }
  })()
  if (current === content) continue
  if (check) {
    console.error(`stale: ${path}`)
    stale++
  } else {
    writeFileSync(full, content)
    console.log(`wrote  ${path}`)
  }
}

if (check) {
  if (stale) {
    console.error(`\n${stale} generated file(s) out of date. Run: npm run tokens`)
    process.exit(1)
  }
  console.log(`up to date — ${palettes.length} accents, ${GRAYS.length} grays, all measured`)
} else {
  const worst = palettes.reduce((a, p) => Math.min(a, p.light.ratio, p.dark.ratio), Infinity)
  console.log(
    `\n${palettes.length} accents, ${GRAYS.length} grays. Lowest label contrast: ${worst.toFixed(2)}:1 (floor ${AA_TEXT}).`,
  )
}
