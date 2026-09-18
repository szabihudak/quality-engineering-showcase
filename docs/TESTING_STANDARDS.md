# Quality Engineering Standards

## Purpose

This document describes the engineering standards used to keep the Quality Engineering framework maintainable, deterministic, and trustworthy as it evolves.

The standards define how new tests and capabilities should fit into the existing system.

They focus on:

- test responsibility;
- abstraction ownership;
- deterministic setup;
- external contract validation;
- isolation and lifecycle;
- browser execution;
- accessibility;
- visual regression;
- performance;
- diagnostics;
- public evidence.

The complete operational guidance of the canonical framework remains private. This document presents the selected standards most relevant to evaluating the engineering approach.

---

## Core Principle

Before introducing new framework infrastructure:

```text
Discover
   ↓
Reuse
   ↓
Extend
   ↓
Create
```

First determine whether the required capability already exists.

This applies to:

- fixtures;
- API clients;
- authentication;
- factories;
- Page Objects;
- Component Objects;
- validation;
- configuration;
- lifecycle handling;
- diagnostics;
- performance setup.

New abstractions should represent genuinely new responsibilities rather than alternative implementations of existing ones.

---

## 1. Test the Right Responsibility at the Right Layer

Tests should communicate the behavior or quality characteristic they own.

Choose the narrowest layer that provides the required signal:

```text
API behavior
→ API test

Provider contract
→ Runtime contract validation

Browser behavior
→ UI test

Controlled browser response behavior
→ Network-mocked UI test

Accessibility rules
→ Accessibility test

Rendering contract
→ Visual regression

API workload
→ k6

Browser performance
→ Lighthouse
```

Do not introduce browser execution when the behavior can be validated reliably at a lower layer.

Likewise, do not replace integration coverage with mocks when the provider boundary itself is the responsibility being tested.

---

## 2. Reuse Existing Capabilities Before Creating New Ones

Before adding a fixture, helper, client, factory, Page Object, Component Object, or setup path, inspect the existing framework.

Prefer:

```text
Existing Capability
      ↓
Reuse
```

then:

```text
Existing Capability
      ↓
Small Extension
```

before:

```text
New Parallel Abstraction
```

The framework should have discoverable ownership for recurring responsibilities.

Convenience alone is not sufficient justification for introducing another abstraction.

---

## 3. Keep Scenario Intent Visible

Scenario code should primarily communicate:

```text
Prepared State
      ↓
Behavior
      ↓
Expectation
```

Reusable infrastructure should own recurring technical mechanics.

Page and Component Objects should encapsulate interaction behavior, while scenario-specific business expectations should remain visible at the test level where practical.

Avoid tests dominated by:

- selectors;
- repeated request construction;
- authentication mechanics;
- manual data assembly;
- lifecycle orchestration.

The abstraction should make intent clearer, not hide what the scenario proves.

---

## 4. Validate External Boundaries at Runtime

TypeScript typing does not validate data received from an external provider.

Successful API responses should pass through runtime contract validation before being trusted by business-level test logic.

```text
HTTP Response
      ↓
Status Assertion
      ↓
Parse Payload
      ↓
TypeBox Contract
      ↓
AJV Runtime Validation
      ↓
Typed Result
```

Do not replace runtime validation with a type assertion.

Contract failures should surface at the provider boundary rather than later as misleading business failures.

---

## 5. Prefer Deterministic Setup

When a scenario requires application state, use the most deterministic existing setup capability appropriate to the responsibility.

For browser scenarios, if creating the precondition through the UI is not the behavior under test, prefer existing API-driven setup.

```text
Factory
   ↓
API / Authentication Setup
   ↓
Known Application State
   ↓
Behavior Under Test
```

Do not duplicate business-state initialization for a new testing layer when deterministic initialization already exists.

Change the consumer or measurement layer instead.

---

## 6. Keep Test Data and Lifecycle Controlled

Test data should be reproducible and lifecycle ownership should be understandable.

Prefer deterministic factories and explicit resource ownership over:

- arbitrary random values;
- shared mutable records;
- repeated hard-coded objects;
- setup dependent on previous tests.

A scenario should not require another scenario to execute first.

Conceptually:

```text
Create / Acquire
      ↓
Use
      ↓
Cleanup / Release
```

Cleanup must not silently hide the original failure.

Tests should remain suitable for isolated, targeted, and parallel execution where their responsibility permits it.

---

## 7. Keep Authentication Setup Separate from Authentication Coverage

When authentication is only a prerequisite, use the framework's programmatic authentication capability.

```text
Business Scenario
→ programmatic authentication

Authentication Scenario
→ authentication behavior under test
```

Do not repeatedly exercise the login UI as incidental setup for unrelated browser scenarios.

This keeps failures aligned with the behavior the scenario actually owns.

---

## 8. Apply Cross-Browser Execution Only to Browser Responsibility

Browser-independent tests should not inherit the browser matrix.

The execution ownership model is:

```text
API
→ once

UI
→ Chromium
→ Firefox
→ WebKit
```

Other browser-based quality responsibilities should use the execution scope appropriate to their measurement rather than automatically inheriting all three engines.

Cross-browser coverage exists to detect browser-facing differences, not to multiply every suite.

---

## 9. Treat Accessibility as an Explicit Quality Responsibility

Accessibility automation should run against deterministic application states and produce identifiable accessibility findings.

The framework uses axe-core as an automated accessibility signal.

Do not represent automated analysis as proof of complete WCAG conformance.

```text
Automated Accessibility Analysis
≠
Complete Accessibility Certification
```

Known findings should remain explicit.

Do not silently suppress a violation solely to make CI green.

If an exception is accepted, its ownership and status should remain understandable.

---

## 10. Treat Visual Baselines as Reviewed Contracts

Approved screenshots represent expected rendering behavior.

```text
Approved Baseline
        ↓
Compare
        ↓
Difference?
├── No  → Pass
└── Yes → Review
```

Ordinary CI execution must not automatically approve changed screenshots.

Baseline changes should be deliberate and reviewable.

Visual comparison should use the canonical rendering environment so that environmental variation does not become indistinguishable from product change.

---

## 11. Match Performance Tooling to the Measurement

API workload and browser-observed performance are different responsibilities.

```text
API workload
→ k6

Browser-observed performance
→ Lighthouse
```

Use existing deterministic functional setup when authenticated performance measurement requires known application state.

Do not create a second business-state initialization path solely for performance coverage.

Performance execution against shared infrastructure must also be interpreted in environmental context rather than treated as equivalent to measurement in an isolated performance environment.

---

## 12. Keep Measurement Repetition Separate from Test Retries

Repeated performance measurements and failure retries solve different problems.

Authenticated Lighthouse uses independent repeated measurements as part of its measurement design:

```text
Run 1
Run 2
Run 3
  ↓
Median per Metric
  ↓
Policy Evaluation
```

This is not equivalent to retrying a failed test.

Performance execution should not use ordinary test retries to conceal threshold failures or change the intended measurement model.

Timeouts and retries should remain responsibility-specific and intentional.

---

## 13. Keep Execution Ownership Explicit

The execution environment and the responsibility being tested are separate concepts.

```text
Docker
→ runtime environment

Playwright Project / CI Job
→ execution responsibility
```

For trusted CI execution, downstream responsibilities reuse the container image associated with the validated source revision rather than independently rebuilding equivalent environments.

Container images and execution evidence also have separate lifecycle ownership:

```text
Container Registry
→ reusable execution environment

Workflow Artifacts
→ reports and diagnostics
```

Do not add execution complexity without a responsibility that requires it.

---

## 14. Design Failures for Diagnosis

A test failure should produce enough information to support root-cause analysis.

Depending on responsibility, useful evidence may include:

- Playwright reports;
- traces;
- screenshots;
- retained video;
- visual comparison output;
- accessibility findings;
- performance metrics;
- Lighthouse reports;
- workflow logs.

A red CI result should not automatically be classified as a framework regression.

Possible failure domains include:

```text
Framework
Product
Known Product Issue
Environment
Infrastructure
External Platform
```

Use responsibility ownership and available evidence before classifying the failure.

Retries should not be used to make deterministic failures disappear.

---

## 15. Keep Public Claims and Evidence Verifiable

Portfolio publication has a stricter boundary than internal execution.

A capability may be presented as **Implemented** only when it exists in the canonical framework and has been validated.

Future work remains explicitly **Planned** until that transition occurs.

```text
Planned
   ↓
Implementation
   ↓
Validation
   ↓
Public-Safety Review
   ↓
Implemented
```

Public execution evidence must originate from real framework execution.

Do not fabricate:

- pass counts;
- performance metrics;
- accessibility results;
- visual comparisons;
- CI runs;
- screenshots implying executions that did not occur.

Before publishing real evidence, review it for:

- credentials;
- API keys;
- tokens;
- authorization headers;
- cookies;
- session identifiers;
- private URLs;
- environment-specific endpoints;
- local filesystem paths;
- personal data;
- private package or container references;
- sensitive screenshots;
- sensitive values inside traces, logs, reports, or JSON.

A real artifact is not automatically a public-safe artifact.

---

## Review Checklist

Before adding a new test or framework capability, ask:

```text
□ What behavior or quality responsibility does this test own?

□ Is this the narrowest appropriate testing layer?

□ Does an existing capability already own this responsibility?

□ Can that capability be reused or extended?

□ Is the required application state deterministic?

□ Is data and lifecycle ownership clear?

□ Are external provider boundaries validated at runtime where required?

□ Does the scenario keep its important expectations visible?

□ Does this test actually require browser execution?

□ If browser-based, does its responsibility require cross-browser execution?

□ Is mocking being used for a deliberate controlled-behavior reason?

□ Are retries and timeouts appropriate to this responsibility?

□ Will a failure produce useful diagnostic evidence?

□ Does CI execute this responsibility in the appropriate environment?

□ If this becomes portfolio material, is the claim verified and the evidence public-safe?
```

If the answers reveal duplicated ownership or unclear responsibility, resolve that architectural question before introducing another abstraction.

---

## Standard Summary

The framework standards can be summarized as:

```text
Identify the responsibility
        ↓
Choose the narrowest useful layer
        ↓
Discover existing capabilities
        ↓
Reuse before creating
        ↓
Prepare deterministic state
        ↓
Validate external boundaries
        ↓
Keep lifecycle and ownership explicit
        ↓
Execute in the appropriate environment
        ↓
Produce diagnostic evidence
        ↓
Interpret results in context
```

The objective is not maximum abstraction, maximum test count, or maximum tooling.

The objective is **maintainable, reproducible, and trustworthy Quality Engineering feedback**.

---

## Related Documentation

- [Architecture](ARCHITECTURE.md)
- [CI/CD](CI_CD.md)
- [Engineering Decisions](ENGINEERING_DECISIONS.md)
- [Framework Roadmap](ROADMAP.md)

← [Back to Quality Engineering Showcase](../README.md)