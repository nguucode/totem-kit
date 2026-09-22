# Totem Kit

Front-end UI kit built with React, TypeScript, Tailwind CSS, and Radix UI primitives, documented in Storybook.

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

## Adding a component

1. Build the component in `src/components/`, styling with Tailwind and Radix primitives (see `Button.tsx` for the pattern: `cva` for variants, `cn()` from `src/lib/utils.ts` to merge classes).
2. Add a `*.stories.tsx` file next to it.
3. Figma designs will be synced in as the source of truth for new components.
