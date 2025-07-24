# 9. Documentation

## Objective
Update project documentation to include e-pharmacy setup and usage instructions.

## Agent: GitHub Copilot

## Prerequisites
- README.md exists in project root

## Acceptance Criteria
- README contains a section for E-Pharmacy
- New environment variables documented if required

## Execution Steps
1. **Update README.md**
   ```markdown
   ## E-Pharmacy Setup
   1. Configure API_BASE in `.env`:
      ```env
      VITE_API_BASE=http://localhost:8000/api
      ```
   2. Ensure `src/services/pharmacyService.ts` is implemented
   3. Register routes and pages
   4. Run `quasar dev` and navigate to `/pharmacy`
   ```
   ```bash
   git add src/services/pharmacyService.ts src/stores/pharmacy.ts src/pages src/components Cart.vue src/router/index.ts
   ```
2. **Environment Variables**
   - Document `VITE_PAYMENT_API_KEY` if external payment gateway used

## Next Steps
Prepare CI pipeline enhancements.
