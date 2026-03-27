# Cypress End-to-End Tests for AXIOM UI

# 1. Install Cypress (run in frontend directory):
#    npm install --save-dev cypress

# 2. To open Cypress UI:
#    npx cypress open
#
# 3. To run all tests headlessly:
#    npx cypress run

# Example test: dashboard.spec.js

describe('AXIOM Dashboard UI', () => {
  it('should display the sidebar and dashboard greeting', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('h1').should('contain.text', 'Welcome');
  });

  it('should navigate to New Chat and Documents', () => {
    cy.visit('/dashboard');
    cy.contains('New Chat').click();
    cy.url().should('include', '/chat');
    cy.go('back');
    cy.contains('Documents').click();
    cy.url().should('include', '/documents');
  });
});
