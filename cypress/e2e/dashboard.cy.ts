describe('Dashboard', () => {
  beforeEach(() => {
    cy.visitPage('/');
  });

  it('should display the dashboard page correctly', () => {
    // Check that the page title is correct
    cy.title().should('include', 'TaskMaster');

    // Check that main elements are visible
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
    cy.get('[data-testid="page-title"]').should('contain', 'Dashboard');
  });

  it('should display metric cards with correct data', () => {
    cy.checkDashboardMetrics();

    // Check specific metric values
    cy.get('[data-testid="total-tasks-card"]').within(() => {
      cy.get('[data-testid="metric-value"]').should('be.visible');
      cy.get('[data-testid="metric-label"]').should('contain', 'Total Tasks');
    });

    cy.get('[data-testid="completed-tasks-card"]').within(() => {
      cy.get('[data-testid="metric-value"]').should('be.visible');
      cy.get('[data-testid="metric-label"]').should('contain', 'Completed');
    });

    cy.get('[data-testid="pending-tasks-card"]').within(() => {
      cy.get('[data-testid="metric-value"]').should('be.visible');
      cy.get('[data-testid="metric-label"]').should('contain', 'Pending');
    });

    cy.get('[data-testid="in-progress-tasks-card"]').within(() => {
      cy.get('[data-testid="metric-value"]').should('be.visible');
      cy.get('[data-testid="metric-label"]').should('contain', 'In Progress');
    });
  });

  it('should display charts correctly', () => {
    // Check status distribution chart
    cy.get('[data-testid="status-chart"]').should('be.visible');
    cy.get('[data-testid="status-chart"]').within(() => {
      cy.get('text').should('contain', 'Task Status');
    });

    // Check priority distribution chart
    cy.get('[data-testid="priority-chart"]').should('be.visible');
    cy.get('[data-testid="priority-chart"]').within(() => {
      cy.get('text').should('contain', 'Task Priority');
    });

    // Check productivity trend chart
    cy.get('[data-testid="productivity-chart"]').should('be.visible');
    cy.get('[data-testid="productivity-chart"]').within(() => {
      cy.get('text').should('contain', 'Productivity Trend');
    });
  });

  it('should display recent activity timeline', () => {
    cy.get('[data-testid="recent-activity"]').should('be.visible');
    cy.get('[data-testid="recent-activity"]').within(() => {
      cy.get('[data-testid="activity-title"]').should('contain', 'Recent Activity');
    });

    // Check that activity items are present
    cy.get('[data-testid="activity-item"]').should('have.length.greaterThan', 0);
  });

  it('should navigate to tasks page from dashboard', () => {
    // Click on "View all tasks" button or link
    cy.get('[data-testid="view-all-tasks"]').click();
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');
  });

  it('should be responsive on different screen sizes', () => {
    // Test mobile view
    cy.viewport(375, 667);
    cy.get('[data-testid="dashboard-container"]').should('be.visible');

    // Check that metrics stack vertically on mobile
    cy.get('[data-testid="metrics-grid"]').should('be.visible');
    cy.get('[data-testid="metric-card"]').should('have.length', 4);

    // Test tablet view
    cy.viewport(768, 1024);
    cy.get('[data-testid="dashboard-container"]').should('be.visible');

    // Test desktop view
    cy.viewport(1280, 720);
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
  });

  it('should handle navigation correctly', () => {
    // Test logo click
    cy.get('[data-testid="logo"]').click();
    cy.url().should('not.include', '/dashboard');

    // Test navigation links
    cy.get('[data-testid="dashboard-nav-link"]').should('have.attr', 'aria-current', 'page');
    cy.get('[data-testid="tasks-nav-link"]').click();
    cy.url().should('include', '/tasks');
  });

  it('should load data without errors', () => {
    // Check that no error messages are visible
    cy.get('[data-testid="error-message"]').should('not.exist');

    // Check that loading states complete
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
  });

  it('should update create task button functionality', () => {
    cy.get('[data-testid="create-task-button"]').should('be.visible');
    cy.get('[data-testid="create-task-button"]').click();

    // Should navigate to tasks page and open modal
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="task-modal"]').should('be.visible');
  });
});