# UI & Cross-Browser Execution Evidence

This showcase demonstrates real browser-based UI automation executed across Chromium, Firefox, and WebKit using the canonical Playwright framework implementation.

The published report comes from a Docker-based execution against the hosted application environment.

The same UI and smoke scenarios were executed across all three configured browser engines.

## Execution Summary

| Attribute | Result |
| --- | --- |
| Test layer | UI + smoke automation |
| Execution | Playwright browser testing |
| Environment | Hosted application |
| Runtime | Canonical Playwright Docker container |
| Browser projects | Chromium · Firefox · WebKit |
| Spec files | 5 |
| Tests per browser | 6 |
| Total tests executed | 18 |
| Passed | 18 |
| Failed | 0 |
| Flaky | 0 |
| Skipped | 0 |
| Result | Passed |

Browser execution result:

```text
Chromium  → 6 / 6 passed
Firefox   → 6 / 6 passed
WebKit    → 6 / 6 passed
             ───────────
Total     → 18 / 18 passed
```

The execution validates both public and authenticated user journeys rather than a single browser smoke check.

## Coverage Model

The cross-browser suite combines public smoke coverage with authenticated UI behavior.

```text
UI & Cross-Browser Automation
│
├── Public Smoke
│   ├── home page
│   │   ├── application logo
│   │   ├── login navigation
│   │   └── registration navigation
│   │
│   └── login page
│       ├── heading
│       ├── email input
│       ├── password input
│       └── login action
│
├── Authentication
│   └── registered user logs in through the UI
│       ├── real browser form interaction
│       ├── dashboard redirect
│       └── authenticated navigation state
│
├── Authenticated User State
│   ├── account navigation
│   ├── user name
│   ├── user email
│   ├── dashboard link
│   └── unauthenticated login link hidden
│
└── Task Dashboard
    ├── created task rendered in UI
    │   ├── title
    │   ├── description
    │   └── priority
    │
    └── API failure state
        ├── mocked tasks GET failure
        └── deterministic empty-state validation
```

Each selected scenario is executed against:

```text
Chromium
Firefox
WebKit
```

This makes browser compatibility part of the executable quality boundary rather than a documentation-only capability.

## Cross-Browser Execution

The same canonical tests are selected by three Playwright projects:

```text
tests/ui/*.spec.ts
tests/smoke/*.spec.ts
        │
        ├── chromium
        ├── firefox
        └── webkit
```

The test logic is not duplicated for individual browsers.

Instead, Playwright project configuration provides browser ownership while the test scenarios remain shared.

This reduces browser-specific divergence and ensures that the same functional expectations are evaluated across all three engines.

## Public Smoke Coverage

The public smoke scenarios validate that the primary unauthenticated application entry points are available.

### Home Page

The home smoke test verifies that public navigation is visible:

```text
Home page
    ↓
Application logo
Login link
Registration link
```

### Login Page

The login smoke scenario verifies the core login surface:

```text
Login page
    ↓
Heading
Email input
Password input
Login button
```

These scenarios provide a fast browser-level signal before deeper authenticated flows are evaluated.

## UI Authentication

The canonical UI suite validates a real browser login journey for a dynamically created user.

At a high level:

```text
Create test user through API
        ↓
Open login page in browser
        ↓
Enter generated credentials
        ↓
Submit login form
        ↓
Dashboard redirect
        ↓
Authenticated navigation visible
```

The user setup is API-driven, but the login action itself is performed through the UI.

This avoids manually maintained test accounts while preserving validation of the real browser authentication flow.

## Programmatic Authentication

For authenticated scenarios that do not exist specifically to test the login form, the framework avoids repeating UI login unnecessarily.

The shared fixture performs programmatic authentication using the application's authentication endpoints.

```text
Generated test user
        ↓
API registration + authentication
        ↓
New browser context
        ↓
CSRF token request
        ↓
Credentials callback request
        ↓
Authenticated browser session
        ↓
Dashboard page
```

This provides two distinct authentication strategies:

```text
Authentication capability
│
├── UI login
│   └── used when login behavior itself is under test
│
└── Programmatic authentication
    └── used as setup for authenticated scenarios
```

This separation keeps authenticated UI tests focused on the behavior they actually own.

## Deterministic Test Data

The UI suite does not rely on permanent shared users or manually maintained tasks.

Test users and tasks are generated during execution through shared data factories and API fixtures.

```text
Test scenario
      ↓
Shared fixture
      ↓
Generated user / task
      ↓
API setup
      ↓
Browser validation
```

Examples include:

- dynamically generated user identities;
- API-based user registration;
- API-based authentication;
- API-created task data;
- browser-side validation of the created task.

Generated `@example.com` identities visible in the report are synthetic automation data and do not represent real users.

## API-Driven UI Setup

The framework deliberately uses API setup where browser interaction would add execution cost without increasing UI coverage.

For example, the task-dashboard scenario creates a task through the API before validating it through the browser.

```text
Create task through API
        ↓
Open dashboard
        ↓
Locate rendered task card
        ↓
Validate title
Validate description
Validate priority
```

This keeps setup fast while still validating the real application UI.

## Network Mocking

The task dashboard also contains a deterministic negative-path scenario.

The framework intercepts the tasks endpoint in the browser and returns a controlled server error:

```text
Browser request
      ↓
GET /api/tasks
      ↓
Playwright route interception
      ↓
HTTP 500 response
      ↓
UI error / empty-state behavior
```

Only the targeted `GET` request is mocked.

Other request methods continue normally.

This allows controlled validation of a failure state without depending on an unstable backend condition.

## Page and Component Objects

Browser interaction is separated from scenario intent through reusable page and component abstractions.

Representative structure:

```text
Test scenario
      ↓
Fixtures
      ↓
Page / component objects
      ↓
Playwright locators
      ↓
Application UI
```

Examples include:

- `LoginPage`
- `TasksDashboardPage`
- `NavigationBar`

The tests therefore remain focused on business behavior rather than duplicating locator implementation details.

## Shared Fixtures

The canonical fixture layer owns reusable test setup and application capabilities.

Representative responsibilities include:

```text
Shared Fixtures
│
├── Page Objects
│   ├── HomePage
│   ├── LoginPage
│   ├── RegisterPage
│   └── TasksDashboardPage
│
├── Component Objects
│   └── NavigationBar
│
├── API Clients
│   ├── UserApiClient
│   └── TaskApiClient
│
├── Test Data
│   ├── user factory
│   └── task factory
│
├── Programmatic Authentication
│
└── Authenticated Browser Pages
```

This keeps lifecycle and setup behavior centralized rather than repeated in individual specs.

## Execution Environment

The published execution was performed from the canonical Playwright Docker image.

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
Chromium + Firefox + WebKit
      ↓
UI + smoke suite
      ↓
18 tests
      ↓
Playwright HTML report
```

The Playwright report directory was mounted from the container to the host so the published output is the real report generated during execution.

The successful execution therefore demonstrates that the browser suite is not dependent on a developer-machine-only environment.

## Quality-Gate Behavior

Each browser project evaluates the same browser-responsible scenarios.

A successful cross-browser execution requires:

```text
Scenario
   ↓
Chromium PASS
   ↓
Firefox PASS
   ↓
WebKit PASS
   ↓
Cross-browser quality signal
```

The published execution completed with:

```text
Chromium  6 / 6
Firefox   6 / 6
WebKit    6 / 6

Total     18 / 18
```

with no failed, flaky, or skipped tests.

## Execution Report

The real Playwright HTML report from the Docker-based cross-browser execution is published with this showcase:

[Open the rendered UI cross-browser Playwright report](https://szabihudak.github.io/quality-engineering-showcase/showcases/ui/playwright-report/ui-cross-browser-execution.report.html)

The report source is retained in this repository under:

[`playwright-report/`](./playwright-report/)

Current structure:

```text
playwright-report/
└── ui-cross-browser-execution.report.html
```

The report originates from the real canonical browser execution.

No artificial test results were created for presentation.

## Canonical Source

The public repository contains the selected canonical source used by this execution.

### UI Tests

- [`authenticated-user.spec.ts`](../../../tests/ui/authenticated-user.spec.ts)
- [`login.spec.ts`](../../../tests/ui/login.spec.ts)
- [`task-dashboard.spec.ts`](../../../tests/ui/task-dashboard.spec.ts)

### Smoke Tests

- [`home.smoke.spec.ts`](../../../tests/smoke/home.smoke.spec.ts)
- [`login.smoke.spec.ts`](../../../tests/smoke/login.smoke.spec.ts)

### Shared Fixtures

- [`test-fixtures.ts`](../../../src/fixtures/test-fixtures.ts)

### Page Objects

- [`LoginPage.ts`](../../../src/pages/LoginPage.ts)
- [`TasksDashboardPage.ts`](../../../src/pages/TasksDashboardPage.ts)
- [`HomePage.ts`](../../../src/pages/HomePage.ts)
- [`RegisterPage.ts`](../../../src/pages/RegisterPage.ts)

### Component Objects

- [`NavigationBar.ts`](../../../src/components/NavigationBar.ts)

### Network Mocking

- [`taskApiMock.ts`](../../../src/mocks/taskApiMock.ts)

### Test Data

- [`userFactory.ts`](../../../src/data/userFactory.ts)
- [`taskFactory.ts`](../../../src/data/taskFactory.ts)

### API Setup

- [`UserApiClient.ts`](../../../src/api/clients/UserApiClient.ts)
- [`TaskApiClient.ts`](../../../src/api/clients/TaskApiClient.ts)

These files are canonical-source copies rather than simplified showcase-specific implementations.

The execution evidence can therefore be reviewed directly alongside the framework code that produced it.

## Evidence Policy

This showcase publishes public-safe evidence derived from real canonical execution.

It does not introduce:

- showcase-only UI tests;
- browser-specific duplicate test suites;
- reconstructed execution output;
- fake passing results;
- manually created report screenshots;
- or modified application behavior for presentation.

The evidence demonstrates:

- real browser automation;
- Chromium, Firefox, and WebKit execution;
- public smoke coverage;
- real UI login validation;
- programmatic authentication;
- API-driven deterministic setup;
- reusable fixture architecture;
- page and component objects;
- deterministic network mocking;
- authenticated UI coverage;
- cross-browser functional consistency;
- Docker-based browser execution;
- and direct traceability between public execution evidence and canonical source.

Generated test identities contained in the execution are synthetic automation data and do not represent real users or credentials.