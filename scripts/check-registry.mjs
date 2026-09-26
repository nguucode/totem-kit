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
import { dirname, join, posix } from 'node:path'

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
        /* The CLI copies relative imports verbatim, so what matters is where
           the files LAND: the spec, resolved against the importing file's
           install path, must name a file that this item or one of its
           dependencies installs — spelled exactly, since a case-insensitive
           Mac passes what someone's Linux CI then fails. Targets mirror the
           source tree, which is what lets one component import another. */
        const landsAt = (f) => f.target ?? f.path.replace(/^src\//, '')
        const want = posix.normalize(posix.join(posix.dirname(landsAt(file)), spec))
        const all = [...item.files, ...[...regDeps].flatMap((d) => resolveDep(d)?.files ?? [])]
        const hit = all.some((f) => landsAt(f) === want || landsAt(f).replace(/\.[^./]+$/, '') === want)
        if (!hit)
          errors.push(
            `${item.name}: ${file.path} imports "${spec}", which installs to nothing at ${want} — ship that file, or depend on the item that does`,
          )
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
