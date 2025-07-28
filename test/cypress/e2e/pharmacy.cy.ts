// E2E tests for E-Pharmacy workflows
export {};

describe('E-Pharmacy Feature', () => {
  beforeEach(() => {
    // Setup API mocks
    cy.intercept('GET', '**/api/drugs', { fixture: 'drugs.json' }).as('getDrugs');
    cy.intercept('GET', '**/api/drugs/categories', { fixture: 'categories.json' }).as('getCategories');
    cy.intercept('GET', '**/api/drugs/search*', { fixture: 'search-results.json' }).as('searchDrugs');
    cy.intercept('POST', '**/api/orders', { fixture: 'order-response.json' }).as('placeOrder');
    cy.intercept('GET', '**/api/orders/*', { fixture: 'order-status.json' }).as('trackOrder');
    
    cy.visit('/pharmacy');
  });

  describe('Drug Browsing and Search', () => {
    it('should display drugs on pharmacy page', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').should('have.length.greaterThan', 0);
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="drug-name"]').should('be.visible');
        cy.get('[data-cy="drug-price"]').should('be.visible');
        cy.get('[data-cy="drug-stock"]').should('be.visible');
      });
    });

    it('should filter drugs by category', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="category-filter"]').select('Pain Relief');
      cy.get('[data-cy="drug-card"]').should('have.length.greaterThan', 0);
      
      // Verify all visible drugs are in Pain Relief category
      cy.get('[data-cy="drug-category"]').each(($el) => {
        cy.wrap($el).should('contain', 'Pain Relief');
      });
    });

    it('should search drugs by name', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="search-input"]').type('aspirin');
      cy.get('[data-cy="search-button"]').click();
      
      cy.wait('@searchDrugs');
      cy.get('[data-cy="drug-card"]').should('have.length.greaterThan', 0);
    });

    it('should show drug details when clicked', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="view-details-btn"]').click();
      });
      
      cy.url().should('include', '/pharmacy/drug/');
      cy.get('[data-cy="drug-details"]').should('be.visible');
      cy.get('[data-cy="drug-description"]').should('be.visible');
      cy.get('[data-cy="add-to-cart-section"]').should('be.visible');
    });
  });

  describe('Shopping Cart Functionality', () => {
    it('should add items to cart', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      
      cy.get('[data-cy="cart-drawer-trigger"]').should('contain', '1');
      cy.get('.q-notification').should('contain', 'Added to cart');
    });

    it('should open cart drawer and display items', () => {
      // Add item to cart first
      cy.wait('@getDrugs');
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      
      // Open cart drawer
      cy.get('[data-cy="cart-drawer-trigger"]').click();
      cy.get('[data-cy="cart-drawer"]').should('be.visible');
      cy.get('[data-cy="cart-item"]').should('have.length', 1);
      cy.get('[data-cy="cart-total"]').should('be.visible');
    });

    it('should update item quantities in cart', () => {
      // Add item and open cart
      cy.wait('@getDrugs');
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      cy.get('[data-cy="cart-drawer-trigger"]').click();
      
      // Increase quantity
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="increase-quantity"]').click();
        cy.get('[data-cy="item-quantity"]').should('contain', '2');
      });
      
      // Verify total updated
      cy.get('[data-cy="cart-total"]').should('not.contain', '$0.00');
    });

    it('should remove items from cart', () => {
      // Add item and open cart
      cy.wait('@getDrugs');
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      cy.get('[data-cy="cart-drawer-trigger"]').click();
      
      // Remove item
      cy.get('[data-cy="cart-item"]').first().within(() => {
        cy.get('[data-cy="remove-item"]').click();
      });
      
      // Confirm removal in dialog
      cy.get('.q-dialog').should('be.visible');
      cy.get('[data-cy="confirm-remove"]').click();
      
      cy.get('[data-cy="empty-cart"]').should('be.visible');
    });

    it('should clear entire cart', () => {
      // Add multiple items
      cy.wait('@getDrugs');
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      cy.get('[data-cy="drug-card"]').eq(1).within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
      
      cy.get('[data-cy="cart-drawer-trigger"]').click();
      cy.get('[data-cy="clear-cart-btn"]').click();
      
      // Confirm in dialog
      cy.get('.q-dialog').should('be.visible');
      cy.get('[data-cy="confirm-clear"]').click();
      
      cy.get('[data-cy="empty-cart"]').should('be.visible');
    });
  });

  describe('Checkout Process', () => {
    beforeEach(() => {
      // Add item to cart before each checkout test
      cy.wait('@getDrugs');
      cy.get('[data-cy="drug-card"]').first().within(() => {
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
    });

    it('should navigate to checkout page', () => {
      cy.get('[data-cy="cart-drawer-trigger"]').click();
      cy.get('[data-cy="checkout-btn"]').click();
      
      cy.url().should('include', '/checkout');
      cy.get('[data-cy="checkout-form"]').should('be.visible');
    });

    it('should validate required checkout fields', () => {
      cy.visit('/checkout');
      cy.get('[data-cy="place-order-btn"]').click();
      
      cy.get('[data-cy="address-error"]').should('be.visible');
      cy.get('[data-cy="payment-error"]').should('be.visible');
      cy.get('[data-cy="phone-error"]').should('be.visible');
    });

    it('should complete checkout successfully', () => {
      cy.visit('/checkout');
      
      // Fill out form
      cy.get('[data-cy="address-input"]').type('123 Main St, City, State 12345');
      cy.get('[data-cy="phone-input"]').type('+1234567890');
      cy.get('[data-cy="payment-method"]').select('credit_card');
      cy.get('[data-cy="notes-input"]').type('Leave at door');
      
      // Submit order
      cy.get('[data-cy="place-order-btn"]').click();
      
      cy.wait('@placeOrder');
      cy.url().should('include', '/order-status');
      cy.get('[data-cy="order-confirmation"]').should('be.visible');
    });
  });

  describe('Order Tracking', () => {
    it('should display order status information', () => {
      cy.visit('/order-status/ORDER123');
      cy.wait('@trackOrder');
      
      cy.get('[data-cy="order-details"]').should('be.visible');
      cy.get('[data-cy="order-id"]').should('contain', 'ORDER123');
      cy.get('[data-cy="order-status"]').should('be.visible');
      cy.get('[data-cy="tracking-number"]').should('be.visible');
    });

    it('should show order timeline', () => {
      cy.visit('/order-status/ORDER123');
      cy.wait('@trackOrder');
      
      cy.get('[data-cy="order-timeline"]').should('be.visible');
      cy.get('[data-cy="timeline-step"]').should('have.length.greaterThan', 0);
    });

    it('should handle invalid order ID', () => {
      cy.intercept('GET', '**/api/orders/INVALID', { 
        statusCode: 404, 
        body: { message: 'Order not found' }
      }).as('orderNotFound');
      
      cy.visit('/order-status/INVALID');
      cy.wait('@orderNotFound');
      
      cy.get('[data-cy="order-error"]').should('be.visible');
      cy.get('[data-cy="order-error"]').should('contain', 'Order not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '**/api/drugs', { 
        statusCode: 500, 
        body: { message: 'Server error' }
      }).as('drugsError');
      
      cy.visit('/pharmacy');
      cy.wait('@drugsError');
      
      cy.get('[data-cy="error-message"]').should('be.visible');
      cy.get('[data-cy="retry-button"]').should('be.visible');
    });

    it('should handle network errors', () => {
      cy.intercept('GET', '**/api/drugs', { forceNetworkError: true }).as('networkError');
      
      cy.visit('/pharmacy');
      cy.wait('@networkError');
      
      cy.get('[data-cy="network-error"]').should('be.visible');
    });

    it('should show loading states', () => {
      cy.intercept('GET', '**/api/drugs', { 
        delay: 2000,
        fixture: 'drugs.json' 
      }).as('slowDrugs');
      
      cy.visit('/pharmacy');
      cy.get('[data-cy="loading-spinner"]').should('be.visible');
      
      cy.wait('@slowDrugs');
      cy.get('[data-cy="loading-spinner"]').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-x');
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').should('be.visible');
      cy.get('[data-cy="mobile-menu"]').should('be.visible');
    });

    it('should work on tablet devices', () => {
      cy.viewport('ipad-2');
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').should('be.visible');
      cy.get('[data-cy="search-input"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      cy.wait('@getDrugs');
      
      cy.get('body').type('{tab}');
      cy.focused().should('have.attr', 'data-cy', 'search-input');
      
      cy.focused().type('{tab}');
      cy.focused().should('have.attr', 'data-cy', 'category-filter');
    });

    it('should have proper ARIA labels', () => {
      cy.wait('@getDrugs');
      
      cy.get('[data-cy="drug-card"]').first().should('have.attr', 'aria-label');
      cy.get('[data-cy="add-to-cart-btn"]').should('have.attr', 'aria-label');
    });
  });
});
