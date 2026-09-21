# Diagnostics Execution Evidence

This showcase demonstrates failure diagnosis and root-cause classification using real execution evidence from the canonical framework.

The selected diagnostic case originates from the automated accessibility quality gate, where the framework detected reproducible product accessibility defects across both public and authenticated application states.

The showcase reuses the existing sanitized Accessibility execution evidence rather than duplicating the same runtime artifacts.

## Execution Summary

| Attribute | Result |
| --- | --- |
| Test layer | Accessibility |
| Execution | Playwright + axe-core |
| Coverage | Public home page · authenticated dashboard |
| Tests executed | 2 |
| Result | 2 detected quality-gate failures |
| Detected rule | `color-contrast` |
| Impact | `serious` |
| Diagnostic evidence | Playwright report · screenshots · retained video |
| Root-cause classification | Product defect |

The failed execution is intentionally preserved because the framework behaved as designed and surfaced reproducible product-quality issues.

The diagnostic objective is therefore not to convert the execution into a passing result, but to determine why the quality gate failed.

## Failure Evidence

The accessibility execution detected insufficient color contrast in two independent application states.

### Public Home Page

The public-page failure identified the following violation:

```text
Rule:     color-contrast
Impact:   serious
Target:   .bg-primary > span
Actual:   3.81:1
Required: 4.5:1
```

[View the public-page diagnostic screenshot](../accessibility/home-page-violation.png)

### Authenticated Dashboard

The authenticated dashboard independently reproduced the same accessibility problem:

```text
Rule:     color-contrast
Impact:   serious
Target:   a[data-testid="nav-task-board"]
Actual:   3.81:1
Required: 4.5:1
```

[View the authenticated diagnostic screenshot](../accessibility/authenticated-dashboard-violation.png)

The repeated detection across separate application states provides evidence that the failure is not an isolated automation or page-state artifact.

## Diagnostic Evidence Model

The canonical Playwright configuration preserves execution evidence that can support failure investigation.

For failed Playwright scenarios, the available diagnostic model includes:

```text
Failed execution
        ↓
HTML report
        +
JSON result
        +
failure screenshot
        +
retained video
        +
trace on first retry
        ↓
Failure investigation
```

Not every artifact is necessarily produced for every execution.

Screenshots and retained video are failure-driven, while trace collection is configured for the first retry. The selected accessibility execution ran without retries, so the published evidence does not claim a trace artifact for this execution.

The purpose of the diagnostic configuration is to provide enough execution context to investigate a failure without treating every red result as the same type of problem.

## Root-Cause Analysis

A failed quality gate does not automatically represent a framework regression.

The framework uses execution responsibility and available evidence to classify the failure:

```text
Failure
    ↓
Identify execution responsibility
    ↓
Inspect diagnostic evidence
    ↓
Determine reproducibility
    ↓
Classify root cause
```

Possible failure domains include:

```text
Framework
Product
Known Product Issue
Environment
Infrastructure
External Platform
```

For the selected accessibility execution, the evidence supports the following classification:

```text
Accessibility execution
        ↓
axe-core reports rule violation
        ↓
zero-violation assertion fails
        ↓
same issue reproduced across
public and authenticated states
        ↓
framework behavior confirmed
        ↓
Product defect
```

The framework successfully executed its accessibility responsibility and produced actionable information about the detected violation.

The red result therefore represents a product accessibility defect rather than evidence that the automation framework itself is broken.

## Quality-Gate Behavior

The accessibility quality gate expects no violations from the configured automated WCAG-oriented scan.

The detected `color-contrast` violations remain test failures.

No rule suppression, severity downgrade, exclusion, or artificial passing behavior is introduced merely to make the execution green.

```text
Real product issue
        ↓
Quality gate detects failure
        ↓
Diagnostic evidence preserved
        ↓
Root cause investigated
        ↓
Product defect classified
```

This distinction is important because framework health and product quality are separate engineering concerns.

A correctly functioning test can produce a red result when it successfully detects a real product defect.

## Diagnostic Report

The sanitized Playwright HTML report from the real accessibility execution is published as part of the Accessibility showcase:

[Open the rendered Playwright report](https://szabihudak.github.io/quality-engineering-showcase/showcases/accessibility/playwright-report/)

The sanitized report source is retained under:

[`../accessibility/playwright-report/`](../accessibility/playwright-report/)

The complete accessibility execution evidence is documented here:

[Accessibility Execution Evidence](../accessibility/README.md)

The Diagnostics showcase references this existing evidence instead of creating duplicate copies of the same screenshots, videos, or report.

## Evidence Policy

This showcase publishes only public-safe diagnostic evidence derived from real canonical execution.

It does not introduce artificial failures or reconstruct execution artifacts specifically for presentation.

The evidence demonstrates:

- failure-driven diagnostic evidence collection;
- actionable Playwright and axe-core failure information;
- investigation across public and authenticated application states;
- distinction between framework behavior and product behavior;
- root-cause-aware failure classification;
- preservation of a genuine failing quality signal;
- and reuse of sanitized execution evidence without unnecessary artifact duplication.

The original execution artifacts may contain additional runtime information that is not required to demonstrate the diagnostic capability.

Only reviewed evidence necessary to explain the failure and its classification is exposed through the public showcase.