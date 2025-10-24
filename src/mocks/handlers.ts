import { http, HttpResponse } from 'msw';
import { mockTasks, addMockTask, updateMockTask, deleteMockTask } from './data';
import type { Task } from '@/domain-models';

export const handlers = [
  // Get all tasks with pagination, search, and filter
  http.get('http://localhost:3000/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const searchText = url.searchParams.get('searchText') || '';
    const status = url.searchParams.get('status') || '';
    const category = url.searchParams.get('category') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let filteredTasks = [...mockTasks];

    // Apply search filter
    if (searchText) {
      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchText.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    // Apply category filter
    if (category) {
      filteredTasks = filteredTasks.filter((task) => task.category === category);
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      const aValue = a[sortBy as keyof Task];
      const bValue = b[sortBy as keyof Task];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTasks = filteredTasks.slice(start, end);

    return HttpResponse.json({
      data: paginatedTasks,
      meta: {
        total: filteredTasks.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredTasks.length / pageSize),
      },
    });
  }),

  // Get single task
  http.get('http://localhost:3000/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const task = mockTasks.find((t) => t.id === id);

    if (!task) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Task not found',
      });
    }

    return HttpResponse.json({ data: task });
  }),

  // Create task
  http.post('http://localhost:3000/api/tasks', async ({ request }) => {
    const body = await request.json() as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
    const newTask = addMockTask(body);

    return HttpResponse.json({ data: newTask }, { status: 201 });
  }),

  // Update task
  http.put('http://localhost:3000/api/tasks/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Task>;
    const updatedTask = updateMockTask(id as string, updates);

    if (!updatedTask) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Task not found',
      });
    }

    return HttpResponse.json({ data: updatedTask });
  }),

  // Delete task
  http.delete('http://localhost:3000/api/tasks/:id', ({ params }) => {
    const { id } = params;
    const deleted = deleteMockTask(id as string);

    if (!deleted) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Task not found',
      });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
