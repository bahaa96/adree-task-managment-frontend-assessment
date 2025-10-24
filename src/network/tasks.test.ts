import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requestFetchAllTasks } from './tasks';
import type { Task } from '@/domain-models';
import { TaskStatus, TaskCategory } from '@/domain-models';

// Mock axios instance
vi.mock('./instance', () => ({
  default: vi.fn(),
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: '2024-12-31T23:59:59.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  assignedTo: 'John Doe',
  status: TaskStatus.TODO,
  category: TaskCategory.DEVELOPMENT,
  estimatedHours: 8,
};

const mockResponse = {
  data: [mockTask],
  meta: {
    total: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
};

describe('Network Functions - Tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('requestFetchAllTasks', () => {
    it('should fetch all tasks with default parameters', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: {
          page: 1,
          pageSize: 10,
          searchText: '',
          status: '',
          category: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include search text in request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
        searchText: 'search term',
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: expect.objectContaining({
          searchText: 'search term',
        }),
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include status filter in request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
        status: TaskStatus.IN_PROGRESS,
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: expect.objectContaining({
          status: TaskStatus.IN_PROGRESS,
        }),
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include category filter in request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
        category: TaskCategory.BUG_FIX,
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: expect.objectContaining({
          category: TaskCategory.BUG_FIX,
        }),
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include sorting parameters in request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'title',
        sortOrder: 'asc',
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: expect.objectContaining({
          sortBy: 'title',
          sortOrder: 'asc',
        }),
        signal: undefined,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should pass abort signal to axios request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: mockResponse,
      });

      const abortController = new AbortController();
      const result = await requestFetchAllTasks({
        page: 1,
        pageSize: 10,
        options: {
          signal: abortController.signal,
        },
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks',
        params: {
          page: 1,
          pageSize: 10,
          searchText: '',
          status: '',
          category: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
        signal: abortController.signal,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle network errors', async () => {
      const mockInstance = await import('./instance');
      const networkError = new Error('Network Error');
      mockInstance.default.mockRejectedValueOnce(networkError);

      await expect(requestFetchAllTasks({
        page: 1,
        pageSize: 10,
      })).rejects.toThrow(networkError);
    });
  });

  describe('requestFetchSingleTask', async () => {
    // First we need to import the function
    const { requestFetchSingleTask } = await import('./tasks');

    it('should fetch a single task by ID', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: { data: mockTask },
      });

      const result = await requestFetchSingleTask({
        id: '1',
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks/1',
        signal: undefined,
      });
      expect(result).toEqual({ data: mockTask });
    });

    it('should pass abort signal to request', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce({
        data: { data: mockTask },
      });

      const abortController = new AbortController();
      const result = await requestFetchSingleTask({
        id: '1',
        options: {
          signal: abortController.signal,
        },
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'get',
        url: '/tasks/1',
        signal: abortController.signal,
      });
      expect(result).toEqual({ data: mockTask });
    });
  });

  describe('requestCreateTask', async () => {
    const { requestCreateTask } = await import('./tasks');

    it('should create a new task', async () => {
      const mockInstance = await import('./instance');
      const newTaskData = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2024-12-31T23:59:59.000Z',
        assignedTo: 'Jane Doe',
        status: TaskStatus.TODO,
        category: TaskCategory.FEATURE,
        estimatedHours: 5,
      };

      mockInstance.default.mockResolvedValueOnce({
        data: { data: { ...mockTask, ...newTaskData, id: '2' } },
      });

      const result = await requestCreateTask({
        task: newTaskData,
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'post',
        url: '/tasks',
        data: newTaskData,
        signal: undefined,
      });
      expect(result.data).toEqual({
        ...mockTask,
        ...newTaskData,
        id: '2',
      });
    });

    it('should handle creation errors', async () => {
      const mockInstance = await import('./instance');
      const creationError = new Error('Creation failed');
      mockInstance.default.mockRejectedValueOnce(creationError);

      const newTaskData = {
        title: 'New Task',
        dueDate: '2024-12-31T23:59:59.000Z',
        assignedTo: 'Jane Doe',
        status: TaskStatus.TODO,
        category: TaskCategory.FEATURE,
        estimatedHours: 5,
      };

      await expect(requestCreateTask({
        task: newTaskData,
      })).rejects.toThrow(creationError);
    });
  });

  describe('requestEditTask', async () => {
    const { requestEditTask } = await import('./tasks');

    it('should update an existing task', async () => {
      const mockInstance = await import('./instance');
      const updateData = {
        title: 'Updated Task',
        status: TaskStatus.IN_PROGRESS,
      };

      mockInstance.default.mockResolvedValueOnce({
        data: { data: { ...mockTask, ...updateData } },
      });

      const result = await requestEditTask({
        id: '1',
        updates: updateData,
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'put',
        url: '/tasks/1',
        data: updateData,
        signal: undefined,
      });
      expect(result.data).toEqual({
        ...mockTask,
        ...updateData,
      });
    });
  });

  describe('requestDeleteTask', async () => {
    const { requestDeleteTask } = await import('./tasks');

    it('should delete a task', async () => {
      const mockInstance = await import('./instance');
      mockInstance.default.mockResolvedValueOnce(undefined);

      await requestDeleteTask({
        id: '1',
      });

      expect(mockInstance.default).toHaveBeenCalledWith({
        method: 'delete',
        url: '/tasks/1',
        signal: undefined,
      });
    });

    it('should handle delete errors', async () => {
      const mockInstance = await import('./instance');
      const deleteError = new Error('Delete failed');
      mockInstance.default.mockRejectedValueOnce(deleteError);

      await expect(requestDeleteTask({
        id: '1',
      })).rejects.toThrow(deleteError);
    });
  });
});