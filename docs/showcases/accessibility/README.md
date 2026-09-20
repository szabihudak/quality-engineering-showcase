# Accessibility Execution Evidence

This showcase demonstrates automated accessibility validation across both public and authenticated application states using the canonical framework implementation.

The execution was performed locally against the same accessibility project, fixtures, scanner configuration, and WCAG-oriented policy used by the private canonical framework.

## Execution Summary

| Attribute | Result |
| --- | --- |
| Test layer | Accessibility |
| Execution | Playwright + axe-core |
| Coverage | Public home page · authenticated dashboard |
| Policy | WCAG 2.2 Level AA automated rule set |
| Tests executed | 2 |
| Retries | 0 |
| Result | 2 detected quality-gate failures |
| Detected rule | `color-contrast` |
| Impact | `serious` |
| Observed contrast | `3.81:1` |
| Required contrast | `4.5:1` |

The failures represent reproducible product accessibility defects rather than framework or infrastructure failures.

No accessibility rule was suppressed or weakened to produce a passing result.

## Public Page Detection

The public home-page scan detected insufficient contrast on the **Register** navigation element.

```text
Rule:     color-contrast
Impact:   serious
Target:   .bg-primary > span
Actual:   3.81:1
Required: 4.5:1
```

![Public home page accessibility violation](./home-page-violation.png)

The automated scan identified that the foreground and background color combination does not meet the required minimum contrast ratio.

## Authenticated Page Detection

The authenticated dashboard scan independently detected the same contrast issue on the active **Task Board** navigation element.

```text
Rule:     color-contrast
Impact:   serious
Target:   a[data-testid="nav-task-board"]
Actual:   3.81:1
Required: 4.5:1
```

![Authenticated dashboard accessibility violation](./authenticated-dashboard-violation.png)

This demonstrates that accessibility validation is not limited to publicly accessible pages. The framework reuses authenticated application state and applies the same accessibility policy after authentication.

## Quality-Gate Behavior

The accessibility tests expect the Axe violation collection to be empty.

A detected violation therefore fails the test instead of being converted into informational output or silently ignored.

```text
Page state
    ↓
Accessibility scan
    ↓
WCAG policy evaluation
    ↓
Violations returned
    ↓
Zero-violation assertion
    ↓
Quality gate fails
```

A red accessibility execution does not automatically indicate a test-framework regression.

In this execution, the framework behaved as designed and surfaced reproducible product accessibility defects with actionable diagnostics.

## Execution Report

A sanitized copy of the real Playwright HTML report is published with this showcase:

[Open the rendered Playwright report](https://szabihudak.github.io/quality-engineering-showcase/showcases/accessibility/playwright-report/)

The sanitized report source is retained in this repository under:

[`playwright-report/`](./playwright-report/)

The report was generated from the real local execution and sanitized before publication to remove environment-specific or generated runtime information that is not relevant to the engineering evidence.

The canonical framework and the original local execution artifacts were not modified during sanitization.

## Evidence Policy

This showcase publishes only public-safe evidence derived from real canonical execution.

It does not publish the complete accessibility test implementation or raw runtime artifacts containing unnecessary local environment or generated test-user information.

The evidence demonstrates:

- automated WCAG-oriented accessibility validation;
- coverage of public and authenticated application states;
- actionable Axe diagnostics;
- deterministic quality-gate behavior;
- and root-cause-aware interpretation of failed executions.

The failures shown here are intentionally preserved as evidence of defect detection rather than converted into artificial passing results.