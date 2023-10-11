import { onLocationChanged } from '../../test-lib/actions';
import locationFromUrl from '../../test-lib/utils/locationFromUrl';

describe('Connected Next Router', () => {
  it('App loads', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'Home');
  });

  context('Navigation with Redux Actions', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Push route (with query) with Redux action', () => {
      cy.contains('Push /about with Redux action').click();
      cy.location('pathname').should('equal', '/about');
      cy.location('search').should('equal', '?foo=bar')
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/about?foo=bar',
            pathname: '/about',
            search: '?foo=bar',
            hash: ''
          }
        });
    });

    it('Push route (with hash) with Redux action', () => {
      cy.contains('Push /#foo with Redux action').click();
      cy.location('pathname').should('equal', '/');
      cy.location('hash').should('equal', '#foo')
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/#foo',
            pathname: '/',
            search: '',
            hash: '#foo'
          }
        });
    });

    it('Replace route with Redux action', () => {
      cy.contains('Replace /blog/2 with Redux action').click();
      cy.location('pathname').should('equal', '/blog/2');
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/blog/2',
            pathname: '/blog/2',
            search: '',
            hash: ''
          }
        });

      cy.contains('Replace / with Redux action').click();
      cy.location('pathname').should('equal', '/');
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/',
            pathname: '/',
            search: '',
            hash: ''
          }
        });
    });

    it('Go back with Redux action', () => {
      cy.contains('Push /about with Redux action').click();
      cy.location('pathname').should('equal', '/about');
      cy.location('search').should('equal', '?foo=bar')
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/about?foo=bar',
            pathname: '/about',
            search: '?foo=bar',
            hash: ''
          }
        });

      cy.contains('Go Back with Redux action').click();
      cy.location('pathname').should('equal', '/');
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/',
            pathname: '/',
            search: '',
            hash: ''
          }
        });
    });

    it('Go forward with Redux action', () => {
      cy.contains('Push /about with Redux action').click();
      cy.location('pathname').should('equal', '/about');
      cy.location('search').should('equal', '?foo=bar')
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/about?foo=bar',
            pathname: '/about',
            search: '?foo=bar',
            hash: ''
          }
        });

      cy.go('back');
      cy.location('pathname').should('equal', '/');

      cy.contains('Go Forward with Redux action').click();
      cy.location('pathname').should('equals', '/about');
      cy.location('search').should('equal', '?foo=bar')
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/about?foo=bar',
            pathname: '/about',
            search: '?foo=bar',
            hash: ''
          }
        });
    });

    it('Prefetch with Redux action', () => {
      cy.get('head link[rel=prefetch]').should('not.exist');
      cy.contains('Prefetch /hello').click();
      cy.get('head link[rel=prefetch]')
        .last()
        .should('have.attr', 'href')
        .and('match', /hello-\w+\.js$/);
    });

    it('Ignores invalid URLs passed to the action', () => {
      cy.contains('Push empty url').click();
      cy.location('pathname').should('equal', '/');
      cy.window()
        .then((window) => window.reduxStore.getState().router)
        .should('deep.equal', {
          location: {
            href: '/',
            pathname: '/',
            search: '',
            hash: ''
          }
        });
    });
  });

  context('Custom router methods', () => {
    it('Supports custom router methods', () => {
      cy.visit('/?router=custom');
      cy.contains('Push /about with Redux action').click();
      cy.location('pathname').should('include', '/about');
    });

    it('Throws error when the custom router method does not exist in development', (done) => {
      cy.on('uncaught:exception', (err) => {
        expect(err.message).to.include('action does not exist');
        // using mocha's async done callback to finish
        // this test so we prove that an uncaught exception
        // was thrown
        done();
        // return false to prevent the error from
        // failing this test
        return false;
      });

      cy.visit('/?router=custom');
      cy.window().then((window) => {
        window.NODE_ENV = 'development';
      });
      cy.contains('Replace /blog/2 with Redux action').click();
    });

    it('Ignores custom router method that does not exist in production', () => {
      cy.visit('/?router=custom');
      cy.window().then((window) => {
        window.NODE_ENV = 'production';
      });
      cy.contains('Replace /blog/2 with Redux action').click();
      // Stays in home because the replaceRouter method does not exist in the custom router
      cy.location('pathname').should('equal', '/');
    });
  });

  it('Supports navigation with Redux actions without ConnectedRouter', () => {
    cy.visit('/?router=custom');
    cy.contains('Push /hello with Redux action').click();
    cy.location('pathname').should('include', '/hello');
    cy.contains('Go Back with Redux action').click();
    cy.location('pathname').should('equal', '/');
  });

  it("Supports user's Router.beforePopState", () => {
    cy.visit('/');
    cy.contains('Push /bps').click();
    cy.location('pathname').should('include', '/bps');
    cy.contains('Go Back with Redux action').click();
    cy.location('pathname').should('equal', '/hello');
  });

  it("Next Router and Redux Router State always stay in sync ", () => {
    cy.visit('/');
    cy.contains('Push /sync').click();
    cy.location('pathname').should('include', '/sync');
    cy.get('h1').contains('Sync Status: Always Synced');
  });

  it('Supports time travelling', () => {
    cy.visit('/ssg');
    cy.contains('Push /about with Redux action').click();
    cy.location('pathname').should('include', '/about');
    cy.contains('Push /delay').click();
    cy.location('pathname').should('include', '/delay');
    cy.contains('Delay');
    cy.window().then((window) => {
      window.reduxStore.dispatch(onLocationChanged(locationFromUrl('/about')));
    });
    cy.location('pathname').should('include', '/about');
    cy.contains('About');
    cy.window().then((window) => {
      window.reduxStore.dispatch(onLocationChanged(locationFromUrl('/delay')));
      window.reduxStore.dispatch(onLocationChanged(locationFromUrl('/ssg')));
    });
    cy.location('pathname').should('equal', '/ssg');
  });
});
