import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAllTasks } from './useAllTasks';
import { requestFetchAllTasks } from '@/network';

// Mock the network module
vi.mock('@/network', () => ({
  requestFetchAllTasks: vi.fn(),
}));

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: '2024-12-31T23:59:59.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  assignedTo: 'John Doe',
  status: 'TODO',
  category: 'DEVELOPMENT',
  estimatedHours: 8,
};

describe('useAllTasks Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    mockRequestFetchAllTasks.mockResolvedValue({
      data: [mockTask],
      meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
    }));

    expect(result.current).toEqual({
      tasks: [],
      loading: true,
      error: null,
      meta: null,
      fetchTasks: expect.any(Function),
      hasNextPage: false,
      fetchNextPage: expect.any(Function),
      refetch: expect.any(Function),
    });
  });

  it('should fetch tasks on mount when immediate is true', async () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    const mockResponse = {
      data: [mockTask],
      meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    };
    mockRequestFetchAllTasks.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
      options: { immediate: true },
    }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toEqual([mockTask]);
      expect(result.current.meta).toEqual(mockResponse.meta);
    });

    expect(mockRequestFetchAllTasks).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      searchText: '',
      status: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      options: expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    });
  });

  it('should not fetch tasks on mount when immediate is false', async () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    mockRequestFetchAllTasks.mockResolvedValue({
      data: [mockTask],
      meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
      options: { immediate: false },
    }));

    // Wait a bit to ensure no immediate fetch
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(mockRequestFetchAllTasks).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toEqual([]);
  });

  it('should handle fetch errors correctly', async () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    const error = new Error('Network error');
    mockRequestFetchAllTasks.mockRejectedValue(error);

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
      options: { immediate: true },
    }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(error);
      expect(result.current.tasks).toEqual([]);
      expect(result.current.meta).toBe(null);
    });
  });

  it('should provide refetch function', async () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    const firstResponse = {
      data: [mockTask],
      meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    };
    const secondResponse = {
      data: [mockTask, { ...mockTask, id: '2' }],
      meta: { total: 2, page: 1, pageSize: 10, totalPages: 1 },
    };

    mockRequestFetchAllTasks
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
    }));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.tasks).toHaveLength(1);
    });

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.tasks).toHaveLength(2);
      expect(mockRequestFetchAllTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle race conditions with abort signal', async () => {
    const mockRequestFetchAllTasks = vi.mocked(requestFetchAllTasks);
    mockRequestFetchAllTasks.mockResolvedValue({
      data: [mockTask],
      meta: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
    });

    const { result } = renderHook(() => useAllTasks({
      page: 1,
      pageSize: 10,
    }));

    // Trigger multiple rapid calls
    act(() => {
      result.current.fetchTasks({ page: 1 });
      result.current.fetchTasks({ page: 2 });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only call the last request due to abort signal
    expect(mockRequestFetchAllTasks).toHaveBeenCalledTimes(2);

    // Check that both calls were made with AbortSignal
    const firstCall = mockRequestFetchAllTasks.mock.calls[0][0];
    const secondCall = mockRequestFetchAllTasks.mock.calls[1][0];

    expect(firstCall.options).toHaveProperty('signal');
    expect(secondCall.options).toHaveProperty('signal');
  });
});