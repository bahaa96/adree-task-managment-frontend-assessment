import { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700 border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  success: 'bg-success-100 text-success-700 border-success-200',
  danger: 'bg-danger-100 text-danger-700 border-danger-200',
  warning: 'bg-warning-100 text-warning-700 border-warning-200',
  default: 'bg-secondary-50 text-secondary-600 border-secondary-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
