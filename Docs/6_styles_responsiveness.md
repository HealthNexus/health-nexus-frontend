# 6. Styles & Responsiveness

## Objective
Ensure the e-pharmacy pages and components are visually consistent, responsive, and adhere to design guidelines.

## Agent: GitHub Copilot

## Prerequisites
- Tailwind and SCSS setup via `tailwind.config.js` and `quasar.variables.scss`

## Acceptance Criteria
- Mobile-first design with Quasar grid system
- Consistent color scheme and typography
- Reusable classes in SCSS/Tailwind

## Execution Steps
1. **Global Styles**
   ```scss
   /* In src/css/app.scss */
   @layer components {
     .rounded-card { @apply rounded-lg shadow-md; }
     .epharmacy-page { @apply p-4; }
   }
   ```
2. **Responsive Layout**
   - Use `col-12 col-sm-6 col-md-4` for cards
   - Flexbox for `Cart.vue` sidebar modal

3. **Theme Variables**
   - Update `quasar.variables.scss` for brand colors
   ```scss
   $primary: #009688;
   $secondary: #8bc34a;
   ```
4. **Component-specific Styles**
   ```vue
   <style scoped lang="scss">
   .cart-sidebar { width: 100%; @media(min-width: 600px) { width: 400px; } }
   </style>
   ```

## Next Steps
Add error handling and form validation.
