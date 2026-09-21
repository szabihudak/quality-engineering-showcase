# API Automation Execution Evidence

This showcase demonstrates API automation, runtime contract validation, authentication, authorization, validation behavior, and deterministic test-data handling using the canonical framework implementation.

The execution was performed from the canonical Playwright container against the hosted application environment.

The public showcase contains the real execution report together with the corresponding canonical API test and framework source already published in this repository.

## Execution Summary

| Attribute | Result |
| --- | --- |
| Test layer | API automation |
| Execution | Playwright API testing |
| Environment | Hosted application |
| Runtime | Canonical Playwright Docker container |
| Project | `api` |
| Test files | 4 |
| Tests executed | 28 |
| Passed | 28 |
| Failed | 0 |
| Flaky | 0 |
| Skipped | 0 |
| Result | Passed |

The successful execution validates multiple API responsibilities rather than a single happy-path endpoint.

Coverage includes:

- user registration;
- authentication;
- authenticated current-user retrieval;
- task creation;
- request validation;
- authentication and authorization failures;
- provider-default behavior;
- runtime response-contract validation.

## Coverage Model

The API suite is organized around business capabilities rather than individual HTTP calls.

```text
API Automation
│
├── User Registration
│   ├── valid registration
│   ├── password boundary
│   ├── duplicate user
│   ├── empty fields
│   └── missing fields
│
├── Authentication
│   ├── valid login
│   ├── wrong password
│   ├── malformed credentials
│   ├── missing credentials
│   └── unknown user
│
├── Current User
│   ├── authenticated request
│   ├── missing token
│   └── invalid token
│
└── Task Creation
    ├── provider-contract validation
    ├── default description behavior
    ├── default priority behavior
    ├── default status behavior
    ├── missing authentication
    ├── invalid authentication
    └── missing required fields
```

This provides both positive-path and negative-path coverage while keeping the scenarios focused on observable API behavior.

## Runtime Contract Validation

Successful API responses are not validated only through individual field assertions.

The framework also validates response payloads against runtime schemas using TypeBox and AJV.

```text
HTTP response
      ↓
JSON parsing
      ↓
TypeBox schema
      ↓
AJV runtime validation
      ↓
Business assertions
```

The shared schema validator compiles the supplied schema and fails execution when the runtime payload does not satisfy the expected contract.

This provides an additional quality boundary between transport-level success and application-level correctness.

Examples of runtime-validated responses include:

- registration responses;
- authentication responses;
- current-user responses;
- task-creation responses.

## Authentication and Authorization

Authentication is treated as a reusable API capability rather than embedded ad-hoc into each scenario.

The API suite validates both successful authenticated behavior and rejected requests.

Representative successful flow:

```text
Valid credentials
        ↓
Authentication
        ↓
Bearer access token
        ↓
Authenticated API operation
        ↓
Expected business response
```

Representative rejected flow:

```text
Missing / invalid credentials
        ↓
Protected API operation
        ↓
Unauthorized response
        ↓
Expected error contract
```

This verifies that protected operations enforce authentication boundaries rather than validating only successful application flows.

## Deterministic Test Data

The tests use framework-managed test-data factories rather than manually maintained users or tasks.

```text
Test scenario
      ↓
Data factory
      ↓
Unique test data
      ↓
API execution
      ↓
Assertions
```

Generated data keeps executions independent from previously created application state and reduces collisions between parallel scenarios.

The execution report may contain synthetic test identifiers such as generated `@example.com` email addresses. These values are test data created specifically for automated execution and do not represent real users.

## Provider Behavior

The task-creation coverage also validates behavior owned by the API provider.

For optional request fields, the suite verifies the observed provider defaults:

```text
description omitted → null
priority omitted    → medium
status omitted      → backlog
```

These assertions document externally observable contract behavior without duplicating application implementation logic inside the test framework.

## Quality-Gate Behavior

The API project is an executable quality gate.

A successful run requires the complete selected API suite to satisfy:

```text
Request execution
      ↓
Expected HTTP status
      ↓
Runtime contract validation
      ↓
Business assertion
      ↓
PASS
```

Negative scenarios are also successful tests when the API returns the expected rejection behavior.

For example, an HTTP `401` response in an unauthorized test is not itself a test failure. The test passes when that response matches the expected security behavior and error contract.

This distinction allows the suite to validate both successful operations and controlled failure paths.

## Execution Environment

The published execution was performed from the same canonical Docker image definition used by the framework.

At a high level:

```text
Canonical source
      ↓
Docker image build
      ↓
Playwright container
      ↓
TEST_ENV=hosted
      ↓
API project
      ↓
28 API tests
      ↓
Playwright HTML report
```

The report directory was mounted from the container to the host, preserving the real Playwright output generated during execution.

This demonstrates that the API suite is not dependent on a developer-machine-only runtime.

## Execution Report

The real Playwright HTML report from the Docker-based API execution is published with this showcase:

[Open the API Playwright report](./playwright-report/index.html)

The report is retained in its standard Playwright report structure:

```text
playwright-report/
└── index.html
```

The report originates from the real canonical API execution.

No artificial test results were created for presentation.

## Canonical Source

The public repository also contains selected canonical source used by this execution.

### API Tests

- [`user-registration.spec.ts`](../../../tests/api/user-registration.spec.ts)
- [`user-authentication.spec.ts`](../../../tests/api/user-authentication.spec.ts)
- [`user-get-current-user.spec.ts`](../../../tests/api/user-get-current-user.spec.ts)
- [`create-task.spec.ts`](../../../tests/api/create-task.spec.ts)

### Runtime Contract Validation

- [`SchemaValidator.ts`](../../../src/api/utils/SchemaValidator.ts)
- [`schemas/`](../../../src/api/schemas/)

### Test Data

- [`userFactory.ts`](../../../src/data/userFactory.ts)
- [`taskFactory.ts`](../../../src/data/taskFactory.ts)

### Shared Fixtures

- [`test-fixtures.ts`](../../../src/fixtures/test-fixtures.ts)

These files are canonical-source copies rather than simplified showcase-specific implementations.

The showcase therefore allows execution evidence and implementation source to be reviewed together.

## Evidence Policy

This showcase publishes only public-safe evidence derived from real canonical execution.

It does not introduce:

- showcase-only API tests;
- reconstructed execution output;
- fake passing results;
- synthetic screenshots of test execution;
- modified API behavior for presentation.

The evidence demonstrates:

- Docker-based Playwright API execution;
- positive and negative API coverage;
- runtime TypeBox + AJV contract validation;
- reusable authenticated API behavior;
- deterministic generated test data;
- provider-default validation;
- authentication and authorization boundaries;
- real successful quality-gate execution;
- direct traceability between public evidence and canonical source.

Generated test identities contained in the execution are synthetic automation data and do not represent real users or credentials.