// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands or modify existing ones here
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('username', 'password')
       */
      login(username?: string, password?: string): Chainable<Element>;

      /**
       * Custom command to create a task
       * @example cy.createTask({ title: 'Test Task', description: 'Test Description' })
       */
      createTask(taskData: Partial<Task>): Chainable<Element>;

      /**
       * Custom command to wait for API to complete
       * @example cy.waitForApi()
       */
      waitForApi(): Chainable<Element>;
    }
  }
}

// Add global beforeEach hook for setup
beforeEach(() => {
  // Clear local storage before each test
  cy.clearLocalStorage();

  // Clear cookies
  cy.clearCookies();

  // Wait for MSW to be ready
  cy.window().then((win) => {
    return new Cypress.Promise((resolve) => {
      if (win.mswWorker) {
        resolve(true);
      } else {
        // Wait a bit for MSW to initialize
        setTimeout(resolve, 1000);
      }
    });
  });
});