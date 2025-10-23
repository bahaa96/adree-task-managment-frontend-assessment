import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
        <p className="text-gray-600">This is the card content. It can contain any valid React elements including text, images, buttons, and other components.</p>
      </div>
    ),
  },
};

// With custom className
export const WithCustomClass: Story = {
  args: {
    className: 'bg-blue-50 border-blue-200',
    children: (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Styled Card</h3>
        <p className="text-gray-600">This card has custom styling applied.</p>
      </div>
    ),
  },
};

// Card with different content types
export const ContentVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h3>
          <p className="text-gray-700">Simple card with text content.</p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mixed Content</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">Icon</span>
            </div>
            <p className="text-gray-700">Card with text and icon content.</p>
          </div>
        </div>
      </Card>
    </div>
  ),
};