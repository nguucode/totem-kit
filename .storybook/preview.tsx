import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/index.css'

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return <Story />
}

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / dark token set',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    options: {
      // Introduction first, then atomic design order: Foundations (atoms) ->
      // Components (molecules) -> Patterns (organisms). Foundations are
      // ordered by how they build on each other, not alphabetically.
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          [
            'Overview',
            'Colors',
            'Dark mode',
            'Typography',
            'Spacing',
            'Breakpoints',
            'Radius',
            'Shadows',
            'Cursors',
          ],
          'Components',
          'Patterns',
        ],
      },
    },
  },
};

export default preview;
