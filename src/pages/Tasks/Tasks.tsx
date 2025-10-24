import { useState, useEffect } from 'react';
import { Table } from '@/components';
import { Card } from '@/components';
import { Badge } from '@/components';
import { Button } from '@/components';
import { LoadingSpinner } from '@/components';
import { useAllTasks } from '../Dashboard/useAllTasks';
import { useIsMobile } from '@/components/Layout/useMediaQuery';
import { useDeleteTask } from './useDeleteTask';
import { useCreateTask } from './useCreateTask';
import type { Task } from '@/domain-models';
import { TaskStatus, TaskCategory } from '@/domain-models';
import { cn } from '@/lib/cn';

export const Tasks = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: TaskStatus.TODO,
    category: TaskCategory.DEVELOPMENT,
    estimatedHours: 1,
  });

  const isMobile = useIsMobile();
  const { deleteTask } = useDeleteTask();
  const { createTask, isLoading: isCreating, error: createError } = useCreateTask();

  const {
    tasks,
    loading,
    error,
    meta,
    fetchTasks,
    hasNextPage,
    fetchNextPage,
  } = useAllTasks(
    {
      page: currentPage,
      pageSize,
      searchText,
      status: statusFilter,
      category: categoryFilter,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    { immediate: true }
  );

  useEffect(() => {
    if (currentPage > 1) {
      fetchTasks({
        page: currentPage,
        pageSize,
        searchText,
        status: statusFilter,
        category: categoryFilter,
      });
    }
  }, [currentPage, fetchTasks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTasks({
      page: 1,
      pageSize,
      searchText,
      status: statusFilter,
      category: categoryFilter,
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage && isMobile) {
      fetchNextPage();
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks(); // Refresh the list
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCreateTask = () => {
    setCreateModalOpen(true);
  };

  const handleCreateCancel = () => {
    setCreateModalOpen(false);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      assignedTo: '',
      status: TaskStatus.TODO,
      category: TaskCategory.DEVELOPMENT,
      estimatedHours: 1,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedHours' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      assignedTo: formData.assignedTo,
      status: formData.status,
      category: formData.category,
      estimatedHours: formData.estimatedHours,
    };

    const newTask = await createTask(taskData);
    if (newTask) {
      setCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: '',
        status: TaskStatus.TODO,
        category: TaskCategory.DEVELOPMENT,
        estimatedHours: 1,
      });
      fetchTasks(); // Refresh the list
    }
  };

  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.OVERDUE:
        return 'danger';
      case TaskStatus.IN_PROGRESS:
        return 'secondary';
      default:
        return 'ghost';
    }
  };

  if (error && !tasks.length) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">
            Error loading tasks
          </div>
          <div className="text-gray-500 mb-4">{String(error)}</div>
          <Button variant="primary" onClick={() => fetchTasks()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
        </div>

        <Button variant="primary" className="mt-4 sm:mt-0" onClick={handleCreateTask}>
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Task
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
              <option value={TaskStatus.OVERDUE}>Overdue</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value={TaskCategory.DEVELOPMENT}>Development</option>
              <option value={TaskCategory.DESIGN}>Design</option>
              <option value={TaskCategory.TESTING}>Testing</option>
              <option value={TaskCategory.DOCUMENTATION}>Documentation</option>
              <option value={TaskCategory.MEETING}>Meeting</option>
              <option value={TaskCategory.RESEARCH}>Research</option>
              <option value={TaskCategory.BUG_FIX}>Bug Fix</option>
              <option value={TaskCategory.FEATURE}>Feature</option>
            </select>

            <Button type="submit" variant="primary">
              Apply Filters
            </Button>
          </div>
        </form>
      </Card>

      {/* Tasks Table/Desktop View */}
      {!isMobile && (
        <Card className="p-6">
          {loading && currentPage === 1 ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <Table striped hoverable>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Title</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Category</Table.Head>
                  <Table.Head>Assigned To</Table.Head>
                  <Table.Head>Est. Hours</Table.Head>
                  <Table.Head>Due Date</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tasks.map((task: Task) => (
                  <Table.Row key={task.id}>
                    <Table.Cell>
                      <div>
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{task.category.replace('_', ' ')}</Table.Cell>
                    <Table.Cell>{task.assignedTo}</Table.Cell>
                    <Table.Cell>{task.estimatedHours}h</Table.Cell>
                    <Table.Cell>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(task)}>
                          Delete
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">No tasks found</div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={currentPage === meta.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Mobile List View */}
      {isMobile && (
        <div className="space-y-4">
          {loading && currentPage === 1 ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            tasks.map((task: Task) => (
              <Card key={task.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(task.status)}
                      size="sm"
                      className="ml-2"
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="capitalize">
                      {task.category.replace('_', ' ')}
                    </span>
                    <span>{task.assignedTo}</span>
                    <span>{task.estimatedHours}h</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(task)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}

          {!loading && tasks.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-500">No tasks found</div>
            </Card>
          )}

          {/* Load More Button for Mobile */}
          {hasNextPage && !loading && (
            <div className="flex justify-center mt-4">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{taskToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={handleDeleteCancel}
                className="text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Create New Task</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter task title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Due Date */}
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Assigned To */}
                <div>
                  <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To *
                  </label>
                  <input
                    type="text"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter assignee name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={TaskCategory.DEVELOPMENT}>Development</option>
                    <option value={TaskCategory.DESIGN}>Design</option>
                    <option value={TaskCategory.TESTING}>Testing</option>
                    <option value={TaskCategory.DOCUMENTATION}>Documentation</option>
                    <option value={TaskCategory.MEETING}>Meeting</option>
                    <option value={TaskCategory.RESEARCH}>Research</option>
                    <option value={TaskCategory.BUG_FIX}>Bug Fix</option>
                    <option value={TaskCategory.FEATURE}>Feature</option>
                  </select>
                </div>

                {/* Estimated Hours */}
                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Est. Hours *
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleInputChange}
                    required
                    min="0.5"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Error Message */}
              {createError && (
                <div className="text-red-600 text-sm">
                  Error creating task: {String(createError)}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCreateCancel}
                  className="text-gray-700 hover:bg-gray-100"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCreating}
                  loading={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
