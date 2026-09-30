# AI-Assisted Engineering & MCP Evidence

This showcase documents the validated AI-assisted engineering workflow used by the canonical Quality Engineering framework.

The workflow combines:

```text
Repository Context
        +
Golden Templates
        +
Authoritative External Evidence
        ↓
GitHub Copilot / Copilot Agent
        ↓
Engineering Proposal
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

AI assistance operates inside the engineering system.

It does not replace:

- repository architecture;
- testing standards;
- Golden Templates;
- authoritative evidence;
- deterministic validation;
- human engineering review.

The canonical private framework remains the source of truth.

This public showcase presents the validated workflow and curated evidence model without publishing the complete private AI instruction set.

---

## Capability Summary

| Capability | Status | Validation |
| --- | --- | --- |
| Repository AI instructions | Implemented | Used in validated engineering workflows |
| Semantic repository context | Implemented | Used before AI-assisted implementation |
| Golden Template discovery | Implemented | Validated against existing canonical implementations |
| Golden Template structural compliance | Implemented | Validated through human review |
| Copilot-assisted test generation | Implemented | Deterministically validated |
| Human feedback and refinement loop | Implemented | Validated through real implementation refinement |
| Copilot Agent engineering workflow | Implemented | Validated |
| Copilot Agent deterministic validation | Implemented | Validated |
| OpenAPI MCP contract discovery | Implemented | Validated |
| OpenAPI MCP-assisted test proposal | Implemented | Validated |
| Playwright MCP browser exploration | Implemented | Validated against a real running application |
| Playwright MCP-assisted UI test generation | Implemented | Deterministically validated |

The workflow is intentionally evidence-driven rather than prompt-driven.

---

# Repository Context

AI-assisted engineering begins with repository-owned context.

Before proposing implementation, the assistant must inspect the relevant engineering sources.

These include:

```text
Repository AI Instructions
        +
Architecture
        +
Testing Standards
        +
Relevant ADRs
        +
Existing Implementations
```

The purpose is to answer:

```text
How does this change belong in the framework?
```

before answering:

```text
What code should be generated?
```

Repository architecture remains authoritative for implementation ownership.

---

## Repository Evidence

Repository evidence may establish:

- test placement;
- execution project;
- fixture ownership;
- client ownership;
- schema ownership;
- Page Object ownership;
- Component Object ownership;
- factory patterns;
- assertion placement;
- naming conventions;
- dependency direction;
- validation requirements;
- existing architectural boundaries.

AI-generated implementation must fit these established responsibilities.

The workflow does not allow an assistant to invent a parallel architecture simply because another implementation would also work.

---

# Golden Template Discovery

A Golden Template is the closest existing validated repository implementation with equivalent responsibility and execution ownership.

The lifecycle is:

```text
Existing Validated Implementation
        ↓
Responsibility Match
        ↓
Golden Template
        ↓
Future Human or AI-Assisted Implementation
```

A documented pattern is not automatically a Golden Template.

The underlying implementation must already exist and be validated.

---

## Golden Template Compliance

AI-assisted implementation is expected to follow the selected Golden Template across more than behavior.

Relevant dimensions include:

```text
Behavior
Architecture
Structure
Test placement
Fixture usage
Factory usage
Client usage
Page / Component ownership
Assertion placement
Naming
Interaction patterns
Schema-validation patterns
Formatting
Code organization
```

The governing principle is:

```text
reuse
→ extend
→ create
```

New abstractions are introduced only when an existing responsibility cannot be reused or extended cleanly.

---

# Copilot-Assisted Test Generation

The validated Copilot-assisted workflow is:

```text
Test Scenario
        ↓
Repository Context
        ↓
Golden Template Discovery
        ↓
Copilot Proposal
        ↓
Human Review
        ↓
Targeted Feedback
        ↓
Copilot Implementation
        ↓
Deterministic Validation
        ↓
Human Approval
```

The initial interaction is deliberately review-first.

The assistant should not immediately modify repository files.

Instead, it first establishes:

- which existing implementation is the Golden Template;
- which repository rules apply;
- whether the requested scenario is already covered;
- which architectural layers are affected;
- the smallest architecturally complete proposed change;
- which expected behaviors are actually supported by evidence;
- where uncertainty remains.

Only after human review should implementation proceed.

---

# Validated Copilot-Assisted Example

The first validated Copilot-assisted implementation covered the scenario:

```text
Task creation is rejected when priority is outside
the supported values:

low
medium
high
```

The existing negative create-task validation tests were identified as the relevant Golden Template.

The initial proposal attempted to make the malformed request possible through a broad object-level type cast.

Conceptually:

```text
Valid Task Factory
        ↓
Entire Payload Type Escape
        ↓
Malformed Priority
```

Human review identified that this surrendered more type safety than the scenario required.

The feedback required the invalid runtime value to remain explicit and local to the field under test.

The corrected model became:

```text
createTask()
        ↓
Strongly Typed Valid Baseline
        ↓
Local Intentional Invalid Priority
        ↓
Negative API Scenario
```

The shared domain type was not weakened.

The shared factory was not weakened.

No new abstraction was introduced.

---

## Human Feedback Loop

The validated workflow demonstrated that AI output is not treated as final implementation merely because it is plausible.

The sequence was:

```text
Copilot Proposal
        ↓
Human Architecture Review
        ↓
Type-Safety Issue Identified
        ↓
Targeted Feedback
        ↓
Refined Implementation
        ↓
Deterministic Validation
```

Human review also corrected scenario placement so that the generated test remained structurally consistent with the existing negative validation tests.

This validated an important engineering principle:

```text
AI generation
≠
engineering approval
```

---

## Deterministic Validation

The refined implementation passed:

```text
Prettier
→ PASS

TypeScript Typecheck
→ PASS

Targeted API Execution
→ PASS
```

The implementation was reviewed before commit and push.

Therefore:

```text
Copilot-Assisted Test Generation
→ VALIDATED
```

---

# Copilot Agent Engineering

Copilot Agent is used differently from assisted code generation.

The distinction is:

```text
Copilot-Assisted Generation
→ human drives individual implementation steps
→ Copilot proposes or generates
→ human reviews

Copilot Agent
→ receives a bounded engineering objective
→ discovers repository context
→ evaluates existing implementation
→ determines whether modification is necessary
→ selects validation
→ executes validation
→ reports evidence and uncertainty
```

A successful Agent task does not require a code change.

Correctly determining that the existing implementation already satisfies the requirement is a valid engineering result.

---

# Validated Copilot Agent Example

The previously implemented unsupported-priority scenario was later given to Copilot Agent as an independent engineering validation task.

The Agent inspected the relevant implementation layers, including:

```text
API spec
Domain types
Runtime schema
Task factory
API client
Fixtures
Repository AI instructions
Architecture documentation
Testing standards
Relevant ADRs
```

The existing create-task validation tests were selected as the Golden Template.

The Agent independently concluded:

```text
Architecture
→ preserved

Factory pattern
→ preserved

Domain type
→ not weakened

Additional abstraction
→ unnecessary

Code correction
→ unnecessary
```

The correct result was:

```text
NO CODE CHANGE REQUIRED
```

This is important because agentic engineering should not manufacture changes simply to demonstrate activity.

---

## Agent Validation Evidence

The Agent independently executed deterministic validation.

The validated result was:

```text
Targeted Prettier Check
→ PASS

TypeScript Typecheck
→ PASS

Targeted Unsupported-Priority Test
→ PASS

Complete Create-Task API Spec
→ 8 PASSED
```

The Agent also preserved an important evidence boundary:

```text
Exact field-level invalid-enum response
→ NOT ESTABLISHED
→ INTENTIONALLY NOT ASSERTED
```

Therefore:

```text
Copilot Agent Engineering Workflow
→ VALIDATED

Copilot Agent Deterministic Validation
→ VALIDATED
```

---

# Evidence Provenance

AI-assisted engineering uses multiple evidence sources.

They deliberately remain separate.

```text
Repository Evidence
        ↓
How the implementation belongs

OpenAPI Evidence
        ↓
What the provider contract documents

Browser Evidence
        ↓
What the running UI exposes
```

These evidence sources answer different questions.

One source must not silently substitute for another.

---

# OpenAPI MCP Contract Discovery

Repository code may represent an API contract, but repository representation is not automatically authoritative provider-contract evidence.

OpenAPI MCP adds an independent contract-discovery source.

The validated model is:

```text
Repository Context
        +
Golden Template
        +
OpenAPI MCP
        ↓
Contract Evidence
        +
Repository Evidence
        ↓
Copilot Agent
```

OpenAPI MCP is used for contract discovery.

The validated proof of concept intentionally did not use MCP to execute the real API.

The responsibility boundary is:

```text
OpenAPI Specification
        ↓
Read / Explore
        ↓
Contract Evidence
        ↓
AI Engineering Reasoning
```

not:

```text
AI Agent
        ↓
Uncontrolled Provider API Execution
```

---

## Validated OpenAPI Discovery

The validated contract-discovery workflow inspected the task-creation API.

The discovered provider-contract evidence established:

```text
HTTP Method
→ POST

Path
→ /api/tasks

Required Request Field
→ title

Allowed Priority Values
→ low
→ medium
→ high

Success Response
→ 201 Created

Validation Response
→ 400 Bad Request

Authentication
→ HTTP Bearer JWT
```

The repository representation was then inspected independently.

The framework's schema and constants matched the discovered contract for the evaluated behavior.

Therefore:

```text
OpenAPI MCP Contract Discovery
→ VALIDATED
```

---

# OpenAPI MCP-Assisted Test Proposal

The next validation combined:

```text
Repository Context
+
Golden Template
+
OpenAPI Contract Evidence
```

for the unsupported-priority scenario.

The Agent separately established:

```text
OpenAPI Evidence
→ allowed priority values
→ documented validation response
→ authentication requirement
→ endpoint method and path

Repository Evidence
→ TaskPriority representation
→ task factory pattern
→ API client ownership
→ fixture ownership
→ negative-test structure
→ assertion conventions
```

This separation allowed the implementation proposal to distinguish provider facts from framework implementation details.

---

## Evidence Boundary

The Agent did not invent contract details that were not established.

For example:

```text
priority values
→ OpenAPI contract evidence

400 validation response
→ OpenAPI contract evidence

framework test structure
→ repository evidence

TaskPriority representation
→ repository evidence

exact field-level error message
→ NOT ESTABLISHED
→ NOT ASSERTED
```

The resulting implementation proposal matched the previously reviewed and validated implementation pattern.

The proof of concept did not reapply the code change because the scenario had already been implemented.

Its purpose was to validate the additional evidence source.

Therefore:

```text
OpenAPI MCP
+
Repository Evidence Separation
→ VALIDATED

OpenAPI MCP-Assisted Test Proposal
→ VALIDATED
```

---

# Playwright MCP Browser Exploration

Playwright MCP provides runtime browser evidence for AI-assisted UI engineering.

The model is:

```text
Repository Context
        +
Golden Templates
        +
Playwright MCP Browser Evidence
        ↓
Copilot Agent
```

Playwright MCP answers questions about the actual running application.

Repository context answers questions about how that observed behavior should be represented inside the framework.

---

## Responsibility Boundary

Playwright MCP may establish:

- visible runtime application state;
- accessible roles;
- accessible names;
- form fields;
- available actions;
- browser interaction behavior;
- runtime uncertainty.

The repository remains responsible for:

- Page Object ownership;
- Component Object ownership;
- fixture architecture;
- factory usage;
- test placement;
- assertion ownership;
- locator ownership;
- validation rules.

Therefore:

```text
Browser Evidence
≠
Framework Architecture
```

---

# Validated Browser Exploration

The first Playwright MCP proof of concept explored the real task-creation UI.

The initial exploration identified the authenticated task dashboard and the `New Task` action.

However, the task-creation form was not reliably represented in the initial accessibility snapshot.

The Agent did not invent the missing UI structure.

Instead:

```text
Missing Browser Evidence
        ↓
Uncertainty Reported
        ↓
Targeted Browser Investigation
```

This behavior is part of the validated workflow.

---

## Targeted Browser Investigation

The targeted investigation established:

```text
Authenticated Page
→ /dashboard

New Task
→ visible
→ enabled
→ click fires

URL After Click
→ remains /dashboard

Task Creation Request
→ no POST occurs merely from opening the dialog

Dialog
→ visible
→ role: dialog
→ heading: Create New Task
```

The form exposed:

```text
Title
→ textbox

Description
→ optional textbox

Priority
→ combobox
→ default: Medium

Priority Options
→ Low
→ Medium
→ High

Actions
→ Cancel
→ Create Task
→ Close
```

The investigation also established the behavior selected for test generation:

```text
Empty Title
→ Create Task disabled

Title Contains Value
→ Create Task enabled
```

No task submission was required to observe this behavior.

No task was created during the investigation.

---

# Runtime Uncertainty Handling

The browser exploration also exposed an accessibility-tree inconsistency around the rendered task dialog.

The dialog was visibly rendered, while its accessibility representation was initially inconsistent.

A console warning related to dialog description metadata was also observed.

The exact product-level cause was not established during the proof of concept.

Therefore:

```text
Observed Runtime Behavior
→ RECORDED

Exact Root Cause
→ UNKNOWN

Speculative Framework Workaround
→ NOT INTRODUCED
```

This demonstrates the same evidence-first rule used elsewhere in the AI workflow:

```text
Unknown
→ report uncertainty

Unknown
≠
permission to invent explanation
```

---

# Playwright MCP-Assisted UI Test Generation

The first selected scenario was:

```text
The Create Task button remains disabled
until a task title is entered.
```

The scenario was chosen because it was:

- directly supported by runtime browser evidence;
- observable without submitting the form;
- non-destructive;
- suitable for validating MCP evidence together with repository architecture.

The engineering workflow became:

```text
Playwright MCP Browser Evidence
        +
Repository Context
        +
Golden Template
        ↓
Copilot Proposal
        ↓
Human Review
        ↓
Refined Implementation
        ↓
Deterministic Playwright Validation
```

---

## Repository Evidence

The AI-assisted proposal inspected the existing UI architecture.

The relevant ownership model was:

```text
TasksDashboardPage
→ page-level task-dashboard interaction

task-dashboard.spec.ts
→ test intent and assertions

authenticated UI fixtures
→ browser setup

existing UI implementation
→ Golden Template
```

This evidence determined where the new behavior belonged.

---

## Human Review of the UI Proposal

The initial AI proposal was functionally reasonable but attempted to perform reusable task-title interaction directly inside the spec.

Human review compared the proposal with existing canonical repository patterns.

Existing validated UI implementations keep reusable page-level interaction inside the owning Page Object.

The proposal was therefore refined to preserve that responsibility boundary.

The review model was:

```text
Functionally Valid Proposal
        ↓
Architecture Review
        ↓
Ownership Issue Identified
        ↓
Targeted Human Feedback
        ↓
Page Object Responsibility Preserved
        ↓
Refined Implementation
```

This is an important distinction.

Passing behavior alone is not sufficient.

The implementation must also belong correctly in the framework.

---

## Deterministic UI Validation

The final MCP-assisted implementation was validated through real Playwright execution.

Therefore:

```text
Playwright MCP Browser Exploration
→ VALIDATED

Playwright MCP
+
Repository Evidence Separation
→ VALIDATED

Playwright MCP-Assisted UI Test Generation
→ VALIDATED
```

The browser evidence informed the scenario.

Repository architecture determined the implementation structure.

Human review corrected the ownership boundary.

Playwright execution provided deterministic validation.

---

# Unified AI-Assisted Engineering Model

The validated engineering model can be represented as:

```text
                 Engineering Task
                        │
                        ↓
              Repository Architecture
                        +
                 Golden Templates
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ↓                           ↓
     OpenAPI MCP                Playwright MCP
          │                           │
          ↓                           ↓
   API Contract Evidence       Browser Evidence
          │                           │
          └─────────────┬─────────────┘
                        ↓
               Copilot / Agent
                        ↓
              Engineering Proposal
                        ↓
                  Human Review
                        ↓
                Targeted Feedback
                        ↓
             Refined Implementation
                        ↓
           Deterministic Validation
                        ↓
                 Human Approval
```

Not every engineering task requires MCP.

MCP is used when an authoritative external evidence source materially improves the engineering decision.

---

# Deterministic Validation

AI-generated implementation is not validation evidence.

The standard validation flow remains:

```text
Implementation
        ↓
Formatting
        ↓
Typecheck
        ↓
Targeted Test Execution
        ↓
Affected Regression
        ↓
CI where applicable
        ↓
Human Approval
```

The exact validation depends on the affected capability.

Examples include:

```text
API
→ targeted API execution

UI
→ Playwright project execution

Database
→ dedicated database project

Accessibility
→ accessibility project

Visual Regression
→ canonical visual execution

Performance
→ k6 or Lighthouse validation
```

AI does not receive a separate quality gate.

It must pass the same engineering system as human-authored code.

---

# Engineering Guardrails

The validated workflow explicitly prevents several failure modes.

AI-assisted engineering must not:

- invent provider behavior;
- invent missing contract details;
- treat repository assumptions as external contract facts;
- treat browser observations as architecture ownership;
- weaken shared domain types to make a negative test easier;
- introduce abstractions without demonstrated responsibility;
- duplicate existing framework layers;
- move reusable interaction into specs when an owning abstraction already exists;
- weaken assertions merely to make tests pass;
- update approved visual baselines merely to make CI green;
- suppress real accessibility failures;
- weaken performance thresholds without evidence;
- treat generated code as validation;
- treat MCP output as deterministic proof;
- treat plausible explanations as established facts.

When evidence is insufficient:

```text
State Uncertainty
        ↓
Seek Better Evidence
        ↓
Do Not Guess
```

---

# Human Engineering Ownership

AI may:

- inspect;
- discover;
- compare;
- propose;
- generate;
- validate;
- report;
- identify uncertainty.

The human engineer remains responsible for:

- test intent;
- architectural decisions;
- Golden Template selection;
- acceptable type-system escapes;
- abstraction boundaries;
- provider-contract interpretation;
- evidence sufficiency;
- semantic correctness;
- final implementation approval.

The responsibility model is:

```text
Evidence informs.
AI assists.
Deterministic execution validates.
Humans decide.
```

---

# Public Evidence Boundary

The public portfolio intentionally does not publish the complete private AI instruction set.

Public representation may describe:

- repository-aware AI governance;
- Golden Template principles;
- evidence provenance;
- human-review workflow;
- validated Copilot workflows;
- validated Agent workflows;
- OpenAPI MCP contract discovery;
- Playwright MCP browser exploration;
- deterministic validation boundaries.

The complete operational content of:

```text
AGENTS.md
.github/copilot-instructions.md
private engineering prompts
complete private framework source
```

remains private.

This separation demonstrates the engineering model without turning the public showcase into a mirror of the canonical private repository.

---

# Evidence Classification

## Repository Evidence

Supports claims about:

```text
Framework Architecture
Golden Templates
Implementation Ownership
Testing Standards
AI Engineering Governance
```

---

## OpenAPI MCP Evidence

Supports claims about:

```text
Provider API Contract
Endpoint Method
Endpoint Path
Required Fields
Documented Enum Values
Documented Response Status
Authentication Contract
```

---

## Playwright MCP Evidence

Supports claims about:

```text
Runtime Browser State
Accessible Roles
Accessible Names
Available UI Actions
Observed Interaction Behavior
Runtime Uncertainty
```

---

## Deterministic Execution Evidence

Supports claims about:

```text
Formatting
Type Safety
Test Execution
Regression Behavior
Framework Validation
```

---

## Human Review

Owns:

```text
Semantic Correctness
Architecture Approval
Evidence Interpretation
Final Engineering Decision
```

---

# Validated Capability Status

The current AI-assisted engineering workflow has validated:

```text
Repository AI Instructions
→ VALIDATED IN USE

Semantic Repository Context
→ VALIDATED

Golden Template Discovery
→ VALIDATED

Golden Template Structural Compliance
→ VALIDATED

Copilot-Assisted Test Generation
→ VALIDATED

Human Feedback / Refinement Loop
→ VALIDATED

Copilot Agent Engineering Workflow
→ VALIDATED

Copilot Agent Deterministic Validation
→ VALIDATED

OpenAPI MCP Contract Discovery
→ VALIDATED

OpenAPI MCP + Repository Evidence Separation
→ VALIDATED

OpenAPI MCP-Assisted Test Proposal
→ VALIDATED

Playwright MCP Browser Exploration
→ VALIDATED

Playwright MCP + Repository Evidence Separation
→ VALIDATED

Playwright MCP-Assisted UI Test Generation
→ VALIDATED
```

---

# Engineering Outcome

The framework does not treat AI-assisted engineering as:

```text
Prompt
→ Code
→ Done
```

The implemented model is:

```text
Engineering Context
        +
Authoritative Evidence
        ↓
AI Proposal
        ↓
Human Review
        ↓
Targeted Refinement
        ↓
Repository-Aligned Implementation
        ↓
Deterministic Validation
        ↓
Human Approval
```

This keeps AI assistance inside the same engineering discipline used by the rest of the Quality Engineering framework.

The core principle is:

```text
AI does not replace the engineering system.

It operates within
deterministic validation
and
human engineering ownership.
```