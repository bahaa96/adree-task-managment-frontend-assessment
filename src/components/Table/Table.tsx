import type { HTMLAttributes, TableHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

export interface TableHeadProps extends HTMLAttributes<HTMLTableHeaderCellElement> {}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ striped, hoverable, compact, className, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={cn(
            'min-w-full divide-y divide-secondary-200',
            'bg-white shadow-sm rounded-lg overflow-hidden',
            striped && '[&_tr:nth-child(even)]:bg-secondary-50',
            hoverable && '[&_tbody_tr:hover]:bg-secondary-100',
            compact && '[&_th]:px-3 [&_td]:px-3 [&_th]:py-2 [&_td]:py-2',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ sticky, className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn(
          'bg-secondary-50 border-b border-secondary-200',
          sticky && 'sticky top-0 z-10',
          className
        )}
        {...props}
      />
    );
  }
);

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn(
          'bg-white divide-y divide-secondary-200',
          className
        )}
        {...props}
      />
    );
  }
);

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected, className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'transition-colors duration-150',
          selected && 'bg-primary-50',
          className
        )}
        {...props}
      />
    );
  }
);

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn(
          'px-4 py-3 whitespace-nowrap text-sm text-secondary-900',
          className
        )}
        {...props}
      />
    );
  }
);

const TableHead = forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider',
          className
        )}
        {...props}
      />
    );
  }
);

TableRoot.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableCell.displayName = 'TableCell';
TableHead.displayName = 'TableHead';

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Head: TableHead,
});