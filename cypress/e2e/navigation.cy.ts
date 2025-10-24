describe('Navigation', () => {
  beforeEach(() => {
    cy.visitPage('/');
  });

  it('should navigate between pages correctly', () => {
    // Navigate to tasks page
    cy.get('[data-testid="tasks-nav-link"]').click();
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    // Navigate back to dashboard
    cy.get('[data-testid="dashboard-nav-link"]').click();
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
  });

  it('should display active navigation state correctly', () => {
    // Dashboard should be active
    cy.get('[data-testid="dashboard-nav-link"]').should('have.attr', 'aria-current', 'page');
    cy.get('[data-testid="tasks-nav-link"]').should('not.have.attr', 'aria-current');

    // Navigate to tasks
    cy.visit('/tasks');
    cy.get('[data-testid="tasks-nav-link"]').should('have.attr', 'aria-current', 'page');
    cy.get('[data-testid="dashboard-nav-link"]').should('not.have.attr', 'aria-current');
  });

  it('should handle mobile navigation correctly', () => {
    // Test mobile view
    cy.viewport(375, 667);
    cy.testResponsive();

    // Mobile navigation should be visible
    cy.get('[data-testid="mobile-navigation"]').should('be.visible');
    cy.get('[data-testid="desktop-navigation"]').should('not.exist');

    // Test mobile navigation links
    cy.get('[data-testid="mobile-dashboard-link"]').should('be.visible');
    cy.get('[data-testid="mobile-tasks-link"]').should('be.visible');

    // Navigate via mobile navigation
    cy.get('[data-testid="mobile-tasks-link"]').click();
    cy.url().should('include', '/tasks');
  });

  it('should handle sidebar toggle on mobile', () => {
    cy.viewport(375, 667);

    // Sidebar should be closed by default on mobile
    cy.get('[data-testid="sidebar"]').should('have.class', 'translate-x-full');

    // Open sidebar
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'translate-x-0');

    // Close sidebar via backdrop
    cy.get('[data-testid="sidebar-backdrop"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'translate-x-full');

    // Close sidebar via close button
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'translate-x-0');
    cy.get('[data-testid="sidebar-close-button"]').click();
    cy.get('[data-testid="sidebar"]').should('have.class', 'translate-x-full');
  });

  it('should handle logo click navigation', () => {
    // Navigate to tasks first
    cy.visit('/tasks');
    cy.url().should('include', '/tasks');

    // Click logo to go home
    cy.get('[data-testid="logo"]').click();
    cy.url().should('not.include', '/tasks');
    cy.url().should('not.include', '/dashboard');
  });

  it('should handle browser navigation', () => {
    // Navigate to tasks
    cy.visit('/tasks');
    cy.url().should('include', '/tasks');

    // Use browser back button
    cy.go('back');
    cy.url().should('not.include', '/tasks');

    // Use browser forward button
    cy.go('forward');
    cy.url().should('include', '/tasks');
  });

  it('should handle direct URL navigation', () => {
    // Navigate directly to tasks page
    cy.visit('/tasks');
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');

    // Navigate directly to dashboard
    cy.visit('/');
    cy.url().should('not.include', '/tasks');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
  });

  it('should handle create task button from different pages', () => {
    // From dashboard
    cy.get('[data-testid="create-task-button"]').click();
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="task-modal"]').should('be.visible');

    // Close modal and navigate to tasks
    cy.get('[data-testid="cancel-task-button"]').click();
    cy.get('[data-testid="tasks-nav-link"]').click();

    // From tasks page
    cy.get('[data-testid="create-task-button"]').click();
    cy.get('[data-testid="task-modal"]').should('be.visible');
  });

  it('should handle keyboard navigation', () => {
    // Test Tab navigation
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'skip-link');

    // Test focus management in modal
    cy.get('[data-testid="create-task-button"]').click();
    cy.get('[data-testid="task-modal"]').should('be.visible');
    cy.focused().should('have.attr', 'data-testid', 'task-title-input');

    // Test Escape key closes modal
    cy.focused().type('{esc}');
    cy.get('[data-testid="task-modal"]').should('not.exist');
  });

  it('should handle page refresh correctly', () => {
    // Navigate to tasks
    cy.visit('/tasks');
    cy.url().should('include', '/tasks');

    // Refresh page
    cy.reload();
    cy.url().should('include', '/tasks');
    cy.get('[data-testid="tasks-page"]').should('be.visible');
  });

  it('should maintain scroll position on navigation', () => {
    // Go to tasks page
    cy.visit('/tasks');

    // Scroll down (if there are many tasks)
    cy.get('[data-testid="tasks-list"]').scrollTo('bottom');

    // Navigate to dashboard and back
    cy.visit('/');
    cy.visit('/tasks');

    // Should reset scroll position or maintain as designed
    cy.get('[data-testid="tasks-list"]').scrollTo('top');
  });
});