import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    'storybook/actions',
  ],
};

export default config;