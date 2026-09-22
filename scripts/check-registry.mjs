/**
 * Asserts every registry item can actually be installed.
 *
 *   node scripts/check-registry.mjs
 *
 * The copy-source path has no build step on our side: `shadcn add` copies the
 * files verbatim into someone else's repo, so a missing file or an undeclared
 * npm package only fails there, after it has shipped. Twice now it has —
 * `utils.ts` importing clsx with no dependency declared, and `Theme.tsx`
 * importing ./palettes which the item did not ship.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registry = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'))

/** Supplied by the consumer's project, never by us. */
const PEER = new Set(['react', 'react-dom'])

const byName = new Map(registry.items.map((i) => [i.name, i]))
const errors = []

for (const item of registry.items) {
  const declared = new Set(item.dependencies ?? [])
  const regDeps = new Set(item.registryDependencies ?? [])
  // What this item ships, and what its own registryDependencies ship.
  const shipped = new Set(item.files.map((f) => f.path))
  const reachable = new Set(shipped)
  for (const dep of regDeps) for (const f of byName.get(dep)?.files ?? []) reachable.add(f.path)

  for (const file of item.files) {
    if (!/\.(tsx?|jsx?)$/.test(file.path)) continue
    const source = readFileSync(join(root, file.path), 'utf8')
    for (const [, spec] of source.matchAll(/from\s+'([^']+)'/g)) {
      if (spec.startsWith('.')) {
        // A relative import must land on a file this same item ships, because
        // the target paths flatten into one directory on the other side.
        const base = resolve(dirname(join(root, file.path)), spec)
        // The spec may carry its extension ('./x.module.css') or omit it
        // ('./palettes'), so accept an exact match or one extension short.
        const hit = [...shipped].some((p) => {
          const full = resolve(root, p)
          return full === base || full.replace(/\.[^.]+$/, '') === base
        })
        if (!hit) errors.push(`${item.name}: ${file.path} imports "${spec}", which the item does not ship`)
      } else if (spec.startsWith('@/')) {
        const hit = [...reachable].some((p) => p.includes(spec.slice(2)))
        if (!hit) errors.push(`${item.name}: ${file.path} imports "${spec}" — add the item that ships it to registryDependencies`)
      } else {
        const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
        if (!PEER.has(pkg) && !declared.has(pkg))
          errors.push(`${item.name}: ${file.path} imports "${pkg}" — add it to this item's "dependencies"`)
      }
    }
  }

  if (!item.description) errors.push(`${item.name}: no description (it is shown before anyone installs it)`)
}

if (errors.length) {
  console.error(`registry.json is not installable:\n${errors.map((e) => `  ${e}`).join('\n')}`)
  process.exit(1)
}
console.log(`registry ok — ${registry.items.length} items, every import resolvable`)
