# Quality Engineering Standards

## Purpose

This document describes the selected engineering standards used to keep the Quality Engineering framework maintainable, deterministic, and consistent as it evolves.

These standards are not intended to prescribe one universal approach to test automation.

They describe the principles applied within this framework to decisions involving:

- test ownership;
- abstraction boundaries;
- setup and lifecycle;
- test data;
- API contracts;
- browser automation;
- accessibility;
- visual regression;
- performance;
- CI execution;
- diagnostics.

The complete operational standards of the canonical framework remain private. This document provides the public engineering view relevant to understanding the framework.

---

## Core Principle

The framework follows a simple rule when new functionality is required:

```text
Discover
   ↓
Reuse
   ↓
Extend
   ↓
Create
```

Before introducing a new abstraction, first determine whether the framework already owns that responsibility.

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

New infrastructure should solve a responsibility that is not already adequately represented.

---

## 1. Tests Own Behavior

Tests should communicate the behavior or quality characteristic being evaluated.

Infrastructure should not dominate scenario code.

Prefer:

```text
prepared capability
      ↓
business action
      ↓
observable expectation
```

over repeated low-level setup and implementation details inside each test.

A reader should be able to understand the purpose of a scenario without first reverse-engineering its infrastructure.

---

## 2. Use the Narrowest Appropriate Testing Layer

Not every behavior requires a browser.

Choose the execution layer according to the responsibility being tested.

```text
API behavior
→ API test

Runtime provider contract
→ Contract validation

Browser behavior
→ UI test

Controlled browser response behavior
→ Network-mocked UI test

Accessibility rule analysis
→ Accessibility test

Rendering contract
→ Visual regression

API workload
→ k6

Browser performance
→ Lighthouse
```

Higher-level execution should not replace a simpler layer when the simpler layer provides the required signal.

---

## 3. Keep API Tests Browser-Independent

API behavior does not inherit browser-matrix ownership simply because Playwright is used as the test runner.

```text
API
→ once

UI
→ Chromium
→ Firefox
→ WebKit
```

Do not multiply browser-independent API tests across browser engines.

Cross-browser execution exists to evaluate browser-facing behavior.

---

## 4. Validate Successful External Responses at Runtime

External API data must not become trusted solely through TypeScript typing.

The expected flow is:

```text
HTTP Response
      ↓
Status Assertion
      ↓
Parse Payload
      ↓
Runtime Schema Validation
      ↓
Typed Result
      ↓
Business Assertion
```

TypeBox defines the runtime contract and its TypeScript relationship.

AJV validates the actual provider payload.

Do not replace runtime validation with a type assertion.

---

## 5. Keep Contracts Explicit

Schemas should represent provider contracts rather than arbitrary test-specific object shapes.

When a provider response changes, the contract layer should make that change visible.

Contract validation should fail close to the external boundary instead of allowing malformed data to propagate into unrelated assertions.

---

## 6. Reuse Domain API Capabilities

Tests and fixtures should reuse existing domain clients when they need application API behavior.

Avoid duplicating low-level request construction throughout tests.

Prefer:

```text
Test / Fixture
      ↓
Domain Client
      ↓
HTTP Boundary
```

This keeps request behavior, response validation, and domain interaction reusable.

---

## 7. Prefer API-Driven Setup for Non-UI Preconditions

If a browser scenario requires application state but the creation of that state is not the behavior under test, prefer deterministic API setup where an appropriate capability already exists.

```text
Factory
   ↓
API Setup
   ↓
Known State
   ↓
UI Scenario
```

Do not force browser automation to perform setup merely to make a scenario appear more end-to-end.

The testing layer should match the responsibility being evaluated.

---

## 8. Use Page Objects for Page Behavior

Page Objects should represent meaningful behavior associated with a page or major application surface.

They should prevent tests from depending unnecessarily on low-level selectors and browser mechanics.

Prefer behavior-oriented operations over exposing raw implementation details.

The objective is:

```text
Test Intent
    ↓
Page Behavior
    ↓
Playwright Interaction
```

rather than:

```text
Test
↓
selectors
↓
selectors
↓
selectors
```

---

## 9. Use Component Objects When Responsibility Justifies Them

A Component Object is appropriate when a reusable interface element has meaningful behavior independent of the page that contains it.

Do not create Component Objects for every DOM fragment.

Introduce the abstraction when it:

- has reusable behavior;
- appears across meaningful scenarios or pages;
- reduces duplication;
- creates a clearer responsibility boundary.

Abstraction count is not a quality metric.

---

## 10. Keep Scenario Assertions Visible

Scenario-specific expectations should remain visible at the test level where practical.

Reusable objects may validate technical preconditions required to perform an operation, but they should not hide every business assertion from the scenario.

A useful boundary is:

```text
Page / Component Object
→ how to interact

Test
→ what the scenario expects
```

This keeps failures understandable in the context of the behavior being tested.

---

## 11. Use Fixtures for Composition

Fixtures compose existing capabilities into prepared scenario dependencies.

They can coordinate concerns such as:

```text
Authentication
API Access
Page Objects
Test Data
Lifecycle
```

Tests should consume prepared capabilities rather than reconstructing the same composition repeatedly.

At the same time, avoid creating a new fixture simply because a new test needs setup.

First determine whether an existing fixture or capability already owns the responsibility.

---

## 12. Make Lifecycle Ownership Explicit

Resources created for tests should have understandable ownership.

Setup and cleanup responsibilities should not be scattered unpredictably across scenario code.

Conceptually:

```text
Acquire / Create
      ↓
Use
      ↓
Release / Cleanup
```

The owner of setup should make the lifecycle easy to discover and reason about.

Cleanup should not silently hide meaningful test failures.

---

## 13. Use Deterministic Test Data

Test data should support reproducibility.

Prefer controlled factories over:

- arbitrary random values;
- repeated hard-coded objects;
- shared mutable test records;
- manually assembled data spread across scenarios.

```text
Scenario Requirements
        ↓
Factory
        ↓
Controlled Data
        ↓
Known Application State
```

Uniqueness can still be introduced when required, but the construction strategy should remain controlled and diagnosable.

---

## 14. Keep Tests Isolated

A test should not depend on another test having executed first.

Avoid:

```text
Test A creates state
        ↓
Test B assumes it exists
```

Prefer each scenario receiving the state required for its own responsibility.

This supports:

- parallel execution;
- retries where appropriate;
- targeted execution;
- reproducible debugging.

---

## 15. Separate Authentication Setup from Login Coverage

When authentication is only a prerequisite, use the framework's programmatic authentication capability.

When login behavior itself is under test, test it explicitly.

```text
Business Scenario
→ programmatic authentication

Login Scenario
→ browser authentication behavior
```

Do not repeatedly test login as accidental setup for unrelated browser scenarios.

---

## 16. Mock Only When the Scenario Requires Control

Network mocking should serve a specific testing responsibility.

Use controlled responses when deterministic provider behavior is required to exercise browser-side behavior.

Do not use mocks merely to make integration failures disappear.

```text
Real API Coverage
→ provider integration responsibility

Mocked Browser Scenario
→ controlled UI behavior responsibility
```

Both have value, but they answer different questions.

---

## 17. Cross-Browser Coverage Belongs to Browser Behavior

UI behavior is executed across:

```text
Chromium
Firefox
WebKit
```

Do not assume that every quality responsibility benefits from the same browser matrix.

Cross-browser execution should exist because browser behavior matters to the scenario.

---

## 18. Treat Accessibility as a Dedicated Quality Signal

Accessibility automation uses axe-core against deterministic page states.

Accessibility failures should be reported as accessibility findings rather than hidden inside generic UI coverage.

Automated analysis does not prove complete WCAG conformance.

Therefore:

```text
axe-core result
≠
complete accessibility certification
```

Automated accessibility testing is a repeatable engineering signal within a broader accessibility discipline.

---

## 19. Keep Accessibility Exceptions Explicit

Accessibility findings should not be silently suppressed merely to produce a green pipeline.

If a finding is accepted temporarily, its status should remain understandable as a known issue or explicitly governed exception.

The framework should preserve the distinction between:

```text
No detected violation
```

and:

```text
Known violation currently accepted
```

These are not equivalent quality states.

---

## 20. Treat Visual Baselines as Versioned Contracts

Approved screenshots represent expected rendering.

A changed screenshot requires interpretation.

```text
Actual
  ↓
Compare with Baseline
  ↓
Difference?
├── No  → Pass
└── Yes → Review
```

Do not automatically update baselines during ordinary CI execution.

A baseline change should be intentional and reviewable.

---

## 21. Generate and Compare Visuals in the Canonical Environment

Visual results depend on the rendering environment.

Approved baselines and CI comparison should therefore use the canonical Docker/Linux execution boundary.

Do not treat screenshots generated under materially different rendering environments as automatically interchangeable.

---

## 22. Separate API and Browser Performance Testing

Performance tooling follows the measurement target.

```text
API Workload
→ k6

Browser-Observed Performance
→ Lighthouse
```

Do not introduce browser automation where API workload measurement does not require it.

Do not use API load tooling as a substitute for browser-observed performance metrics.

---

## 23. Reuse Existing Deterministic Setup for Performance Coverage

When performance measurement requires business state that the framework can already initialize deterministically, reuse that initialization.

```text
Existing Setup
      ↓
Known State
      ↓
Performance Measurement
```

Do not duplicate functional setup solely because the consumer is a performance test.

Change the measurement layer, not the ownership of business-state initialization.

---

## 24. Do Not Evaluate Browser Performance from One Measurement

Browser performance contains runtime variability.

Authenticated Lighthouse coverage therefore uses multiple independent measurements.

```text
Measurement 1
Measurement 2
Measurement 3
      ↓
Median per Metric
      ↓
Policy Evaluation
```

The aggregate result should not replace the underlying evidence.

Individual measurements remain useful for diagnosis.

---

## 25. Share Policy When Responsibilities Share Expectations

Standalone and authenticated Lighthouse execution use the same browser-performance policy because they evaluate the same category of performance expectations.

Avoid duplicating policy definitions when multiple consumers should follow the same rules.

```text
Multiple Measurement Paths
          ↓
Shared Policy
```

Create separate policies only when the quality expectations themselves genuinely differ.

---

## 26. Treat Retries as a Tool, Not a Repair Mechanism

Retries can help diagnose transient browser behavior.

They should not be used to hide deterministic failures.

Performance measurements require especially careful treatment because rerunning a failed performance scenario as a normal test retry can alter the measurement model.

For deterministic performance execution in this framework:

```text
Performance project
→ no test retries
```

Repeated Lighthouse measurements are part of the measurement design, not failure retries.

These are different concepts.

---

## 27. Keep Timeouts Responsibility-Specific

Timeouts should reflect the legitimate execution characteristics of the responsibility being tested.

Do not increase global timeouts simply to hide unexpectedly slow tests.

A longer timeout is appropriate only where the scenario's valid measurement or setup process requires it.

Timeout changes should therefore be intentional and scoped.

---

## 28. Keep CI Responsibility Explicit

The execution environment and test responsibility are separate concepts.

```text
Docker
→ runtime environment

Playwright Project / CI Job
→ execution responsibility
```

Do not encode every testing concern into the container itself.

Do not rebuild separate containers merely because different Playwright projects execute different tests.

---

## 29. Build Once and Reuse the Same CI Image

For trusted CI execution:

```text
Validated Source
      ↓
One Container Build
      ↓
Commit-Specific Image
      ↓
Downstream Responsibilities
```

This reduces runtime drift between jobs.

Container images belong in a container registry.

Reports and diagnostics belong in workflow artifacts.

---

## 30. Preserve Useful Failure Evidence

Diagnostics should support root-cause analysis.

Depending on the test responsibility, useful evidence may include:

- Playwright HTML reports;
- traces;
- screenshots;
- retained video;
- visual comparison output;
- accessibility results;
- performance metrics;
- Lighthouse reports;
- workflow logs.

Do not generate artifacts only because the tooling supports them.

Evidence should help explain failures.

---

## 31. Diagnose Before Classifying a Failure

A failing CI execution is not automatically a framework regression.

Possible classifications include:

```text
Framework Regression
Product Defect
Known Product Issue
Environment Failure
Infrastructure Failure
External Platform Limitation
```

Use the available evidence to determine the failure domain.

Quality Engineering should produce trustworthy information, not simply optimize for green dashboards.

---

## 32. Keep Public Evidence Sanitized

Execution evidence is private by default until reviewed for publication.

Before public exposure, inspect evidence for:

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
- private container or package references;
- sensitive screenshots;
- hidden values inside traces, logs, reports, or JSON.

A successful test artifact is not automatically a safe portfolio artifact.

---

## 33. Do Not Fabricate Portfolio Evidence

Public results must originate from real framework execution.

Do not create:

- fictional pass counts;
- invented performance metrics;
- simulated accessibility results presented as real;
- fake visual comparisons;
- fabricated CI runs;
- screenshots designed to imply executions that did not occur.

Presentation can be curated.

Evidence cannot be invented.

---

## 34. Keep Implemented and Planned Capabilities Separate

The showcase contains both current implementation and future engineering direction.

These statuses must remain explicit.

```text
Implemented
→ exists and is validated

Planned
→ roadmap direction
```

A roadmap capability must not receive implementation claims, source evidence, or execution evidence before it actually exists.

---

## 35. Optimize for Engineering Signal, Not Test Count

The number of automated tests is not the primary measure of framework quality.

A smaller suite with:

- meaningful responsibility boundaries;
- deterministic setup;
- useful assertions;
- reliable execution;
- actionable diagnostics;

can provide more engineering value than a larger collection of fragile scenarios.

Coverage should be driven by risk and behavior, not by maximizing raw test quantity.

---

## 36. Keep the Framework Understandable to Humans and AI-Assisted Development

Architecture should be discoverable from:

- naming;
- folder responsibility;
- documentation;
- existing examples;
- reusable capabilities.

AI-assisted development follows the same architectural constraints as human development.

Generated code should not bypass existing abstractions merely because creating new code is easier.

The same governing principle applies:

```text
Discover
   ↓
Reuse
   ↓
Extend
   ↓
Create
```

AI assistance changes implementation workflow.

It does not remove engineering ownership.

---

## Review Checklist

Before adding a new test or framework capability, ask:

```text
□ What behavior or quality responsibility does this test own?

□ Is this the narrowest appropriate testing layer?

□ Does an existing fixture, client, factory, object, or utility already own this capability?

□ Can existing infrastructure be reused or extended?

□ Is the required state deterministic?

□ Is lifecycle ownership clear?

□ Are external data boundaries validated at runtime where necessary?

□ Are assertions located at an understandable responsibility boundary?

□ Does this test need browser execution?

□ If browser-based, does it actually require cross-browser execution?

□ Is mocking being used for a specific controlled-behavior reason?

□ Will a failure produce useful diagnostic evidence?

□ Are retries and timeouts appropriate to this responsibility?

□ Does CI execute this capability in the correct environment?

□ If this becomes public portfolio material, has it passed publication review?
```

If the answers expose duplicated ownership or unclear responsibility, the architecture should be resolved before adding another abstraction.

---

## Standard Summary

The framework standards can be summarized as:

```text
Test the right responsibility
        ↓
Use the narrowest useful layer
        ↓
Discover existing capabilities
        ↓
Reuse before creating
        ↓
Prepare deterministic state
        ↓
Validate external boundaries
        ↓
Keep ownership explicit
        ↓
Execute in the appropriate environment
        ↓
Produce useful evidence
        ↓
Diagnose results in context
```

The objective is not maximum abstraction or maximum automation.

The objective is **maintainable, reproducible, trustworthy Quality Engineering feedback**.

---

## Related Documentation

- [Architecture](ARCHITECTURE.md)
- [CI/CD](CI_CD.md)
- [Engineering Decisions](ENGINEERING_DECISIONS.md)
- [Framework Roadmap](ROADMAP.md)

← [Back to Quality Engineering Showcase](../README.md)