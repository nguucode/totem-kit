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
        'components/atomic-elements/Divider': 'src/components/atomic-elements/Divider.tsx',
        'components/inputs/TextInput': 'src/components/inputs/TextInput.tsx',
        'components/atomic-elements/Badge': 'src/components/atomic-elements/Badge.tsx',
        'lib/icon': 'src/lib/icon.tsx',
        'components/atomic-elements/Avatar': 'src/components/atomic-elements/Avatar.tsx',
        'components/atomic-elements/Tag': 'src/components/atomic-elements/Tag.tsx',
        'components/buttons/ToggleButton': 'src/components/buttons/ToggleButton.tsx',
        'components/controls/Switch': 'src/components/controls/Switch.tsx',
        'components/controls/Checkbox': 'src/components/controls/Checkbox.tsx',
        'components/controls/Radio': 'src/components/controls/Radio.tsx',
        'components/data-display/Accordion': 'src/components/data-display/Accordion.tsx',
        'components/data-display/Card': 'src/components/data-display/Card.tsx',
        'theme/Theme': 'src/theme/Theme.tsx',
        'lib/utils': 'src/lib/utils.ts',
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'clsx', /^@base-ui\/react/],
    },
  },
})
