import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, fullWidth, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'block rounded-md border px-3 py-2',
          'text-secondary-900 placeholder-secondary-400',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          'resize-vertical min-h-[80px]',
          error
            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
            : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
