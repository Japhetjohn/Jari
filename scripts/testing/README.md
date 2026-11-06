# Standalone testing scripts

These scripts are kept separate from the automated local suites:

- `frontend/scripts/simulated-data.test.cjs` tests the browser-simulated frontend data layer.
- `backend/tests/` contains the FastAPI/Pytest suite.
- The JavaScript files in this folder are standalone API/workflow checks. **They currently target the production host `72.61.97.210` by default.** Some workflows can create or modify data. Review the target and side effects before use; do not run them against production casually. Prefer adding/configuring a dedicated test environment first.
- `create-https-test.js` derives `test-production-https.js` from `test-production-api.js`; it reads and writes files beside itself.
- `certificates/test-certbot-ip.sh` runs Certbot's ACME dry-run against a production IP configuration. It expects Linux, Certbot and the webroot setup, and changes permissions under `/var/www/html`.

The standalone scripts are not run by `npm run test:workflows` or `pytest`.
