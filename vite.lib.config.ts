import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Library build: bundles the public component API to dist/, kept separate
// from vite.config.ts (the Storybook/app config) so `npm run build` for the
// demo app and `npm run build:lib` for the npm package don't interfere.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        'components/buttons/Button': 'src/components/buttons/Button.tsx',
        'components/inputs/TextInput': 'src/components/inputs/TextInput.tsx',
        'theme/Theme': 'src/theme/Theme.tsx',
        'lib/utils': 'src/lib/utils.ts',
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'clsx'],
    },
  },
})
