# 3. Routing Configuration

## Objective
Add routes to the Vue Router setup to navigate to the e-pharmacy pages.

## Agent: GitHub Copilot

## Prerequisites
- `src/router/index.ts` exists and uses `createRouter` from `vue-router`.
- Pages to be created: `EPharmacyPage.vue`, `ProductDetails.vue`, `CheckoutPage.vue`, `OrderStatusPage.vue`.

## Acceptance Criteria
- New route entries for `/pharmacy`, `/pharmacy/:id`, `/checkout`, `/orders/:id/status`.
- Lazy-loading of components via dynamic imports.

## Execution Steps
1. **Open router file**
   ```bash
   code src/router/index.ts
   ```
2. **Import or add routes**
   ```typescript
   const routes = [
     // ...existing routes
     {
       path: '/pharmacy',
       name: 'pharmacy',
       component: () => import('src/pages/EPharmacyPage.vue'),
     },
     {
       path: '/pharmacy/:id',
       name: 'productDetails',
       component: () => import('src/pages/ProductDetails.vue'),
     },
     {
       path: '/checkout',
       name: 'checkout',
       component: () => import('src/pages/CheckoutPage.vue'),
     },
     {
       path: '/orders/:id/status',
       name: 'orderStatus',
       component: () => import('src/pages/OrderStatusPage.vue'),
     },
   ];

   const router = createRouter({
     history: createWebHistory(),
     routes,
   });
   ```
3. **Save and test**
   - Navigate to `/pharmacy` in browser to confirm route matches and 404 if page missing.

## Next Steps
Implement UI components in `src/pages` and `src/components`.
