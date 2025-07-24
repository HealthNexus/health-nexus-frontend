# 8. Testing Strategy

## Objective
Establish unit and end-to-end tests for the e-pharmacy workflows to ensure reliability and correctness.

## Agent: GitHub Copilot

## Prerequisites
- Jest or Vue Test Utils installed
- Cypress configured for E2E and component tests

## Acceptance Criteria
- Unit tests for `pharmacyService` methods and store actions
- E2E tests covering search, add to cart, checkout, and order tracking

## Execution Steps

### 8.1 Unit Tests
1. **Service Tests**
   - Create `src/services/__tests__/pharmacyService.spec.ts`
   - Mock Axios requests and validate responses
2. **Store Tests**
   - Create `src/stores/__tests__/pharmacy.spec.ts`
   - Initialize store, call actions, and assert state changes

### 8.2 Cypress E2E Tests
1. **Search & Listing**
   - Visit `/pharmacy`
   - Type into search input and assert filtered results
2. **Add to Cart & Checkout**
   - Click Add to Cart, open `Cart.vue` modal, assert item presence
   - Complete checkout form, assert success notification and order redirect
3. **Order Tracking**
   - Visit `/orders/:id/status`, assert status display

## Next Steps
Integrate tests into CI pipeline.
