/// <reference types="cypress" />

// Task interface for testing
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      visitPage(page: string): Chainable<Element>;
      createTask(taskData?: Partial<Task>): Chainable<Element>;
      checkDashboardMetrics(): Chainable<Element>;
      testResponsive(): Chainable<Element>;
      searchAndFilterTasks(searchTerm?: string, filters?: any): Chainable<Element>;
      login(username?: string, password?: string): Chainable<Element>;
      waitForApi(): Chainable<Element>;
    }
  }
}

export {};