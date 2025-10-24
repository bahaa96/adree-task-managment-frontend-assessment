import type { Task } from '@/domain-models';
import { TaskStatus, TaskCategory } from '@/domain-models';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication system',
    dueDate: new Date('2025-11-01').toISOString(),
    createdAt: new Date('2025-10-15').toISOString(),
    updatedAt: new Date('2025-10-20').toISOString(),
    assignedTo: 'John Doe',
    status: TaskStatus.IN_PROGRESS,
    category: TaskCategory.DEVELOPMENT,
    estimatedHours: 8,
  },
  {
    id: '2',
    title: 'Design landing page mockups',
    description: 'Create high-fidelity mockups for the landing page',
    dueDate: new Date('2025-10-28').toISOString(),
    createdAt: new Date('2025-10-10').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Jane Smith',
    status: TaskStatus.COMPLETED,
    category: TaskCategory.DESIGN,
    estimatedHours: 6,
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints',
    dueDate: new Date('2025-11-05').toISOString(),
    createdAt: new Date('2025-10-18').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Bob Johnson',
    status: TaskStatus.TODO,
    category: TaskCategory.DOCUMENTATION,
    estimatedHours: 4,
  },
  {
    id: '4',
    title: 'Fix login bug on mobile',
    description: 'Investigate and fix login issue on iOS Safari',
    dueDate: new Date('2025-10-20').toISOString(),
    createdAt: new Date('2025-10-12').toISOString(),
    updatedAt: new Date('2025-10-19').toISOString(),
    assignedTo: 'Alice Brown',
    status: TaskStatus.OVERDUE,
    category: TaskCategory.BUG_FIX,
    estimatedHours: 3,
  },
  {
    id: '5',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated deployment',
    dueDate: new Date('2025-11-10').toISOString(),
    createdAt: new Date('2025-10-20').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Charlie Wilson',
    status: TaskStatus.TODO,
    category: TaskCategory.DEVELOPMENT,
    estimatedHours: 5,
  },
  {
    id: '6',
    title: 'User testing session',
    description: 'Conduct user testing with 10 participants',
    dueDate: new Date('2025-11-03').toISOString(),
    createdAt: new Date('2025-10-16').toISOString(),
    updatedAt: new Date('2025-10-21').toISOString(),
    assignedTo: 'Diana Martinez',
    status: TaskStatus.IN_PROGRESS,
    category: TaskCategory.TESTING,
    estimatedHours: 10,
  },
  {
    id: '7',
    title: 'Research new frontend frameworks',
    description: 'Evaluate Next.js and Remix for future projects',
    dueDate: new Date('2025-11-15').toISOString(),
    createdAt: new Date('2025-10-19').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Evan Davis',
    status: TaskStatus.TODO,
    category: TaskCategory.RESEARCH,
    estimatedHours: 6,
  },
  {
    id: '8',
    title: 'Weekly team standup',
    description: 'Monday morning team sync meeting',
    dueDate: new Date('2025-10-26').toISOString(),
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Team Lead',
    status: TaskStatus.TODO,
    category: TaskCategory.MEETING,
    estimatedHours: 1,
  },
  {
    id: '9',
    title: 'Implement dark mode',
    description: 'Add dark mode support across the application',
    dueDate: new Date('2025-11-08').toISOString(),
    createdAt: new Date('2025-10-17').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
    assignedTo: 'Fiona Garcia',
    status: TaskStatus.IN_PROGRESS,
    category: TaskCategory.FEATURE,
    estimatedHours: 7,
  },
  {
    id: '10',
    title: 'Update dependencies',
    description: 'Update all npm packages to latest stable versions',
    dueDate: new Date('2025-10-25').toISOString(),
    createdAt: new Date('2025-10-14').toISOString(),
    updatedAt: new Date('2025-10-21').toISOString(),
    assignedTo: 'George Lee',
    status: TaskStatus.COMPLETED,
    category: TaskCategory.DEVELOPMENT,
    estimatedHours: 2,
  },
];

export const addMockTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  return newTask;
};

export const updateMockTask = (id: string, updates: Partial<Task>): Task | null => {
  const index = mockTasks.findIndex((task) => task.id === id);
  if (index === -1) return null;
  
  mockTasks[index] = {
    ...mockTasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockTasks[index];
};

export const deleteMockTask = (id: string): boolean => {
  const index = mockTasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  
  mockTasks.splice(index, 1);
  return true;
};
