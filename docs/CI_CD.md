# CI/CD & Execution Architecture

## Purpose

This document describes the public CI/CD and execution model of the Quality Engineering framework.

The pipeline is designed around a simple principle:

> **Build the execution environment once, then assign testing responsibilities explicitly.**

The objective is not to run every test in every possible environment.

Instead, CI separates:

- code-quality validation;
- container-image creation;
- API execution;
- cross-browser UI execution;
- accessibility testing;
- visual regression;
- performance testing;
- diagnostic evidence.

This keeps execution responsibilities visible while reducing unnecessary duplication.

---

## Main Pipeline

The primary Playwright CI pipeline follows this dependency model:

```text
quality
├── formatting
└── typecheck
        ↓
build-image
        ↓
publish commit-SHA image
        ↓
GHCR
        ↓
        ├── API
        ├── Accessibility
        ├── Visual Regression
        └── UI Browser Matrix
              ├── Chromium
              ├── Firefox
              └── WebKit
```

The container image represents the reusable execution environment.

Individual downstream jobs represent **quality responsibilities**.

---

## Quality Gate

Before test execution, the framework validates the codebase itself.

```text
Source
  ↓
Formatting Validation
  ↓
Type Checking
  ↓
Container Build
```

This prevents known static-quality problems from being carried unnecessarily into downstream execution.

The quality stage therefore acts as a prerequisite for building the reusable test environment.

---

## Build Once, Run Many

A central CI/CD decision is to avoid rebuilding an independent container environment for every downstream test job.

Instead:

```text
Validated Source
      ↓
Build Docker Image Once
      ↓
Tag with Commit Identity
      ↓
Publish to GHCR
      ↓
Reuse Across Test Responsibilities
```

The same trusted image can then execute:

```text
API
Accessibility
Visual Regression
Chromium UI
Firefox UI
WebKit UI
```

This creates a consistent relationship between:

```text
source revision
      ↕
container image
      ↕
test execution
```

### Why This Matters

If every downstream job independently constructs its runtime, differences can appear between executions even when they originate from the same source revision.

Reusing the same image reduces that variability.

It also separates two concerns:

```text
Docker image
→ How does the framework execute?

Playwright project / CI job
→ What responsibility executes?
```

---

## Immutable Execution Identity

The CI model associates the reusable container image with the workflow commit.

Conceptually:

```text
commit SHA
    ↓
container image
    ↓
downstream execution
```

This makes the execution environment traceable back to the source revision that produced it.

Downstream jobs consume that specific revision rather than relying on a mutable generic image identity.

---

## GHCR

GitHub Container Registry acts as the distribution mechanism for the reusable CI image.

```text
Build Job
   ↓
GHCR
   ↓
Downstream Jobs
```

This avoids treating Docker images as ordinary GitHub Actions file artifacts.

The registry owns container distribution.

GitHub Actions artifacts remain appropriate for **execution evidence**, such as reports and diagnostics.

The distinction is:

```text
Container image
→ execution environment
→ container registry

Reports / diagnostics
→ execution evidence
→ workflow artifacts
```

---

## Execution Ownership

Different quality responsibilities have different execution requirements.

The framework models those differences explicitly.

| Responsibility | Execution Model |
| --- | --- |
| API | Browser-independent execution |
| UI | Chromium, Firefox, WebKit |
| Accessibility | Dedicated browser quality execution |
| Visual Regression | Canonical rendering environment |
| API Performance | k6 |
| Browser Performance | Lighthouse + Chromium |

This avoids the common pattern of multiplying every test suite across every browser regardless of whether the browser is relevant to the behavior being tested.

---

## API Execution

API tests do not depend on browser-engine behavior.

Therefore:

```text
API
→ execute once
```

Running the same browser-independent API suite separately under Chromium, Firefox, and WebKit would increase CI cost without adding meaningful browser coverage.

Cross-browser responsibility belongs to browser-facing behavior.

---

## Cross-Browser UI Execution

UI automation owns browser compatibility.

The browser matrix covers:

```text
UI
├── Chromium
├── Firefox
└── WebKit
```

Each browser job executes against the same framework revision and reusable container environment.

This separates:

```text
shared environment
        +
browser-specific execution responsibility
```

Cross-browser failures can therefore be investigated as browser-facing behavior rather than being mixed with unrelated API execution.

---

## Accessibility Execution

Accessibility has dedicated execution ownership.

Conceptually:

```text
Deterministic Page State
        ↓
Accessibility Project
        ↓
Chromium
        ↓
axe-core Analysis
        ↓
Policy Result
        ↓
Evidence
```

Accessibility is not multiplied across the complete browser matrix simply because UI tests use multiple browsers.

The quality concern is automated accessibility analysis, not browser compatibility.

This keeps the execution model aligned with the responsibility being measured.

---

## Visual Regression Execution

Visual comparison is especially sensitive to environment differences.

Rendering can vary because of:

- operating system;
- browser build;
- fonts;
- graphics behavior;
- runtime dependencies.

The framework therefore uses a canonical Docker/Linux execution boundary for visual regression.

```text
Approved Baseline
        +
Canonical Runtime
        +
Current Rendering
        ↓
Visual Comparison
```

CI consumes approved visual baselines.

It does not automatically approve changed screenshots.

A visual difference remains a review event until the expected rendering contract is intentionally updated.

---

## Performance Workflow

Performance testing has separate workflow ownership from the main functional CI pipeline.

```text
Performance Workflow
├── API Performance
│   └── k6
│
└── Browser Performance
    ├── Standalone Lighthouse
    └── Authenticated Playwright + Lighthouse
```

This separation reflects both tooling responsibility and environmental constraints.

---

## Why Performance Is Separate

The current performance target is shared infrastructure rather than a dedicated isolated performance environment.

That distinction matters.

Performance measurements can be affected by:

- concurrent users;
- infrastructure load;
- network conditions;
- external services;
- runtime noise.

For that reason, performance execution is not treated as an ordinary deterministic pull-request gate.

The workflow still produces useful engineering signals, but those signals must be interpreted in the context of the environment in which they were collected.

---

## k6 Ownership

k6 owns API workload performance.

```text
k6
 ↓
API Workload
 ↓
Performance Metrics
 ↓
Threshold Evaluation
```

This responsibility remains separate from Playwright browser automation because browser execution is unnecessary for API workload measurement.

The framework uses the tool appropriate to the measurement target rather than forcing all testing responsibilities through one runner.

---

## Lighthouse Ownership

Lighthouse owns browser-observed performance.

Two execution paths provide different coverage:

```text
Browser Performance
├── Standalone Lighthouse
└── Authenticated Playwright + Lighthouse
```

### Standalone Lighthouse

Standalone Lighthouse is appropriate when the target page can be measured directly without requiring application-state preparation through the functional framework.

### Authenticated Lighthouse

Authenticated scenarios reuse deterministic Playwright setup when measurement requires authenticated business state.

Conceptually:

```text
Existing Deterministic Setup
          ↓
Authenticated User
          ↓
Known Application State
          ↓
Browser Ready
          ↓
Lighthouse Measurement
```

This avoids duplicating business-state initialization solely for performance testing.

---

## Repeated Browser Measurements

Browser performance measurements contain natural variability.

The authenticated Lighthouse path therefore performs multiple independent measurements rather than relying on a single run.

```text
Run 1
Run 2
Run 3
  ↓
Metric Aggregation
  ↓
Policy Evaluation
```

Representative metrics are aggregated using their median values before the shared browser-performance policy is evaluated.

This reduces sensitivity to an isolated noisy measurement.

The individual runs remain available as evidence so that aggregation does not hide the underlying measurements.

---

## Performance Policy

Standalone and authenticated Lighthouse execution share the same browser-performance policy.

This prevents separate measurement paths from silently developing different definitions of acceptable performance.

Conceptually:

```text
Standalone Lighthouse ─────┐
                           ├── Shared Performance Policy
Authenticated Lighthouse ─┘
```

A shared policy provides one interpretation layer while allowing different setup mechanisms.

---

## Diagnostics & Evidence

CI output should support investigation, not merely indicate red or green.

Depending on the execution responsibility, evidence can include:

- Playwright HTML reports;
- traces;
- screenshots;
- retained video;
- visual comparison output;
- accessibility findings;
- k6 performance output;
- Lighthouse metrics;
- Lighthouse reports;
- workflow logs.

The diagnostic objective is to help distinguish between:

```text
Product Failure
Test Failure
Environment Failure
Infrastructure Failure
Expected Known Issue
```

A failed workflow step is therefore not automatically equivalent to a framework regression.

Root-cause context matters.

---

## Artifact Responsibilities

Container distribution and execution evidence are deliberately separated.

```text
GHCR
└── reusable container image

GitHub Actions Artifacts
├── reports
├── traces
├── screenshots
├── visual evidence
└── performance evidence
```

This keeps artifacts aligned with their actual lifecycle.

A Docker image is a reusable execution environment.

A report is evidence from a particular execution.

They should not be managed as if they were the same kind of object.

---

## Pull Requests from Forks

Publishing or consuming private registry resources can require permissions that are not available to untrusted fork pull requests.

The CI architecture accounts for this trust boundary.

Conceptually:

```text
Trusted Workflow
→ registry-backed reusable image path

Untrusted / Restricted Context
→ execution path that does not require privileged registry publication
```

The important architectural principle is that CI must not require secrets or privileged write permissions in execution contexts where GitHub intentionally withholds them.

The public showcase describes this trust model without exposing private workflow configuration or credentials.

---

## Failure Interpretation

CI results are interpreted through root-cause analysis.

A useful model is:

```text
Failure
  ↓
Which responsibility failed?
  ↓
What evidence exists?
  ↓
Framework regression?
Product defect?
Known product issue?
Environment problem?
External infrastructure problem?
```

This distinction is especially important for:

- accessibility findings;
- visual changes;
- shared-environment performance testing;
- external service failures;
- CI platform or artifact-storage limitations.

The purpose of CI is to provide actionable engineering feedback, not simply to maximize the number of green jobs.

---

## Security & Publication Boundary

The complete workflow implementation is not mirrored into this public showcase.

Public CI/CD documentation focuses on:

- execution architecture;
- responsibility ownership;
- container reuse;
- trust boundaries;
- engineering reasoning.

It does not publish sensitive operational material such as:

- credentials;
- tokens;
- private environment values;
- authentication state;
- privileged workflow configuration;
- private package or infrastructure details that do not add portfolio value.

Execution artifacts are also private by default until explicitly reviewed for public safety.

---

## CI/CD Design Principles

### Build Once

Create one reusable execution environment from the validated source revision.

### Run by Responsibility

Assign API, UI, accessibility, visual, and performance execution according to the quality concern being evaluated.

### Reuse Immutable Inputs

Downstream jobs should use the execution environment associated with the same source revision.

### Separate Environment from Test Selection

Docker defines the runtime.

Playwright projects and CI jobs define what executes.

### Use the Correct Distribution Mechanism

Container images belong in a container registry.

Execution reports belong in workflow artifacts.

### Respect Trust Boundaries

Do not design CI around credentials or permissions that are unavailable in untrusted execution contexts.

### Treat Diagnostics as Part of the System

Failure evidence is an engineering capability, not an afterthought.

### Interpret Performance in Context

Shared infrastructure produces useful performance signals, but it is not equivalent to an isolated performance-testing environment.

---

## Architecture Summary

The CI/CD architecture can be reduced to three cooperating concerns:

```text
SOURCE QUALITY
      ↓
Validated revision
      ↓
EXECUTION ENVIRONMENT
      ↓
Reusable commit-specific container
      ↓
QUALITY RESPONSIBILITIES
      ↓
API / UI / Accessibility / Visual / Performance
      ↓
DIAGNOSTIC EVIDENCE
```

This structure keeps the pipeline reproducible, responsibilities explicit, and failures easier to investigate.

---

## Related Documentation

- [Architecture](ARCHITECTURE.md)
- [Engineering Decisions](ENGINEERING_DECISIONS.md)
- [Testing Standards](TESTING_STANDARDS.md)
- [Framework Roadmap](ROADMAP.md)

← [Back to Quality Engineering Showcase](../README.md)