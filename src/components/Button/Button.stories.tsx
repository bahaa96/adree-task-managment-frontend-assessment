import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Default Button',
  },
};

// Variants story
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  ),
};

// Sizes story
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// States story
export const States: Story = {
  render: () => (
    <div className="flex flex-col space-y-4 p-4">
      <div className="space-x-4">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button fullWidth>Full Width</Button>
      </div>
    </div>
  ),
};

// Interactive story
export const Interactive: Story = {
  render: () => {
    const handleClick = fn();
    return (
      <div className="p-4">
        <Button onClick={handleClick}>
          Click me
        </Button>
        <p className="mt-2 text-sm text-gray-600">
          Click count: {handleClick.mock.calls.length}
        </p>
      </div>
    );
  },
};