import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

export const FormField = ({
  label,
  error,
  required,
  children,
  htmlFor,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-secondary-700"
        >
          {label}
          {required && <span className="text-danger-500 ms-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-danger-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};