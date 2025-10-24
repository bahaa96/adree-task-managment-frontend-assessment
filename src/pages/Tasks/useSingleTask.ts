import { useState, useEffect, useCallback, useRef } from 'react';
import { requestFetchSingleTask } from '@/network';
import type { Task } from '@/domain-models';

interface UseSingleTaskOptions {
  immediate?: boolean;
}

interface UseSingleTaskReturn {
  task: Task | null;
  loading: boolean;
  error: string | null;
  fetchTask: () => Promise<void>;
  clearTask: () => void;
}

export const useSingleTask = (
  id: string,
  options: UseSingleTaskOptions = { immediate: true }
): UseSingleTaskReturn => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await requestFetchSingleTask({
        id,
        options: {
          signal: controller.signal,
        },
      });

      setTask(response.data);
    } catch (err) {
      // Only show error if request wasn't cancelled
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setTask(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearTask = useCallback(() => {
    setTask(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate && id) {
      fetchTask();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id, options.immediate]);

  return {
    task,
    loading,
    error,
    fetchTask,
    clearTask,
  };
};