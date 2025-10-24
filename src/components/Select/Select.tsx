import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, fullWidth, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'block rounded-md border px-3 py-2 pe-10',
          'text-secondary-900 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          'appearance-none bg-no-repeat',
          'bg-[length:1.5em_1.5em] bg-[position:right_0.5rem_center]',
          "bg-[image:url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 20 20\"%3E%3Cpath stroke=\"%236b7280\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"m6 8 4 4 4-4\"/%3E%3C/svg%3E')]",
          error
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
            : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';