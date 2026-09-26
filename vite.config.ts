/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = import.meta.dirname;

// Every Base UI entry point, pre-bundled up front. Otherwise the browser test
// runner discovers each subpath (@base-ui/react/switch, /field...) the first
// time a story imports it, re-optimises, and fails that whole file — which
// is every run in CI, where the cache is always cold.
const baseUiEntries = Object.keys(
  JSON.parse(readFileSync(path.join(dirname, 'node_modules/@base-ui/react/package.json'), 'utf8')).exports,
)
  .filter((k) => k !== './package.json' && !k.includes('*'))
  .map((k) => path.posix.join('@base-ui/react', k));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: baseUiEntries },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});