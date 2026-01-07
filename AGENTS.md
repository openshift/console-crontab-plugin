# AGENTS.md

## Project Overview

This is the OpenShift Console CronTab Plugin, a dynamic plugin for the OpenShift web console that enables management of CronTab custom resources (CRDs). The plugin demonstrates basic CRD operations including create, read, update, and delete (CRUD) functionality, integrating seamlessly with the OpenShift console UI.

## Tech Stack

- **Language**: TypeScript
- **Framework**: React
- **UI Library**: PatternFly React components
- **Build Tool**: Webpack
- **Plugin SDK**: @openshift-console/dynamic-plugin-sdk
- **Testing**: Cypress for E2E integration tests
- **Internationalization**: react-i18next, i18next-parser
- **Styling**: Sass/SCSS with PatternFly styles
- **Linting**: ESLint with TypeScript, React, and Prettier plugins


### Key Architectural Patterns

1. **Dynamic Plugin Architecture**: Uses OpenShift Console's dynamic plugin system with exposed modules defined in `package.json` under `consolePlugin.exposedModules`

2. **TypeScript Path Aliases**:
   - `@crontab-utils` → `src/utils`
   - `@crontab-model` → `src/types`

3. **Component Structure**: Functional React components with hooks (no class components)

4. **Data Types**: CronTab CRD structure defined in `src/types/types.ts`:
   ```typescript
   type CronTabKind = K8sResourceCommon & {
     spec?: {
       cronSpec: string;    // Cron schedule format
       image: string;       // Container image
       replicas: number;    // Number of replicas
     };
   };
   ```

5. **Internationalization**: All user-facing strings must use the translation hook (`useCronTabTranslation`) from `@crontab-utils/hooks`

## Build Steps

### Development

```bash
# Install dependencies
yarn install

# Start development server (runs on port 9001)
yarn start

# In another terminal, start OpenShift console (requires oc login first)
yarn start-console
```

### Production

```bash
# Type checking
yarn check-types

# Production build
yarn build

# Build Docker image
docker build -f Dockerfile -t <registry>/console-crontab-plugin:latest .

# Push to registry
docker push <registry>/console-crontab-plugin:latest
```

**Note for Apple Silicon**: Add `--platform=linux/amd64` flag when building Docker images

### i18n Updates

```bash
# Extract and build i18n resources
yarn i18n
```

## Testing

### Cypress E2E Tests

Located in `integration-tests/` directory with the following structure:
- `e2e/` - Test specifications
- `support/` - Helper utilities and custom commands
- `views/` - Page object models
- `fixtures/` - Test data

```bash
# Interactive Cypress test runner
yarn test-cypress

# Headless test execution
yarn test-cypress-headless
```

## Code Conventions and Standards

### TypeScript Configuration

- **Target**: ES2016
- **Module**: ESNext with Node resolution
- **JSX**: React
- **Strict Options**: `noUnusedLocals: true`
- **Source Maps**: Enabled


### Code Style Guidelines

1. **Components**:
   - Use functional components with TypeScript
   - Prefer React hooks over class components
   - Props should have TypeScript interfaces/types
   - Export default for main component

2. **Imports**:
   - Use absolute imports with path aliases when possible
   - Group imports: React/external libs, SDK imports, local imports
   - Example from `CronTabList.tsx`:
     ```typescript
     import React from "react";
     import { CronTabKind } from "@crontab-model/types";
     import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";
     ```

3. **Naming Conventions**:
   - Components: PascalCase (e.g., `CronTabList`)
   - Files: Match component name (e.g., `CronTabList.tsx`)
   - Hooks: camelCase with `use` prefix (e.g., `useCronTabTranslation`)
   - Constants: UPPER_SNAKE_CASE (e.g., `CRONTAB_KIND_PLURAL`)
   - Test IDs: kebab-case with `data-test` or `data-test-id` attributes

4. **Internationalization**:
   - All user-facing strings MUST be wrapped with `t()` function
   - Use the `useCronTabTranslation` hook for translations
   - Example: `t("Create CronTab")`
   - Default namespace: `plugin__console-crontab-plugin`

5. **State Management**:
   - Use OpenShift SDK hooks like `useK8sWatchResource`, `useListPageFilter`
   - Local state with `React.useState`
   - Memoization with `React.useMemo` and `React.useCallback` when appropriate

### Testing Conventions

1. **File Naming**: `*.cy.ts` for Cypress specs
2. **Page Objects**: Use view models in `integration-tests/views/`
3. **Test Structure**: Follow arrange-act-assert pattern
4. **Selectors**: Use `cy.byTestID()` and `cy.byTestSelector()` custom commands
5. **Setup/Teardown**: Use `before`/`after` hooks for project setup

## Deployment

### Helm Chart Installation

```bash
helm upgrade -i console-crontab-plugin \
  charts/console-crontab-plugin \
  -n console-crontab-plugin-ns \
  --create-namespace \
  --set plugin.image=docker.io/<registry>/console-crontab-plugin:latest
```

### Docker Build Process

The Dockerfile uses a multi-stage build:
1. **Build stage**: Node.js on UBI9, runs `yarn install && yarn build`
2. **Runtime stage**: Nginx on UBI8, serves static files from `/dist`

## Important Notes for AI Agents

1. **Do Not Modify**:
   - `package.json` `consolePlugin` section without understanding plugin architecture
   - Webpack configuration without testing local dev server
   - i18n configuration without running `yarn i18n` afterward

2. **Before Making Changes**:
   - Run `yarn check-types` to verify TypeScript compilation
   - Run `yarn lint` to check code style
   - Consider i18n impact - new user-facing strings need translations

3. **When Adding New Features**:
   - Add TypeScript types to `src/types/`
   - Create new views in `src/views/`
   - Export components in exposed modules if needed by console
   - Add corresponding Cypress tests
   - Update i18n keys

4. **Common Gotchas**:
   - Plugin requires OpenShift console to be running for testing
   - Path aliases must match `tsconfig.json` and `webpack.config.ts`
   - Console SDK hooks require specific resource formats

