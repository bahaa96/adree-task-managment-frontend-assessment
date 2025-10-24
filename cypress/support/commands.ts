// Custom Cypress commands for the task management app

// Custom command to navigate to a specific page
Cypress.Commands.add('visitPage', (page: string) => {
  cy.visit(page);
  cy.waitForApi();
});

// Custom command to login (if authentication is added later)
Cypress.Commands.add('login', (username = 'testuser', password = 'testpass') => {
  cy.visit('/login');
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Custom command to create a task via the UI
Cypress.Commands.add('createTask', (taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'This is a test task created by Cypress',
    status: 'todo',
    priority: 'medium'
  };

  const task = { ...defaultTask, ...taskData };

  // Navigate to tasks page
  cy.visitPage('/tasks');

  // Click create task button
  cy.get('[data-testid="create-task-button"]').click();

  // Wait for modal to appear
  cy.get('[data-testid="task-modal"]').should('be.visible');

  // Fill out form
  cy.get('[data-testid="task-title-input"]').clear().type(task.title);

  if (task.description) {
    cy.get('[data-testid="task-description-input"]').clear().type(task.description);
  }

  // Select status if provided
  if (task.status) {
    cy.get('[data-testid="task-status-select"]').click();
    cy.get(`[data-value="${task.status}"]`).click();
  }

  // Select priority if provided
  if (task.priority) {
    cy.get('[data-testid="task-priority-select"]').click();
    cy.get(`[data-value="${task.priority}"]`).click();
  }

  // Submit form
  cy.get('[data-testid="save-task-button"]').click();

  // Wait for modal to close and task to appear
  cy.get('[data-testid="task-modal"]').should('not.exist');
  cy.contains(task.title).should('be.visible');
});

// Custom command to wait for API calls to complete
Cypress.Commands.add('waitForApi', () => {
  cy.wait(500); // Give time for MSW and API calls to complete
});

// Custom command to check dashboard metrics
Cypress.Commands.add('checkDashboardMetrics', () => {
  cy.visitPage('/');

  // Check that metric cards are visible
  cy.get('[data-testid="total-tasks-card"]').should('be.visible');
  cy.get('[data-testid="completed-tasks-card"]').should('be.visible');
  cy.get('[data-testid="pending-tasks-card"]').should('be.visible');
  cy.get('[data-testid="in-progress-tasks-card"]').should('be.visible');

  // Check that charts are visible
  cy.get('[data-testid="status-chart"]').should('be.visible');
  cy.get('[data-testid="priority-chart"]').should('be.visible');

  // Check that recent activity is visible
  cy.get('[data-testid="recent-activity"]').should('be.visible');
});

// Custom command to test responsive design
Cypress.Commands.add('testResponsive', () => {
  // Test desktop view
  cy.viewport(1280, 720);
  cy.get('[data-testid="desktop-navigation"]').should('be.visible');
  cy.get('[data-testid="mobile-navigation"]').should('not.exist');

  // Test tablet view
  cy.viewport(768, 1024);
  cy.get('[data-testid="desktop-navigation"]').should('be.visible');
  cy.get('[data-testid="mobile-navigation"]').should('not.exist');

  // Test mobile view
  cy.viewport(375, 667);
  cy.get('[data-testid="desktop-navigation"]').should('not.exist');
  cy.get('[data-testid="mobile-navigation"]').should('be.visible');

  // Reset to desktop
  cy.viewport(1280, 720);
});

// Custom command to search and filter tasks
Cypress.Commands.add('searchAndFilterTasks', (searchTerm?: string, filters?: any) => {
  cy.visitPage('/tasks');

  // Search functionality
  if (searchTerm) {
    cy.get('[data-testid="search-input"]').clear().type(searchTerm);
    cy.waitForApi();
  }

  // Filter by status
  if (filters?.status) {
    cy.get('[data-testid="status-filter"]').click();
    cy.get(`[data-value="${filters.status}"]`).click();
    cy.waitForApi();
  }

  // Filter by priority
  if (filters?.priority) {
    cy.get('[data-testid="priority-filter"]').click();
    cy.get(`[data-value="${filters.priority}"]`).click();
    cy.waitForApi();
  }

  // Sort tasks
  if (filters?.sortBy) {
    cy.get('[data-testid="sort-select"]').click();
    cy.get(`[data-value="${filters.sortBy}"]`).click();
    cy.waitForApi();
  }
});

// Export for TypeScript
export {};