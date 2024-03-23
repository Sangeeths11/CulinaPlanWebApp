describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('loginSucess', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#email').clear('c');
    cy.get('#email').type('c.sangeeths@gmail.com');
    cy.get('#password').clear();
    cy.get('#password').type('Sahana15!');
    cy.get('.bg-blue-500').click();
    cy.get('.text-3xl').click();
    cy.get('.text-3xl').should('have.text', 'Rezepte Übersicht');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('loginFailed', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000/login');
    cy.get('#email').clear('as');
    cy.get('#email').type('asdasd@gmail.com');
    cy.get('#password').clear();
    cy.get('#password').type('sdasdasd');
    cy.get('.bg-blue-500').click();
    cy.get('.bg-red-100').click();
    cy.get('.bg-red-100 > .block').should('have.text', 'Invalid login credentials');
    /* ==== End Cypress Studio ==== */
  });
})