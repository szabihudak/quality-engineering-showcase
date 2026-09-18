# Engineering Decisions

## Purpose

This document explains selected engineering decisions behind the Quality Engineering framework.

The objective is not to document every implementation detail.

Instead, it focuses on decisions that materially affect:

- maintainability;
- reliability;
- reproducibility;
- execution cost;
- failure diagnosis;
- scalability;
- engineering feedback.

Each decision is presented through four questions:

```text
Context
  ↓
Decision
  ↓
Why
  ↓
Trade-off
```

The complete internal decision history remains part of the canonical framework. This document presents a curated public view of the decisions most relevant to evaluating the engineering approach.

---

## 1. Treat Test Automation as an Engineering System

### Context

Automation projects can gradually become collections of independent tests where each scenario manages its own:

- setup;
- authentication;
- data;
- selectors;
- API interaction;
- cleanup;
- diagnostics.

This may work initially but becomes increasingly difficult to maintain as coverage grows.

### Decision

Design the framework as a set of cooperating engineering capabilities:

```text
Tests
  ↓
Domain Abstractions
  ↓
Fixtures & Deterministic State
  ↓
API / Browser / Validation Capabilities
  ↓
Execution Environment
```

### Why

This creates explicit ownership boundaries.

Tests primarily describe behavior, while reusable infrastructure owns recurring technical responsibilities.

The same capability can then support multiple forms of testing without duplicating setup logic.

### Trade-off

The framework requires more architectural discipline than a flat collection of test files.

Developers need to understand where new behavior belongs before adding another abstraction.

That additional structure is intentional because the framework is designed to evolve beyond a small test suite.

---

## 2. Validate External API Responses at Runtime

### Context

TypeScript types provide compile-time safety inside the automation codebase.

They do not prove that an external API actually returned data matching those types.

A type assertion can make incorrect provider data appear valid to the compiler.

### Decision

Successful provider responses pass through runtime contract validation.

```text
HTTP Response
      ↓
Status Assertion
      ↓
Parse Payload
      ↓
TypeBox Schema
      ↓
AJV Runtime Validation
      ↓
Typed Result
```

### Why

This creates a real boundary between external data and trusted framework data.

Contract failures become explicit rather than surfacing later as misleading business-assertion failures.

### Trade-off

Schemas and runtime validation introduce additional code and maintenance.

The benefit is stronger confidence at a boundary where static typing alone cannot provide runtime guarantees.

---

## 3. Use API-Driven Setup When UI Setup Is Not the Behavior Under Test

### Context

Browser tests often need application state before the actual scenario begins.

Creating all state through UI interactions can make tests:

- slower;
- more fragile;
- harder to debug;
- dependent on unrelated UI flows.

### Decision

When an existing API capability can deterministically create the required state, use it for setup.

```text
Factory
   ↓
API Setup
   ↓
Known Application State
   ↓
UI Behavior Under Test
```

### Why

The browser scenario remains focused on the behavior it actually owns.

Setup becomes faster and more deterministic.

The same domain capabilities can also be reused by API tests, fixtures, and other quality layers.

### Trade-off

The test no longer exercises the complete user journey during setup.

That is intentional: end-to-end coverage and focused behavioral coverage are different responsibilities and should not be confused.

---

## 4. Give Accessibility Dedicated Execution Ownership

### Context

Accessibility testing is browser-based, but its purpose differs from ordinary cross-browser functional testing.

Executing identical automated accessibility analysis under every browser engine can add cost without proportionate signal.

### Decision

Accessibility has a dedicated Chromium-based execution responsibility using axe-core.

```text
Known Page State
      ↓
Accessibility Execution
      ↓
axe-core
      ↓
Policy Result
```

### Why

This makes accessibility visible as an explicit quality concern while avoiding unnecessary multiplication across the browser matrix.

### Trade-off

Automated axe analysis is not complete accessibility validation.

It is therefore treated as one repeatable quality signal and is not presented as proof of complete WCAG conformance.

---

## 5. Treat Visual Baselines as Approved Contracts

### Context

Screenshot differences can represent:

- genuine regressions;
- intentional UI changes;
- environmental rendering differences.

Automatically accepting changed screenshots would remove the value of visual regression testing.

### Decision

Approved screenshots are version-controlled visual contracts.

```text
Approved Baseline
        ↓
Comparison
        ↓
Difference?
   ├── No → Pass
   └── Yes → Review
```

CI consumes baselines but does not automatically redefine them.

Visual comparison is performed in a controlled Docker/Linux execution environment so that approved baselines and CI rendering use the same canonical boundary.

### Why

A changed visual contract should require an explicit engineering decision.

The canonical execution environment also reduces rendering differences caused by operating system, browser, font, or runtime variation.

Together, these controls make visual failures more reviewable and actionable.

### Trade-off

Intentional UI changes require baseline maintenance, and exact reproduction may require execution inside the canonical environment.

Those constraints are accepted in exchange for meaningful and reproducible visual regression coverage.

---

## 6. Separate API and Browser Performance Responsibilities

### Context

API workload testing and browser-observed performance answer different questions.

Trying to force both through the same tool would weaken one of the measurement models.

### Decision

Use:

```text
k6
→ API workload performance

Lighthouse
→ browser-observed performance
```

Performance execution is owned separately from the normal functional CI path because the current target environment is shared infrastructure rather than an isolated performance-testing environment.

### Why

Each tool owns the type of measurement it is designed to perform.

This keeps performance architecture aligned with measurement responsibility rather than tool uniformity.

Separate workflow ownership also prevents shared-environment performance variability from being treated like an ordinary deterministic pull-request gate.

### Trade-off

The framework has more than one performance tool and therefore more than one reporting model.

Performance results also require environmental context when interpreted.

That complexity is justified because the measurements represent different system behavior and different execution characteristics.

---

## 7. Reuse Functional Setup for Authenticated Performance Measurement

### Context

Authenticated browser performance requires valid business state before Lighthouse can measure the target page.

Creating a second performance-specific setup path would duplicate logic already owned by functional fixtures and API setup.

### Decision

Reuse the existing deterministic initialization.

```text
Existing Fixture / API Setup
          ↓
Authenticated State
          ↓
Known Business State
          ↓
Lighthouse Measurement
```

### Why

The functional framework already knows how to create the required state reliably.

Performance coverage should change the **measurement layer**, not duplicate the business-state initialization layer.

This follows the broader framework principle:

```text
Discover
   ↓
Reuse
   ↓
Extend
   ↓
Create
```

### Trade-off

Authenticated performance execution depends on selected functional framework capabilities.

That dependency is intentional because those capabilities are the canonical owners of deterministic state creation.

---

## 8. Use Multiple Lighthouse Measurements

### Context

Browser performance measurements contain natural run-to-run variability.

A single Lighthouse execution can overrepresent transient noise.

Independent standalone and authenticated measurement paths could also drift if they maintained separate definitions of acceptable browser performance.

### Decision

Authenticated Lighthouse performs three independent measurements and aggregates each evaluated metric using its median value.

```text
Run 1 ─┐
Run 2 ─┼─→ Median Metrics → Shared Policy
Run 3 ─┘
```

Individual run evidence is retained alongside the aggregate result.

Standalone and authenticated Lighthouse execution consume the same browser-performance policy.

### Why

Median aggregation reduces sensitivity to a single unusually fast or slow run while preserving the original measurements for diagnosis.

A shared policy also prevents separate measurement paths from silently developing contradictory performance expectations.

### Trade-off

Three measurements take longer than one.

A shared policy must also remain appropriate for all consumers; fundamentally different performance classes may require separate policies in the future.

The additional execution time and policy discipline are accepted because they produce more representative and consistent performance evidence.

---

## 9. Build the Container Once and Reuse It

### Context

Independent Docker builds in every CI job can introduce unnecessary work and reduce confidence that downstream jobs execute the exact same environment.

Transporting Docker images as generic workflow artifacts would also mix reusable execution infrastructure with execution evidence.

### Decision

Build one container image for the validated source revision and reuse it across downstream Playwright responsibilities.

```text
Source
  ↓
Quality
  ↓
Build Once
  ↓
Commit-Specific Image
  ↓
GHCR
  ↓
Multiple Execution Responsibilities
```

Container images are distributed through GHCR.

GitHub Actions artifacts remain responsible for reports and diagnostics.

### Why

This improves consistency and creates a clear relationship between:

```text
source revision
      ↕
container image
      ↕
test execution
```

It also keeps infrastructure lifecycle responsibilities explicit:

```text
GHCR
→ reusable execution environment

Actions Artifacts
→ execution evidence
```

### Trade-off

Registry usage introduces authentication, permissions, and trust-boundary considerations.

CI therefore needs to account for execution contexts where privileged registry operations are intentionally unavailable.

That complexity is preferable to rebuilding unrelated environments or treating container images as generic file artifacts.

---

## 10. Diagnose CI Failures by Root Cause, Not Job Color

### Context

A red CI job can represent many different conditions.

Examples include:

```text
Framework Regression
Product Defect
Known Product Issue
Environment Failure
External Infrastructure Failure
Platform / Storage Limitation
```

Treating all red jobs as equivalent creates misleading quality conclusions.

A failure without sufficient evidence also creates investigation work instead of useful engineering feedback.

### Decision

Interpret failures through responsibility ownership and diagnostic evidence.

Depending on the execution responsibility, evidence can include:

- HTML reports;
- traces;
- screenshots;
- retained video;
- visual comparisons;
- accessibility findings;
- performance reports;
- workflow logs.

The investigation model is:

```text
Failure
  ↓
Which responsibility failed?
  ↓
What evidence exists?
  ↓
What is the root-cause domain?
```

### Why

Quality Engineering should distinguish the source of a failure rather than optimize only for green pipelines.

A test that correctly detects a product defect is not necessarily a broken test.

Likewise, an external infrastructure or CI-platform limitation does not automatically indicate a framework regression.

Making diagnostics part of the execution model improves the quality of that classification.

### Trade-off

Root-cause interpretation requires engineering investigation rather than purely binary dashboard interpretation.

Diagnostics also consume storage and may contain sensitive execution information.

Retention and public publication therefore require deliberate lifecycle and safety controls.

---

## Decision Model

Taken together, these decisions follow a consistent pattern:

```text
Treat automation as a system
        ↓
Validate external boundaries
        ↓
Prefer deterministic initialization
        ↓
Reuse existing capabilities
        ↓
Assign explicit quality ownership
        ↓
Use the appropriate measurement layer
        ↓
Preserve reproducibility
        ↓
Produce diagnostic evidence
        ↓
Interpret results in context
```

The individual technologies are implementation choices.

The underlying goal is a Quality Engineering system that remains understandable, maintainable, reproducible, and diagnosable as its capabilities expand.

---

## Related Documentation

- [Architecture](ARCHITECTURE.md)
- [CI/CD](CI_CD.md)
- [Testing Standards](TESTING_STANDARDS.md)
- [Framework Roadmap](ROADMAP.md)

← [Back to Quality Engineering Showcase](../README.md)