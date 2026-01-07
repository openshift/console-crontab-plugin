# CLAUDE.md

See [AGENTS.md](./AGENTS.md) for comprehensive project documentation including architecture, build steps, testing, and code conventions.

## Claude Code Instructions

### Project-Specific Workflows

When working on this OpenShift Console plugin:

1. **Before any code changes**: Always run `yarn check-types` to verify TypeScript compilation
2. **After modifying user-facing strings**: Run `yarn i18n` to update translation files
3. **Before committing**: Run `yarn lint` to ensure code style compliance

### Important Constraints

- **Never modify** `consolePlugin.exposedModules` in package.json without explicit user request
- **Always use** the `useCronTabTranslation()` hook for any user-facing strings - no hardcoded text
- **Always use** TypeScript path aliases (`@crontab-utils`, `@crontab-model`) instead of relative imports
- **PatternFly components**: Use current API patterns (check existing imports for examples)

### Testing Requirements

- UI changes require corresponding Cypress tests in `integration-tests/e2e/`
- Use existing page object models in `integration-tests/views/` rather than creating new ones
- Follow the test data-test-id pattern from existing components

### Development Server

When user wants to test changes:
- `yarn start` runs dev server on port 9001
- Changes require OpenShift console running (`yarn start-console` after `oc login`)
- Hot reload is enabled, but type errors may require terminal restart

### Common Issues

- If types don't match SDK: Check @openshift-console/dynamic-plugin-sdk updates
- If i18n keys missing: Run `yarn i18n` and check `locales/en/plugin__console-crontab-plugin.json`
- Build fails on Apple Silicon: Remind about `--platform=linux/amd64` for Docker builds
