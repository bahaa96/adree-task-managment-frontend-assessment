import type { Preview } from '@storybook/react';
import { cn } from '../src/lib/cn';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'gray', value: '#f3f4f6' },
        { name: 'dark', value: '#1a202c' },
      ],
    },
    docs: {
      toc: true,
    },
    controls: {
      matchers: {
        color: {
          color: (value) => ({
            background: value,
          }),
        },
      },
    },
  },
  globalTypes: {
    cn: {
      description: 'Utility function for className merging',
      value: cn,
    },
  },
};

export default preview;