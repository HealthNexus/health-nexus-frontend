# 10. CI/CD & Deployment

## Objective
Ensure continuous integration and deployment pipelines include e-pharmacy functionality and smoke tests.

## Agent: GitHub Copilot

## Prerequisites
- Existing CI pipeline (GitHub Actions, GitLab CI, etc.)

## Acceptance Criteria
- Pipeline runs unit and E2E tests for e-pharmacy
- Smoke tests against `/pharmacy` endpoint

## Execution Steps
1. **Modify CI Workflow**
   ```yaml
   - name: Run Unit Tests
     run: npm run test:unit

   - name: Start Dev Server
     run: quasar dev &

   - name: Run E2E Tests
     run: npm run test:e2e
   ```
2. **Add Smoke Test**
   - Simple HTTP request to `/api/drugs` and check 200
   ```yaml
   - name: Smoke Test API
     run: |
       curl --fail http://localhost:8000/api/drugs
   ```
3. **Deployment**
   - Ensure build artifact includes new pages
   - Re-deploy web app and verify `/pharmacy`

## Next Steps
Monitor deployment logs and user feedback.
