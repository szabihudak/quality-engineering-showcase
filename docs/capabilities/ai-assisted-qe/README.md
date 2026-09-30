# AI-Assisted Quality Engineering Evidence

This showcase documents the validated framework-owned AI capabilities implemented in the canonical Quality Engineering framework.

The current AI-assisted Quality Engineering layer contains two distinct capabilities:

```text
AI Failure Analysis
+
AI Test Suite Generation
```

Both capabilities use the OpenAI Responses API directly through framework-owned tooling.

They are designed as advisory engineering capabilities.

They do not replace:

- deterministic test execution;
- framework architecture;
- runtime validation;
- human engineering review;
- evidence-based Quality Engineering decisions.

The canonical private framework remains the source of truth.

This public showcase presents only curated architecture and reviewed validation evidence permitted by the portfolio publication policy.

---

## Capability Summary

| Capability | Status | Validation |
| --- | --- | --- |
| AI Failure Analysis | Implemented | Local end-to-end live validation completed |
| AI Test Suite Generation | Implemented | Local live OpenAI validation completed |
| Structured AI input validation | Implemented | Runtime schema validation |
| Structured AI output validation | Implemented | Runtime schema validation |
| Failure evidence sanitization | Implemented | Automated validation |
| Human review boundary | Implemented | Required by workflow |
| GitHub Actions AI failure-analysis integration | Implemented | Complete artifact-download-to-analysis path not yet validated end to end |

The final item is intentionally documented as an evidence gap rather than represented as completed end-to-end CI validation.

---

# AI Failure Analysis

## Purpose

AI Failure Analysis assists engineers in interpreting deterministic Playwright failure evidence.

The workflow converts test failure information into a structured machine-readable context, sanitizes that context, sends it to the OpenAI API, validates the returned structured analysis, and presents the result for human review.

The capability does not autonomously decide or apply engineering changes.

The validated flow is:

```text
Playwright Failure
        ↓
Deterministic Evidence Collection
        ↓
Structured Failure Evidence
        ↓
Evidence Sanitization
        ↓
OpenAI Responses API
        ↓
Structured Failure Analysis
        ↓
Runtime Output Validation
        ↓
Human Review
        ↓
Engineering Decision
```

---

## Failure Evidence Model

The analyzer does not receive unrestricted repository or runtime state.

It receives a deliberately bounded failure-evidence structure.

Representative evidence categories include:

```text
Test Context
├── test title
├── full title path
├── test file
└── Playwright project

Execution Context
├── execution environment
└── retry number

Failure
├── failure message
└── stack when available

Artifacts
├── screenshot
├── trace
└── video when available
```

This evidence model keeps AI analysis focused on the failure being investigated.

---

## Evidence Sanitization

Failure evidence is sanitized before it is sent to the model.

The canonical sanitizer handles public-safety and credential-related information including:

- repository-external filesystem paths;
- Bearer authorization values;
- Basic authorization values;
- Cookie headers;
- Set-Cookie headers;
- token-like session values;
- database connection strings;
- email addresses;
- terminal ANSI control sequences.

Conceptually:

```text
Raw Failure Evidence
        ↓
Path Normalization
        ↓
Credential Redaction
        ↓
Sensitive Value Redaction
        ↓
Sanitized Failure Evidence
        ↓
AI Analysis
```

Sanitization is treated as a framework responsibility rather than relying on prompt instructions alone.

---

## Structured Failure Analysis

The AI response must satisfy a framework-owned structured contract.

The analysis contains:

```text
FailureAnalysis
├── classification
├── confidence
├── summary
├── evidence[]
├── hypotheses[]
└── recommendedNextSteps[]
```

Supported classifications include:

```text
product
test
contract
environment
infrastructure
unknown
```

Supported confidence levels are:

```text
low
medium
high
```

The OpenAI request uses strict structured output.

The returned payload is then validated again by the framework before it is accepted.

```text
OpenAI Response
        ↓
JSON Output
        ↓
FailureAnalysis Schema
        ↓
Runtime Validation
        ↓
Human Review
```

Invalid, incomplete, refused, or structurally incorrect responses are treated as errors rather than trusted diagnostic output.

---

## Uncertainty Guardrail

A core design requirement is that the model must not invent root cause when the supplied evidence is insufficient.

During live validation, this became an explicit engineering guardrail.

The intended behavior is:

```text
Insufficient Evidence
        ↓
Do Not Force Classification
        ↓
classification = unknown
        +
confidence = low
```

This is important because structured output guarantees response shape, not semantic correctness.

Human review therefore remains mandatory.

---

## Validated Failure-Analysis Workflow

The AI Failure Analysis capability has been validated locally end to end using:

```text
Controlled Real Playwright Failure
        ↓
Failure Evidence Reporter
        ↓
Structured Failure Evidence
        ↓
Input Validation
        ↓
Defense-in-Depth Sanitization
        ↓
Live OpenAI API Request
        ↓
Structured Failure Analysis
        ↓
Output Schema Validation
        ↓
Human Review
```

The validation confirmed:

- real Playwright failure evidence can be captured;
- evidence files remain unique across Playwright retries;
- full test identity can be preserved through the test title path;
- screenshot artifact references can be captured;
- trace artifact references can be captured;
- failure evidence is sanitized before model use;
- the OpenAI API can return schema-constrained structured analysis;
- the returned analysis can be runtime-validated;
- insufficient evidence can result in conservative `unknown` / `low` classification.

Therefore:

```text
AI Failure Analysis
→ IMPLEMENTED
→ LOCAL END-TO-END VALIDATED
```

---

## Failure-Analysis Boundary

The AI analyzer is advisory and read-only.

It does not automatically:

- modify test files;
- modify framework implementation;
- change assertions;
- remove failures;
- suppress accessibility findings;
- update visual baselines;
- change performance thresholds;
- modify CI configuration;
- rerun arbitrary tests;
- approve its own diagnosis.

The engineering boundary remains:

```text
Deterministic Evidence
        ↓
AI Assistance
        ↓
Human Engineering Review
        ↓
Engineering Action
```

---

## Remaining Failure-Analysis Evidence Gaps

The capability is implemented and locally validated, but not every integration path has completed the same level of validation.

Current documented limitations include:

- the complete GitHub Actions artifact-download-to-AI-analysis path has not yet been validated end to end;
- video artifact mapping has not yet been confirmed through runtime evidence;
- only the first Playwright error is currently selected when multiple errors are available;
- additional provenance hardening could be introduced if the workflow is expanded beyond the current trusted execution model;
- GitHub Actions summary rendering may require additional hardening for less-trusted content.

These limitations are intentionally retained in the public representation.

They do not invalidate the locally validated capability, but they must not be presented as completed validation.

---

# AI Test Suite Generation

## Purpose

The AI Test Suite Generation capability converts requirement context into structured test-design input for human review.

The capability is deliberately separated from test-code generation.

It answers:

```text
What should be tested?
Why should it be tested?
Which layer may own it?
What risks exist?
What information is missing?
```

It does not directly answer:

```text
What Playwright code should be written?
```

The canonical flow is:

```text
Requirement / User Story
        +
Optional Acceptance Criteria
        +
Optional Framework Context
        ↓
Input Schema Validation
        ↓
OpenAI Responses API
        ↓
Structured Test Design
        ↓
Output Schema Validation
        ↓
Human Review
        ↓
Approved Coverage Model
```

Implementation takes place later through the separate AI-assisted engineering workflow.

---

## Test Design Input

The generator accepts structured input containing:

```text
requirement
optional acceptanceCriteria[]
optional frameworkContext[]
```

The input is runtime-validated before being passed to the generator.

This creates an explicit boundary between uncontrolled source material and the framework-owned AI workflow.

---

## Generated Test Suite Structure

The generated output is a structured `TestDesign`.

Conceptually:

```text
TestDesign
├── summary
├── risks[]
├── scenarios[]
│   ├── title
│   ├── type
│   ├── recommendedLayer
│   ├── reason
│   ├── preconditions[]
│   └── expectedOutcome
└── missingContext[]
```

Scenario types include:

```text
positive
negative
boundary
```

Recommended testing layers include:

```text
api
ui
database
contract
unknown
```

This means the output can represent a multi-layer test suite rather than a single generated test case.

---

## Missing Context as a First-Class Result

`missingContext` is an explicit anti-hallucination mechanism.

If required product or provider information is unavailable, the generator is expected to report the gap rather than invent the missing behavior.

Similarly:

```text
recommendedLayer = unknown
```

is considered a valid result when the available evidence does not safely support a layer recommendation.

The intended behavior is:

```text
Insufficient Context
        ↓
Do Not Invent Behavior
        ↓
Record Missing Context
        ↓
Human Clarification
```

---

## Provider-Behavior Guardrail

The generator must not invent provider-specific contract behavior.

For example, when a requirement indicates that task creation should fail without a title, but no exact response contract is supplied, the generated design may state:

```text
Task creation does not succeed because the required title is absent.
```

It should not invent:

```text
HTTP 400
specific error field
specific error code
specific provider message
```

unless that information was included in the available evidence.

The rule is:

```text
Known Behavioral Requirement
        +
Unknown Provider Contract
        ↓
Behavioral Expected Outcome
        +
missingContext
```

This prevents model-generated assumptions from becoming false test contracts.

---

## Validated Test-Suite Generation Workflow

The test-design capability has been validated through a live OpenAI API execution.

The validated flow was:

```text
Requirement Input
        ↓
Input Schema Validation
        ↓
Prompt Construction
        ↓
Live OpenAI Responses API
        ↓
Structured TestDesign
        ↓
Output Schema Validation
        ↓
Human Review
```

The live validation confirmed that the generator can:

- produce a structured test-design summary;
- identify engineering risks;
- generate multiple structured test scenarios;
- classify scenarios as positive, negative, or boundary;
- recommend API, UI, database, contract, or unknown ownership;
- describe test reasoning and preconditions;
- preserve missing information through `missingContext`;
- avoid inventing unsupported status codes;
- avoid inventing unsupported error fields;
- avoid inventing unsupported error messages;
- avoid inventing unspecified validation semantics.

Therefore:

```text
AI Test Suite Generation
→ IMPLEMENTED
→ LOCAL LIVE VALIDATION COMPLETE
```

---

## Test Suite Generation Is Not Test-Code Generation

The capability intentionally stops before repository implementation.

It does not currently:

- create Playwright spec files;
- modify repository files;
- generate Page Objects;
- generate selectors;
- execute tests;
- explore browser behavior;
- query OpenAPI through MCP;
- autonomously implement generated scenarios.

The boundary is:

```text
AI Test Suite Generation
        ↓
Human Review
        ↓
Approved Scenario
        ↓
AI-Assisted Engineering
        ↓
Repository-Aware Implementation
        ↓
Deterministic Validation
```

This separation prevents test-design reasoning from being conflated with implementation correctness.

---

# Runtime Validation

Both framework-owned AI capabilities use deterministic runtime validation around probabilistic model output.

The model is therefore not treated as a trusted typed provider.

The architecture follows the same underlying principle already used for external API contracts:

```text
External Provider Output
        ↓
Runtime Contract
        ↓
Validated Data
```

For AI:

```text
OpenAI Output
        ↓
Framework-Owned Schema
        ↓
Runtime Validation
        ↓
Human Review
```

Examples of rejected output conditions include:

- missing output;
- malformed JSON;
- schema-invalid values;
- unsupported classification values;
- unsupported confidence values;
- unsupported recommended test layers;
- incomplete OpenAI responses;
- model refusal.

This does not prove semantic correctness.

It ensures that probabilistic output cannot silently bypass the expected data contract.

---

# Human Review Boundary

Both AI capabilities are designed around human engineering ownership.

AI may:

- analyze;
- classify;
- propose;
- identify risks;
- suggest hypotheses;
- recommend next steps;
- generate structured scenarios;
- identify missing information.

The human engineer remains responsible for:

- semantic correctness;
- test intent;
- architectural decisions;
- interpretation of provider behavior;
- evidence sufficiency;
- acceptable risk;
- final test-suite approval;
- final failure classification;
- implementation decisions.

The governing model is:

```text
AI Proposal
        ↓
Human Review
        ↓
Engineering Decision
```

not:

```text
AI Output
        ↓
Automatic Truth
```

---

# Relationship to AI-Assisted Engineering

Framework-owned AI capabilities and AI-assisted implementation are intentionally separate.

```text
Framework-Owned AI
│
├── Failure Analysis
└── Test Suite Generation

AI-Assisted Engineering
│
├── Repository Context
├── Golden Templates
├── GitHub Copilot
├── Copilot Agent
├── OpenAPI MCP
└── Playwright MCP
```

The connection between them is a human review boundary.

For test design:

```text
Requirement
        ↓
AI Test Suite Generation
        ↓
Human Review
        ↓
Approved Scenario
        ↓
AI-Assisted Engineering
        ↓
Human Code Review
        ↓
Deterministic Validation
```

For failure analysis:

```text
Test Failure
        ↓
AI Failure Analysis
        ↓
Human Review
        ↓
Optional Engineering Change
        ↓
Deterministic Validation
```

This keeps AI-assisted Quality Engineering and AI-assisted code generation from becoming one uncontrolled automation path.

---

# Evidence Classification

The public showcase distinguishes several types of evidence.

## Implementation Evidence

The canonical framework contains dedicated AI architecture for:

```text
Failure analysis
Test-design generation
Prompt construction
Structured schemas
Failure evidence reporting
Evidence sanitization
CLI execution
Automated AI component tests
```

The complete private implementation is not published as part of this showcase.

---

## Automated Validation Evidence

The canonical framework includes automated validation around:

- valid structured failure analysis;
- invalid failure-analysis output;
- missing OpenAI output;
- malformed JSON;
- incomplete OpenAI responses;
- OpenAI refusal;
- valid structured test design;
- invalid test-design output;
- unsupported recommended layers;
- failure-evidence sanitization.

These tests validate framework behavior around the AI boundary.

They do not prove that every model-generated engineering conclusion is semantically correct.

---

## Live Validation Evidence

Real live OpenAI execution has been completed for:

```text
AI Failure Analysis
AI Test Suite Generation
```

The failure-analysis validation used controlled real Playwright failure evidence.

The test-suite-generation validation used structured requirement input and reviewed the resulting structured test design.

This supports the current capability status:

```text
Framework-Owned AI Capabilities
→ IMPLEMENTED
→ LIVE LOCALLY VALIDATED
```

---

## Public Execution Evidence

No artificial execution artifact is published solely to make the portfolio appear more complete.

Raw AI requests, responses, logs, traces and failure artifacts are private by default.

Any future public AI evidence must first be:

```text
Real Execution
        ↓
Evidence Review
        ↓
Sensitive Data Removal
        ↓
Public-Safety Review
        ↓
Sanitized Representative Evidence
```

Until such an artifact is intentionally selected and reviewed, the showcase documents the validated architecture and validation boundary without fabricating evidence.

---

# Known Limitations

The current capability intentionally retains several documented limitations.

## AI Failure Analysis

```text
CI artifact-download-to-analysis E2E
→ NOT YET VALIDATED

Video artifact runtime mapping
→ NOT YET CONFIRMED

Multiple Playwright errors
→ FIRST ERROR ONLY

AI semantic correctness
→ REQUIRES HUMAN REVIEW
```

## AI Test Suite Generation

```text
Automatic repository implementation
→ OUT OF SCOPE

Automatic execution
→ OUT OF SCOPE

Automatic approval
→ OUT OF SCOPE

Provider-contract invention
→ PROHIBITED

Semantic correctness
→ REQUIRES HUMAN REVIEW
```

These are engineering boundaries, not hidden capability claims.

---

# Engineering Outcome

The framework demonstrates a Quality Engineering model where AI is integrated into explicit engineering boundaries rather than treated as an autonomous source of truth.

The resulting model is:

```text
Deterministic Quality Engineering
                +
Framework-Owned AI Assistance
                +
Runtime Validation
                +
Human Engineering Review
```

AI Failure Analysis accelerates diagnosis.

AI Test Suite Generation accelerates structured coverage design.

Neither capability replaces deterministic execution or engineering ownership.

The final responsibility model remains:

```text
AI assists.
Schemas constrain.
Tests validate.
Humans decide.
```