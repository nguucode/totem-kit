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

const base = `${registry.homepage.replace(/\/$/, '')}/r`
const byName = new Map(registry.items.map((i) => [i.name, i]))
/** A dependency written as our own URL, mapped back to the item it names. */
const resolveDep = (dep) =>
  dep.startsWith(`${base}/`) ? byName.get(dep.slice(base.length + 1).replace(/\.json$/, '')) : null

const errors = []

for (const item of registry.items) {
  const declared = new Set(item.dependencies ?? [])
  const regDeps = new Set(item.registryDependencies ?? [])

  /* A bare name in registryDependencies is resolved against shadcn's OWN
     registry, not ours. `slot` and `tokens` 404 there; `utils` exists, so it
     silently installs a different file than the one this kit ships. Anything
     we define has to be referenced by absolute URL. */
  for (const dep of regDeps) {
    if (byName.has(dep))
      errors.push(
        `${item.name}: registryDependency "${dep}" is a bare name, which resolves against shadcn's registry — use "${base}/${dep}.json"`,
      )
  }
  // What this item ships, and what its own registryDependencies ship.
  const shipped = new Set(item.files.map((f) => f.path))
  const reachable = new Set(shipped)
  for (const dep of regDeps) for (const f of resolveDep(dep)?.files ?? []) reachable.add(f.path)
  /* Where each reachable file lands in the consumer's project, without its
     extension. The CLI rewrites the `@/` prefix of an import but not the path
     after it, so `@/lib/icon` only works if a file is installed at lib/icon —
     a source file at src/icons/Icon.tsx installed elsewhere passes a check on
     source paths and breaks on the other side. No target means the source
     path minus src/. */
  const installed = new Set(
    [...item.files, ...[...regDeps].flatMap((d) => resolveDep(d)?.files ?? [])].map((f) =>
      (f.target ?? f.path.replace(/^src\//, '')).replace(/\.[^./]+$/, ''),
    ),
  )

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
        /* The CLI rewrites `@/` aliases but copies relative imports verbatim,
           so a `target` that renames the file breaks the import on the other
           side — and on a case-insensitive filesystem only the casing half of
           that shows up, which is to say it shows up in someone's Linux CI. */
        const sibling = item.files.find((f) => {
          const full = resolve(root, f.path)
          return full === base || full.replace(/\.[^.]+$/, '') === base
        })
        if (sibling?.target) {
          const want = spec.slice(spec.lastIndexOf('/') + 1)
          const got = sibling.target.slice(sibling.target.lastIndexOf('/') + 1)
          if (got !== want && got.replace(/\.[^.]+$/, '') !== want)
            errors.push(
              `${item.name}: ${file.path} imports "${spec}" but its target renames the file to "${got}" — the CLI does not rewrite relative imports`,
            )
        }
        if (!hit) errors.push(`${item.name}: ${file.path} imports "${spec}", which the item does not ship`)
      } else if (spec.startsWith('@/')) {
        const hit = [...reachable].some((p) => p.includes(spec.slice(2)))
        if (!hit) errors.push(`${item.name}: ${file.path} imports "${spec}" — add the item that ships it to registryDependencies`)
        else if (!installed.has(spec.slice(2)))
          errors.push(`${item.name}: ${file.path} imports "${spec}", but no dependency installs a file at ${spec.slice(2)} — set that item's target to match`)
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
