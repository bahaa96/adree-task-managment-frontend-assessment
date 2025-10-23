import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, isOverdue } from './formatDate';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      const result = formatDate(date);

      expect(result).toBe('Jan 15, 2024');
    });

    it('should handle different months', () => {
      const dates = [
        new Date('2024-02-01T00:00:00.000Z'),
        new Date('2024-06-15T00:00:00.000Z'),
        new Date('2024-12-25T00:00:00.000Z'),
      ];

      const results = dates.map(formatDate);

      expect(results[0]).toBe('Feb 1, 2024');
      expect(results[1]).toBe('Jun 15, 2024');
      expect(results[2]).toBe('Dec 25, 2024');
    });

    it('should handle invalid dates', () => {
      const invalidDate = new Date('invalid');
      const result = formatDate(invalidDate as unknown as Date);

      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    it('should show relative time for recent dates', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const pastDate = new Date('2024-01-15T11:30:00.000Z');
      const result = formatRelativeTime(pastDate, now);

      expect(result).toBe('30 minutes ago');
    });

    it('should show relative time for hours', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const pastDate = new Date('2024-01-15T08:00:00.000Z');
      const result = formatRelativeTime(pastDate, now);

      expect(result).toBe('4 hours ago');
    });

    it('should show relative time for days', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const pastDate = new Date('2024-01-13T12:00:00.000Z');
      const result = formatRelativeTime(pastDate, now);

      expect(result).toBe('2 days ago');
    });

    it('should show "just now" for very recent dates', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const recentDate = new Date('2024-01-15T11:59:30.000Z');
      const result = formatRelativeTime(recentDate, now);

      expect(result).toBe('just now');
    });

    it('should handle future dates', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const futureDate = new Date('2024-01-15T13:00:00.000Z');
      const result = formatRelativeTime(futureDate, now);

      expect(result).toBe('in 1 hour');
    });
  });

  describe('isOverdue', () => {
    it('should return true for overdue tasks', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const overdueDate = new Date('2024-01-14T12:00:00.000Z');
      const result = isOverdue(overdueDate, now);

      expect(result).toBe(true);
    });

    it('should return false for future dates', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const futureDate = new Date('2024-01-16T12:00:00.000Z');
      const result = isOverdue(futureDate, now);

      expect(result).toBe(false);
    });

    it('should return false for completed tasks', () => {
      // Even if the due date is in the past, completed tasks shouldn't be overdue
      const now = new Date('2024-01-15T12:00:00.000Z');
      const completedDate = new Date('2024-01-14T12:00:00.000Z');
      const result = isOverdue(completedDate, now, { status: 'COMPLETED' });

      expect(result).toBe(false);
    });

    it('should return false for same day dates', () => {
      const now = new Date('2024-01-15T12:00:00.000Z');
      const sameDayDate = new Date('2024-01-15T10:00:00.000Z');
      const result = isOverdue(sameDayDate, now);

      expect(result).toBe(false);
    });
  });
});