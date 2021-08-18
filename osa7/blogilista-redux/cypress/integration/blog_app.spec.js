
describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'TestiKäyttäjä',
      username: 'Testaaja',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    cy.visit('http://localhost:3000')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('input:first').type('Testaaja')
      cy.get('input:last').type('password')
      cy.get('#login-button').click()

      cy.get('.success').contains('Login successful')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('input:first').type('nosuchuser')
      cy.get('input:last').type('asdasd')
      cy.get('#login-button').click()

      cy.get('.error').contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Testaaja', password: 'password' })
    })


    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('titteli')
      cy.get('#author').type('julkaisija')
      cy.get('#url').type('urli')
      cy.get('#create-blog-button').click()

      cy.get('#blog-details')
        .should('contain', 'titteli')
        .and('contain', 'julkaisija')
    })
    describe('when blog is created', function()  {
      beforeEach(function() {
        cy.createBlog({
          title: 'titteli',
          author: 'julkaisija',
          url: 'urli'
        })
      })
      it('A blog can be liked', function() {
        cy.get('#show-button').click()
        cy.get('#like-button').click()

        cy.get('#like-amount')
          .should('contain', '1')
      })
      it('A blog can be removed by poster', function() {
        cy.get('#show-button').click()
        cy.get('#remove-button').click()
        cy.on('window:confirm', () => true)

        cy.get('#blog-details')
          .contains('contain', 'titteli').should('not.exist')
      })
    })

    describe('when several blogs are created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'alin',
          author: 'alinJulkaisija',
          url: 'urli'
        })
        cy.createBlog({
          title: 'ylin',
          author: 'ylinJulkaisija',
          url: 'urli2',
          likes: '4'
        })
        cy.createBlog({
          title: 'keski',
          author: 'keskiJulkaisija',
          url: 'urli3',
          likes: '2'
        })

      })
      it('blogs are ordered by likes', function() {
        cy.get('#single-blog')
          .first()
          .should('contain', 'ylin')
          .and('contain', 'ylinJulkaisija')
          .next()
          .should('contain', 'keski')
          .and('contain', 'keskiJulkaisija')
          .next()
          .should('contain', 'alin')
          .and('contain', 'alinJulkaisija')

      })

    })
  })
})