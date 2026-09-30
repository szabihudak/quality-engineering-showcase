## 13. Keep AI-Assisted Engineering Inside Existing Architecture

### Context

AI tools can generate tests, implementation proposals, failure explanations, and engineering suggestions quickly.

Without repository context and validation boundaries, that speed can also create:

- duplicate abstractions;
- inconsistent patterns;
- incorrect assumptions about contracts;
- invented application behavior;
- code that appears plausible but violates framework ownership.

AI-Assisted Engineering is distinct from framework-owned AI-Assisted QE capabilities.

Its responsibility is to assist engineering work within the existing repository architecture rather than introduce a parallel implementation model.

### Decision

AI-Assisted Engineering operates inside the existing repository architecture.

The validated workflow is:

```text
Repository Context + Authoritative Evidence
                    ↓
         AI-Assisted Engineering
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

The framework therefore treats AI-generated engineering output as a proposal that must survive the same architectural and deterministic validation standards as human-authored work.

The governing principle is:

> **Architecture drives generated code, not the other way around.**

### Trade-off

Human review remains necessary.

This deliberately limits full autonomous generation, but preserves architectural consistency and makes AI-assisted changes reviewable.

---

## 14. Separate Repository Evidence from MCP-Sourced Evidence

### Context

AI-Assisted Engineering can require information from more than one authoritative source.

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
AI-Assisted Engineering
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

## 15. Keep Framework-Owned AI-Assisted QE Output Advisory

### Context

The framework includes two direct AI-Assisted Quality Engineering capabilities:

```text
AI-Assisted QE
├── AI Failure Analysis
└── AI Test Suite Generation
```

AI Failure Analysis can provide diagnostic input from structured failure evidence.

AI Test Suite Generation can propose risk-driven test coverage from structured engineering context.

These outputs are probabilistic rather than deterministic execution evidence.

Treating generated analysis or test-suite proposals as authoritative would give the model ownership that belongs to the engineering system and human reviewer.

### Decision

Framework-owned AI-Assisted QE capabilities produce advisory output.

```text
Quality Engineering Evidence / Context
                    ↓
          Framework-Owned AI Capability
                    ↓
             Structured Output
                    ↓
            Runtime Validation
                    ↓
               Human Review
                    ↓
          Engineering Decision
```

AI Failure Analysis supports diagnosis.

AI Test Suite Generation supports test design.

Neither replaces deterministic execution, scenario assertions, or human approval.

### Why

This allows AI-Assisted QE capabilities to add value without weakening the framework's evidence model.

Deterministic systems remain responsible for proving execution behavior.

AI assists interpretation and test design.

Human engineering review remains the final decision boundary.

### Trade-off

The workflow retains a human decision point and therefore does not optimize for full autonomy.

That is intentional.

The goal is reliable AI-Assisted Quality Engineering, not autonomous ownership of quality decisions.

---
