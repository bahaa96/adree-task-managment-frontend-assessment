import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button } from './Button';

describe('Button Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-md', 'font-medium');
  });

  it('applies variant styles correctly', () => {
    render(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    );

    const primaryButton = screen.getByText('Primary');
    const secondaryButton = screen.getByText('Secondary');
    const successButton = screen.getByText('Success');
    const dangerButton = screen.getByText('Danger');
    const ghostButton = screen.getByText('Ghost');

    expect(primaryButton).toHaveClass('bg-primary-500', 'hover:bg-primary-600', 'text-white');
    expect(secondaryButton).toHaveClass('bg-secondary-500', 'hover:bg-secondary-600', 'text-white');
    expect(successButton).toHaveClass('bg-success-500', 'hover:bg-success-600', 'text-white');
    expect(dangerButton).toHaveClass('bg-danger-500', 'hover:bg-danger-600', 'text-white');
    expect(ghostButton).toHaveClass('bg-transparent', 'hover:bg-secondary-100', 'text-secondary-700');
  });

  it('applies size styles correctly', () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </>
    );

    const smallButton = screen.getByText('Small');
    const mediumButton = screen.getByText('Medium');
    const largeButton = screen.getByText('Large');

    expect(smallButton).toHaveClass('px-3', 'py-1.5', 'text-sm');
    expect(mediumButton).toHaveClass('px-4', 'py-2', 'text-base');
    expect(largeButton).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('applies fullWidth correctly', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');

    expect(button).toHaveClass('w-full');
  });

  it('shows loading state correctly', () => {
    render(
      <Button loading>
        <span>Loading content</span>
      </Button>
    );

    const button = screen.getByRole('button');
    const spinner = button.querySelector('animate-spin');
    const buttonText = screen.getByText('Loading content');

    expect(spinner).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('handles click events', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('passes through additional props', () => {
    render(
      <Button data-testid="custom-button" aria-label="Custom Label">
        Custom Button
      </Button>
    );

    const button = screen.getByTestId('custom-button');

    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });

  it('has correct accessibility attributes', () => {
    render(<Button aria-describedby="description">Accessible</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-describedby', 'description');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('can be used as a ref', () => {
    const ref = { current: null };
    render(<Button ref={ref}>With Ref</Button>);

    // Basic test to ensure ref can be passed without errors
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});