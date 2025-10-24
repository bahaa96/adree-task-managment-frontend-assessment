import { useState, useEffect, useCallback, useRef } from 'react';
import {
  requestFetchAllTasks,
  type RequestFetchAllTasksArgs,
  type RequestFetchAllTasksResponse,
} from '@/network';
import type { Task } from '@/domain-models';

interface UseAllTasksOptions {
  immediate?: boolean;
}

interface UseAllTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
  fetchTasks: (params?: Partial<RequestFetchAllTasksArgs>) => Promise<void>;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAllTasks = (
  initialParams: RequestFetchAllTasksArgs,
  options: UseAllTasksOptions = { immediate: true }
): UseAllTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<RequestFetchAllTasksResponse['meta'] | null>(null);
  const [currentParams, setCurrentParams] = useState(initialParams);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTasks = useCallback(
    async (params?: Partial<RequestFetchAllTasksArgs>) => {
      const finalParams = { ...currentParams, ...params };
      setCurrentParams(finalParams);

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const response = await requestFetchAllTasks({
          ...finalParams,
          options: {
            signal: abortControllerRef.current.signal,
          },
        });

        // If this is a page change (not initial load), append to existing tasks
        if (params?.page && params.page > 1) {
          setTasks(prev => [...prev, ...response.data]);
        } else {
          setTasks(response.data);
        }

        setMeta(response.meta);
      } catch (err) {
        // Only show error if request wasn't cancelled
        if (!abortControllerRef.current?.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchNextPage = useCallback(async () => {
    if (!meta || meta.page >= meta.totalPages) {
      return;
    }

    await fetchTasks({
      ...currentParams,
      page: meta.page + 1,
    });
  }, [fetchTasks, meta]);

  const refetch = useCallback(async () => {
    await fetchTasks(initialParams);
  }, [fetchTasks, initialParams]);

  const hasNextPage = Boolean(meta && meta.page < meta.totalPages);

  useEffect(() => {
    if (options.immediate) {
      fetchTasks();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    tasks,
    loading,
    error,
    meta,
    fetchTasks,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
};