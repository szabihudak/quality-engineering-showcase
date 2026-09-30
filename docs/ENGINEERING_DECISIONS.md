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
API / Database / Browser / Validation Capabilities
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

## 4. Keep Database Validation Behind a Typed Persistence Boundary

### Context

Some scenarios require evidence from persisted application state rather than only from the API or browser surface.

Direct SQL scattered throughout tests would couple scenario code to persistence details and create another uncontrolled infrastructure boundary.

### Decision

Database validation is exposed through a typed PostgreSQL persistence capability.

Conceptually:

```text
Test / Fixture
      ↓
Typed Database Capability
      ↓
PostgreSQL
      ↓
Persisted State
      ↓
Scenario Assertion
```

Tests consume the persistence capability rather than owning connection and query infrastructure independently.

### Why

This keeps database responsibilities consistent with the rest of the framework.

Infrastructure owns connection and persistence concerns while tests retain ownership of scenario-specific expectations.

It also makes database validation reusable without turning individual test files into database integration layers.

### Trade-off

The framework gains an additional infrastructure boundary that requires lifecycle and environment management.

That complexity is accepted where persistence-level evidence adds value beyond API or browser assertions.

---

## 5. Give Accessibility Dedicated Execution Ownership

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

## 6. Treat Visual Baselines as Approved Contracts

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

## 7. Separate API and Browser Performance Responsibilities

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

## 8. Reuse Functional Setup for Authenticated Performance Measurement

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

## 9. Use Multiple Lighthouse Measurements

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

## 10. Build the Container Once and Reuse It

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

## 11. Use GitHub Summaries as an Evidence Layer, Not a Quality Gate

### Context

Detailed reports and execution artifacts are useful for investigation but require additional navigation and may not always be immediately available.

CI still needs a concise way to communicate the result of each quality responsibility directly from the workflow.

### Decision

Playwright, k6, and Lighthouse execution produce GitHub-native summaries in addition to their detailed evidence.

Conceptually:

```text
Execution
    ↓
Quality Result
    ↓
GitHub Summary
    +
Detailed Evidence
```

The summary presents the result.

It does not decide the result.

### Why

This keeps reporting separate from quality-gate ownership.

Engineers can see the most important execution information directly in GitHub while retaining detailed reports and diagnostics for deeper investigation.

The same presentation principle can be reused across different execution technologies without forcing them into one reporting library.

### Trade-off

Summary generation introduces another presentation layer that must remain aligned with the underlying runner output.

It is intentionally kept lightweight rather than becoming a second reporting system.

---

## 12. Diagnose CI Failures by Root Cause, Not Job Color

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

- GitHub-native execution summaries;
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

## 13. Keep AI-Assisted Engineering Inside Existing Architecture

### Context

AI tools can generate tests, implementation proposals, failure explanations, and engineering suggestions quickly.

Without repository context and validation boundaries, that speed can also create:

- duplicate abstractions;
- inconsistent patterns;
- incorrect assumptions about contracts;
- invented application behavior;
- code that appears plausible but violates framework ownership.

### Decision

AI-assisted engineering operates inside the existing repository architecture.

The validated workflow is:

```text
Repository Context + Authoritative Evidence
                    ↓
               AI Proposal
                    ↓
               Human Review
                    ↓
            Targeted Feedback
                    ↓
              Implementation
                    ↓
        Deterministic Validation
                    ↓
              Human Approval
```

Repository instructions and Golden Templates define the expected engineering patterns.

Copilot and Agent workflows use those patterns as constraints rather than creating an independent AI-specific architecture.

### Why

AI assistance is most useful when it accelerates work without weakening engineering ownership.

The framework therefore treats AI output as a proposal that must survive the same architectural and deterministic validation standards as human-authored work.

The governing principle is:

> **Architecture drives generated code, not the other way around.**

### Trade-off

Human review remains necessary.

This deliberately limits full autonomous generation, but preserves architectural consistency and makes AI-assisted changes reviewable.

---

## 14. Separate Repository Evidence from MCP-Sourced Evidence

### Context

AI-assisted engineering can require information from more than one authoritative source.

Repository context describes how the framework is designed.

External system evidence can describe what an API contract or browser surface actually exposes.

Treating those sources as interchangeable can cause incorrect assumptions.

### Decision

Keep evidence provenance explicit.

```text
Repository Evidence
        +
Authoritative External Evidence
        ↓
AI-Assisted Proposal
        ↓
Human Review
        ↓
Deterministic Validation
```

OpenAPI MCP provides contract discovery evidence.

Playwright MCP provides browser exploration evidence.

Repository context remains responsible for framework architecture and implementation conventions.

### Why

The model should not infer external contracts from repository patterns or infer repository architecture from external exploration.

Separating evidence sources makes the reasoning boundary clearer and reduces unsupported generation.

### Trade-off

The workflow requires explicit evidence gathering before some AI-assisted tasks.

That additional step is accepted because it improves traceability and reduces the risk of plausible but unsupported implementation.

---

## 15. Keep Framework-Owned AI Output Advisory

### Context

AI failure analysis and AI test scenario generation can provide useful engineering input.

Their outputs are probabilistic rather than deterministic execution evidence.

Treating generated analysis or scenarios as authoritative would give the model ownership that belongs to the engineering system and human reviewer.

### Decision

Framework-owned AI capabilities produce advisory output.

```text
Engineering Evidence
        ↓
AI Analysis / Proposal
        ↓
Human Review
        ↓
Engineering Decision
```

AI Failure Analysis supports diagnosis.

AI Test Scenario Generation supports test design.

Neither replaces deterministic execution or human approval.

### Why

This allows AI capabilities to add value without weakening the framework's evidence model.

Deterministic systems remain responsible for proving execution behavior.

AI assists interpretation and design.

### Trade-off

The workflow retains a human decision point and therefore does not optimize for full autonomy.

That is intentional.

The goal is reliable AI-assisted Quality Engineering, not autonomous ownership of quality decisions.

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
Use AI within architectural boundaries
        ↓
Require deterministic validation
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
