export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
}

export enum TaskCategory {
  DEVELOPMENT = 'DEVELOPMENT',
  DESIGN = 'DESIGN',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  MEETING = 'MEETING',
  RESEARCH = 'RESEARCH',
  BUG_FIX = 'BUG_FIX',
  FEATURE = 'FEATURE',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  assignedTo: string;
  status: TaskStatus;
  category: TaskCategory;
  estimatedHours: number;
}
