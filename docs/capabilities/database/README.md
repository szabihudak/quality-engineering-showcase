# Database Validation Evidence

This document summarizes the implemented database validation capability in the canonical Quality Engineering framework.

The capability validates persistence across application and database boundaries without moving application setup or business behavior into the database layer.

## Validation Model

```text
API / Fixture Setup
        ↓
Application Behavior
        ↓
Domain Database Client
        ↓
Persisted PostgreSQL State
        ↓
Spec Assertions
```

The database layer verifies persistence. It does not replace API or UI behavior testing.

## Architecture

```text
Spec
  ↓
Fixture
  ↓
Domain Database Client
  ↓
DatabaseClient
  ↓
PostgreSQL
```

Responsibilities are intentionally separated:

- `DatabaseClient` owns PostgreSQL transport and connection lifecycle.
- Domain database clients own domain-specific queries and persisted-record mapping.
- Test specifications own assertions.
- Existing API clients, fixtures and factories establish application state.

This keeps raw SQL and connection mechanics out of test specifications.

## Execution Boundary

Database scenarios execute through a dedicated browser-independent Playwright project.

```text
tests/database/**
        ↓
--project=database
        ↓
Persistence Validation
```

The database project executes once rather than being multiplied across browser projects.

Retries are disabled for database validation so that persistent state from the original failure remains clear and duplicate retry-created data is avoided.

## Test Data Lifecycle

Normal database test execution uses unique test data and intentionally preserves resulting state.

```text
Normal Execution
        ↓
Create Unique Application State
        ↓
Validate Persistence
        ↓
Preserve State for Diagnosis
```

Automatic per-test deletion is not used as the default lifecycle because failed state should remain available for investigation.

## Guarded Reset

A destructive reset exists as a separate explicit operation.

The reset is guarded by environment and confirmation checks and fails closed when required safety conditions are not satisfied.

Conceptually:

```text
Reset Request
        ↓
Validate Test Environment
        ↓
Validate Database Configuration
        ↓
Require Explicit Confirmation
        ↓
Restore Application Schema
        ↓
Restore Baseline Seed Data
        ↓
Verify Baseline
```

The application remains the source of truth for schema creation and baseline seed data.

## Evidence Boundary

The public portfolio currently documents the implemented database architecture and validated lifecycle.

Dedicated sanitized public database execution artifacts are not currently published.

Therefore the public claim is:

```text
Database Validation
→ IMPLEMENTED
→ ARCHITECTURE AND LIFECYCLE VALIDATED
→ DEDICATED PUBLIC EXECUTION ARTIFACTS DEFERRED
```

This distinction is intentional and prevents architecture evidence from being presented as execution evidence.
