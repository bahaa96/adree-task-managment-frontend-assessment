describe('Error Handling and Edge Cases', () => {
  beforeEach(() => {
    cy.visitPage('/');
  });

  it('should handle network errors gracefully', () => {
    // Mock network error for tasks API
    cy.intercept('GET', '/api/tasks', { forceNetworkError: true }).as('getTasksError');

    cy.visit('/tasks');
    cy.wait('@getTasksError');

    // Should show error message
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Failed to load tasks');

    // Should have retry button
    cy.get('[data-testid="retry-button"]').should('be.visible');

    // Should not show loading state
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should handle server errors gracefully', () => {
    // Mock server error
    cy.intercept('GET', '/api/tasks', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('getTasksServerError');

    cy.visit('/tasks');
    cy.wait('@getTasksServerError');

    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle empty data states', () => {
    // Mock empty tasks response
    cy.intercept('GET', '/api/tasks', { body: [] }).as('getEmptyTasks');

    cy.visit('/tasks');
    cy.wait('@getEmptyTasks');

    // Should show empty state message
    cy.get('[data-testid="empty-state"]').should('be.visible');
    cy.get('[data-testid="empty-state"]').should('contain', 'No tasks found');

    // Should show create task CTA
    cy.get('[data-testid="create-task-cta"]').should('be.visible');
  });

  it('should handle form validation errors', () => {
    cy.visit('/tasks');
    cy.get('[data-testid="create-task-button"]').click();

    // Try to submit empty form
    cy.get('[data-testid="save-task-button"]').click();

    // Should show validation errors
    cy.get('[data-testid="error-text"]').should('be.visible');
    cy.get('[data-testid="task-title-input"]').should('have.attr', 'aria-invalid', 'true');

    // Should not close modal
    cy.get('[data-testid="task-modal"]').should('be.visible');
  });

  it('should handle API errors during task creation', () => {
    // Mock creation error
    cy.intercept('POST', '/api/tasks', {
      statusCode: 400,
      body: { error: 'Invalid task data' }
    }).as('createTaskError');

    cy.visit('/tasks');
    cy.get('[data-testid="create-task-button"]').click();

    cy.get('[data-testid="task-title-input"]').type('Test Task');
    cy.get('[data-testid="task-description-input"]').type('Test Description');
    cy.get('[data-testid="save-task-button"]').click();

    cy.wait('@createTaskError');

    // Should show error message
    cy.get('[data-testid="form-error"]').should('be.visible');

    // Should keep modal open for correction
    cy.get('[data-testid="task-modal"]').should('be.visible');
  });

  it('should handle API errors during task update', () => {
    // First create a task normally
    cy.createTask({ title: 'Task to Update' });

    // Mock update error
    cy.intercept('PUT', '/api/tasks/*', {
      statusCode: 404,
      body: { error: 'Task not found' }
    }).as('updateTaskError');

    // Try to edit the task
    cy.contains('Task to Update').parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="edit-task-button"]').click();
    });

    cy.get('[data-testid="task-title-input"]').clear().type('Updated Title');
    cy.get('[data-testid="save-task-button"]').click();

    cy.wait('@updateTaskError');

    // Should show error message
    cy.get('[data-testid="form-error"]').should('be.visible');
  });

  it('should handle API errors during task deletion', () => {
    // First create a task normally
    cy.createTask({ title: 'Task to Delete' });

    // Mock deletion error
    cy.intercept('DELETE', '/api/tasks/*', {
      statusCode: 403,
      body: { error: 'Permission denied' }
    }).as('deleteTaskError');

    // Try to delete the task
    cy.contains('Task to Delete').parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="delete-task-button"]').click();
    });

    cy.get('[data-testid="confirm-delete-button"]').click();

    cy.wait('@deleteTaskError');

    // Should show error message
    cy.get('[data-testid="error-toast"]').should('be.visible');

    // Task should still exist
    cy.contains('Task to Delete').should('be.visible');
  });

  it('should handle malformed API responses', () => {
    // Mock malformed response
    cy.intercept('GET', '/api/tasks', {
      body: 'Invalid JSON response',
      headers: { 'content-type': 'application/json' }
    }).as('malformedResponse');

    cy.visit('/tasks');
    cy.wait('@malformedResponse');

    // Should show error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle slow API responses', () => {
    // Mock slow response
    cy.intercept('GET', '/api/tasks', {
      delay: 5000,
      fixture: 'tasks.json'
    }).as('slowTasks');

    cy.visit('/tasks');

    // Should show loading state
    cy.get('[data-testid="loading-spinner"]').should('be.visible');

    // Should eventually load
    cy.wait('@slowTasks');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    cy.get('[data-testid="tasks-list"]').should('be.visible');
  });

  it('should handle browser back/forward navigation with errors', () => {
    // Start with error state
    cy.intercept('GET', '/api/tasks', { forceNetworkError: true }).as('getTasksError');

    cy.visit('/tasks');
    cy.wait('@getTasksError');
    cy.get('[data-testid="error-message"]').should('be.visible');

    // Navigate to dashboard
    cy.visit('/');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');

    // Navigate back
    cy.go('back');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle concurrent API requests', () => {
    // Mock slow responses for multiple endpoints
    cy.intercept('GET', '/api/tasks', {
      delay: 2000,
      fixture: 'tasks.json'
    }).as('getTasksSlow');

    cy.intercept('GET', '/api/metrics', {
      delay: 1500,
      body: { totalTasks: 10, completedTasks: 5 }
    }).as('getMetricsSlow');

    cy.visit('/tasks');
    cy.wait('@getTasksSlow');

    cy.visit('/');
    cy.wait('@getMetricsSlow');

    // Should handle both slow responses
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
    cy.get('[data-testid="tasks-page"]').should('not.be.visible');
  });

  it('should handle memory leaks and cleanup', () => {
    // Test rapid navigation
    for (let i = 0; i < 10; i++) {
      cy.visit('/tasks');
      cy.visit('/');
    }

    // Application should still be responsive
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
  });

  it('should handle browser storage errors', () => {
    // Mock localStorage error
    cy.window().then((win) => {
      const originalSetItem = win.localStorage.setItem;
      win.localStorage.setItem = () => {
        throw new Error('Storage quota exceeded');
      };
    });

    // Navigate and interact
    cy.visit('/tasks');
    cy.get('[data-testid="create-task-button"]').click();

    // Should not break the application
    cy.get('[data-testid="task-modal"]').should('be.visible');
  });

  it('should handle accessibility during error states', () => {
    cy.intercept('GET', '/api/tasks', { forceNetworkError: true }).as('getTasksError');

    cy.visit('/tasks');
    cy.wait('@getTasksError');

    // Error message should be accessible
    cy.get('[data-testid="error-message"]').should('have.attr', 'role', 'alert');
    cy.get('[data-testid="retry-button"]').should('have.attr', 'aria-label');

    // Should be keyboard navigable
    cy.get('[data-testid="retry-button"]').focus();
    cy.focused().should('have.attr', 'data-testid', 'retry-button');
  });
});