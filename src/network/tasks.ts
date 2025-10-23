import instance from './instance';
import { Task } from '@/domain-models';

interface RequestFetchAllTasksArgs {
  page: number;
  pageSize: number;
  searchText?: string;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  options?: {
    signal: AbortSignal;
  };
}

interface RequestFetchAllTasksResponse {
  data: Task[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const requestFetchAllTasks = async ({
  page,
  pageSize,
  searchText = '',
  status = '',
  category = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  options,
}: RequestFetchAllTasksArgs): Promise<RequestFetchAllTasksResponse> => {
  const { data } = await instance<RequestFetchAllTasksResponse>({
    method: 'get',
    url: '/tasks',
    params: {
      page,
      pageSize,
      searchText,
      status,
      category,
      sortBy,
      sortOrder,
    },
    signal: options?.signal,
  });

  return data;
};

interface RequestFetchSingleTaskArgs {
  id: string;
  options?: {
    signal: AbortSignal;
  };
}

interface RequestFetchSingleTaskResponse {
  data: Task;
}

const requestFetchSingleTask = async ({
  id,
  options,
}: RequestFetchSingleTaskArgs): Promise<{ data: Task }> => {
  const { data } = await instance<RequestFetchSingleTaskResponse>({
    method: 'get',
    url: `/tasks/${id}`,
    signal: options?.signal,
  });

  return data;
};

interface RequestCreateTaskArgs {
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
  options?: {
    signal: AbortSignal;
  };
}

interface RequestCreateTaskResponse {
  data: Task;
}

const requestCreateTask = async ({
  task,
  options,
}: RequestCreateTaskArgs): Promise<{ data: Task }> => {
  const { data } = await instance<RequestCreateTaskResponse>({
    method: 'post',
    url: '/tasks',
    data: task,
    signal: options?.signal,
  });

  return data;
};

interface RequestEditTaskArgs {
  id: string;
  updates: Partial<Task>;
  options?: {
    signal: AbortSignal;
  };
}

interface RequestEditTaskResponse {
  data: Task;
}

const requestEditTask = async ({
  id,
  updates,
  options,
}: RequestEditTaskArgs): Promise<{ data: Task }> => {
  const { data } = await instance<RequestEditTaskResponse>({
    method: 'put',
    url: `/tasks/${id}`,
    data: updates,
    signal: options?.signal,
  });

  return data;
};

interface RequestDeleteTaskArgs {
  id: string;
  options?: {
    signal: AbortSignal;
  };
}

const requestDeleteTask = async ({
  id,
  options,
}: RequestDeleteTaskArgs): Promise<void> => {
  await instance({
    method: 'delete',
    url: `/tasks/${id}`,
    signal: options?.signal,
  });
};

export {
  requestFetchAllTasks,
  requestFetchSingleTask,
  requestCreateTask,
  requestEditTask,
  requestDeleteTask,
};
