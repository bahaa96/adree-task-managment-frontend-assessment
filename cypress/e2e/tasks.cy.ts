describe('Tasks Page', () => {
  beforeEach(() => {
    cy.visitPage('/tasks');
  });

  it('should display the tasks page correctly', () => {
    cy.title().should('include', 'TaskMaster');
    cy.get('[data-testid="tasks-page"]').should('be.visible');
    cy.get('[data-testid="page-title"]').should('contain', 'Tasks');
  });

  it('should display task list/table correctly', () => {
    // Check that tasks are loaded
    cy.get('[data-testid="tasks-list"]').should('be.visible');

    // Check table headers (desktop)
    cy.get('[data-testid="task-table"]').should('be.visible');
    cy.get('[data-testid="table-header-title"]').should('contain', 'Title');
    cy.get('[data-testid="table-header-status"]').should('contain', 'Status');
    cy.get('[data-testid="table-header-priority"]').should('contain', 'Priority');
    cy.get('[data-testid="table-header-date"]').should('contain', 'Created');
    cy.get('[data-testid="table-header-actions"]').should('contain', 'Actions');

    // Check that task rows are present
    cy.get('[data-testid="task-row"]').should('have.length.greaterThan', 0);
  });

  it('should create a new task successfully', () => {
    const taskData = {
      title: 'E2E Test Task',
      description: 'This task was created by Cypress E2E test',
      status: 'todo',
      priority: 'high'
    };

    cy.createTask(taskData);

    // Verify the task appears in the list
    cy.contains(taskData.title).should('be.visible');
    cy.get('[data-testid="task-row"]').contains(taskData.title).parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="task-status"]').should('contain', 'To Do');
      cy.get('[data-testid="task-priority"]').should('contain', 'High');
    });
  });

  it('should edit an existing task', () => {
    // First create a task
    const originalTask = {
      title: 'Original Task Title',
      description: 'Original description'
    };
    cy.createTask(originalTask);

    // Find and click edit button for the created task
    cy.contains(originalTask.title).parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="edit-task-button"]').click();
    });

    // Edit the task
    cy.get('[data-testid="task-modal"]').should('be.visible');
    cy.get('[data-testid="task-title-input"]').clear().type('Updated Task Title');
    cy.get('[data-testid="task-description-input"]').clear().type('Updated description');

    // Change status
    cy.get('[data-testid="task-status-select"]').click();
    cy.get('[data-value="in-progress"]').click();

    // Save changes
    cy.get('[data-testid="save-task-button"]').click();

    // Verify changes
    cy.contains('Updated Task Title').should('be.visible');
    cy.contains('Updated Task Title').parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="task-status"]').should('contain', 'In Progress');
    });
  });

  it('should delete a task', () => {
    // First create a task
    const taskToDelete = {
      title: 'Task to Delete'
    };
    cy.createTask(taskToDelete);

    // Verify task exists
    cy.contains(taskToDelete.title).should('be.visible');

    // Delete the task
    cy.contains(taskToDelete.title).parents('[data-testid="task-row"]').within(() => {
      cy.get('[data-testid="delete-task-button"]').click();
    });

    // Confirm deletion
    cy.get('[data-testid="confirm-delete-modal"]').should('be.visible');
    cy.get('[data-testid="confirm-delete-button"]').click();

    // Verify task is gone
    cy.contains(taskToDelete.title).should('not.exist');
  });

  it('should search tasks correctly', () => {
    // Create a few tasks for testing
    cy.createTask({ title: 'Search Test Task 1' });
    cy.createTask({ title: 'Another Search Task' });
    cy.createTask({ title: 'Third Test Task' });

    // Search for specific task
    cy.get('[data-testid="search-input"]').clear().type('Search Test Task 1');
    cy.waitForApi();

    // Should only show matching tasks
    cy.contains('Search Test Task 1').should('be.visible');
    cy.contains('Another Search Task').should('not.exist');
    cy.contains('Third Test Task').should('not.exist');

    // Clear search
    cy.get('[data-testid="search-input"]').clear();
    cy.waitForApi();

    // Should show all tasks again
    cy.contains('Search Test Task 1').should('be.visible');
    cy.contains('Another Search Task').should('be.visible');
    cy.contains('Third Test Task').should('be.visible');
  });

  it('should filter tasks by status', () => {
    // Create tasks with different statuses
    cy.createTask({ title: 'Todo Task', status: 'todo' });
    cy.createTask({ title: 'In Progress Task', status: 'in-progress' });
    cy.createTask({ title: 'Completed Task', status: 'completed' });

    // Filter by "To Do" status
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-value="todo"]').click();
    cy.waitForApi();

    // Should only show todo tasks
    cy.contains('Todo Task').should('be.visible');
    cy.contains('In Progress Task').should('not.exist');
    cy.contains('Completed Task').should('not.exist');

    // Clear filter
    cy.get('[data-testid="status-filter"]').click();
    cy.get('[data-value="all"]').click();
    cy.waitForApi();
  });

  it('should filter tasks by priority', () => {
    // Create tasks with different priorities
    cy.createTask({ title: 'Low Priority Task', priority: 'low' });
    cy.createTask({ title: 'Medium Priority Task', priority: 'medium' });
    cy.createTask({ title: 'High Priority Task', priority: 'high' });

    // Filter by "High" priority
    cy.get('[data-testid="priority-filter"]').click();
    cy.get('[data-value="high"]').click();
    cy.waitForApi();

    // Should only show high priority tasks
    cy.contains('High Priority Task').should('be.visible');
    cy.contains('Low Priority Task').should('not.exist');
    cy.contains('Medium Priority Task').should('not.exist');
  });

  it('should sort tasks correctly', () => {
    // Create tasks for sorting
    cy.createTask({ title: 'A Task' });
    cy.createTask({ title: 'B Task' });
    cy.createTask({ title: 'C Task' });

    // Sort by title ascending
    cy.get('[data-testid="sort-select"]').click();
    cy.get('[data-value="title-asc"]').click();
    cy.waitForApi();

    // Check order (this might need adjustment based on your implementation)
    cy.get('[data-testid="task-row"]').first().should('contain', 'A Task');
  });

  it('should be responsive on different screen sizes', () => {
    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('[data-testid="task-table"]').should('be.visible');
    cy.get('[data-testid="tasks-mobile-list"]').should('not.exist');

    // Test mobile view
    cy.viewport(375, 667);
    cy.get('[data-testid="task-table"]').should('not.exist');
    cy.get('[data-testid="tasks-mobile-list"]').should('be.visible');

    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('[data-testid="task-table"]').should('be.visible');
  });

  it('should handle task modal interactions', () => {
    // Open create task modal
    cy.get('[data-testid="create-task-button"]').click();
    cy.get('[data-testid="task-modal"]').should('be.visible');

    // Test form validation
    cy.get('[data-testid="save-task-button"]').click();
    cy.get('[data-testid="task-title-input"]').should('have.attr', 'required');

    // Test modal close
    cy.get('[data-testid="cancel-task-button"]').click();
    cy.get('[data-testid="task-modal"]').should('not.exist');

    // Test escape key close
    cy.get('[data-testid="create-task-button"]').click();
    cy.get('body').type('{esc}');
    cy.get('[data-testid="task-modal"]').should('not.exist');
  });

  it('should handle pagination or infinite scroll', () => {
    // Test if pagination exists
    cy.get('[data-testid="pagination"]').should('be.visible');

    // Or test infinite scroll if that's implemented
    cy.get('[data-testid="load-more"]').should('be.visible');
  });

  it('should display loading and error states', () => {
    // Loading state (mock slow network)
    cy.intercept('GET', '/api/tasks', { delay: 2000, fixture: 'tasks.json' }).as('getTasks');
    cy.visit('/tasks');
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.wait('@getTasks');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');

    // Error state (mock API error)
    cy.intercept('GET', '/api/tasks', { forceNetworkError: true }).as('getTasksError');
    cy.visit('/tasks');
    cy.wait('@getTasksError');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should handle bulk actions if available', () => {
    // Select multiple tasks
    cy.get('[data-testid="task-checkbox"]').first().check();
    cy.get('[data-testid="task-checkbox"]').eq(1).check();

    // Test bulk actions
    cy.get('[data-testid="bulk-delete-button"]').should('be.visible');
    cy.get('[data-testid="bulk-status-change"]').should('be.visible');
  });
});