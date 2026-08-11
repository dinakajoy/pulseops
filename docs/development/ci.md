# Continuous Integration

## Overview

PulseOps uses GitHub Actions for continuous integration.

Every pull request targeting `main` or `develop` must pass the CI pipeline before it can be merged.

The CI pipeline verifies that the application:

* Compiles successfully
* Passes TypeScript type checking
* Passes ESLint
* Follows Prettier formatting rules
* Passes automated tests
* Produces a successful production build

## CI Workflow

The CI workflow is located at:

```text
.github/workflows/ci.yml
```

The pipeline runs on:

* Pull requests targeting `main`
* Pull requests targeting `develop`
* Pushes to `main`
* Pushes to `develop`

## Pipeline

The pipeline executes the following steps:

```text
Checkout repository
        ↓
Setup Node.js
        ↓
Restore npm dependency cache
        ↓
Install dependencies
        ↓
TypeScript type checking
        ↓
ESLint
        ↓
Prettier check
        ↓
Tests
        ↓
Production build
```

## Dependency Installation

CI uses:

```bash
npm ci
```

rather than:

```bash
npm install
```

`package-lock.json` is committed to the repository and is used to ensure reproducible dependency installation.

Dependencies are cached using GitHub Actions `setup-node`.

## Quality Checks

### TypeScript

```bash
npm run type:check
```

Ensures the project contains no TypeScript type errors.

### ESLint

```bash
npm run lint
```

Checks the codebase for code-quality and potential programming errors.

### Prettier

```bash
npm run format:check
```

Ensures files conform to the project's formatting rules.

### Tests

```bash
npm test
```

Runs the automated test suite.

### Build

```bash
npm run build
```

Ensures the application can be successfully compiled for production.

## Pull Request Requirements

The `main` branch is protected.

Changes must be submitted through a pull request.

A pull request cannot be merged until:

1. Required reviews have been completed.
2. CI passes successfully.
3. Required conversations have been resolved.

Direct pushes to `main` are not part of the normal development workflow.

## Dependency Updates

Dependabot is configured in:

```text
.github/dependabot.yml
```

Dependabot checks npm dependencies and GitHub Actions dependencies weekly.

Dependency updates are submitted as pull requests and must pass CI before being merged.

## Local Validation

Before opening a pull request, developers should run:

```bash
npm run type:check
npm run lint
npm run format:check
npm test
npm run build
```

The complete local validation sequence is:

```text
npm run type:check
       ↓
npm run lint
       ↓
npm run format:check
       ↓
npm test
       ↓
npm run build
```

Developers should resolve failures locally before opening a pull request.

## CI Philosophy

CI is a safety mechanism, not a replacement for local development.

Developers should use the local development tools to catch problems early. GitHub Actions provides the final automated verification before code is merged.

The goal is to keep `main` in a buildable, tested, and deployable state.
