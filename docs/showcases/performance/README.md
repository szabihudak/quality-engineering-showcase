# Performance Execution Evidence

This showcase demonstrates API load validation and browser-performance quality gates using real execution evidence from the canonical framework.

Performance validation is intentionally split across complementary layers:

- API-level load testing with k6;
- public browser-performance auditing with Lighthouse CI;
- and authenticated browser-performance auditing through Playwright-managed application state and Lighthouse.

The showcase publishes execution evidence only. The source-of-truth implementation, thresholds, fixtures, and execution orchestration remain in the canonical private framework.

## Execution Summary

| Layer | Execution | Coverage | Result |
| --- | --- | --- | --- |
| API performance | k6 | Authenticated task-read workload | Passed |
| Public browser performance | Lighthouse CI | Public application entry page | Passed |
| Authenticated browser performance | Playwright + Lighthouse | Authenticated dashboard | Passed |

The three layers measure different performance characteristics rather than treating a single synthetic metric as a complete performance signal.

## API Performance

The API performance scenario validates authenticated task-read behavior under a controlled baseline load.

### Load Profile

| Attribute | Result |
| --- | --- |
| Tool | k6 |
| Virtual users | 2 |
| Load duration | 30 seconds |
| Completed iterations | 52 |
| Interrupted iterations | 0 |
| Checks | 56 / 56 passed |
| Task-read failures | 0 / 52 |
| HTTP failures | 0 / 56 |

The execution includes deterministic setup and cleanup around the measured workload:

```text
Register performance user
        ↓
Authenticate
        ↓
Create deterministic task
        ↓
2 VUs / 30 seconds
        ↓
Authenticated task reads
        ↓
Threshold evaluation
        ↓
Task cleanup
```

This keeps the measured operation separate from the test-data lifecycle while preserving realistic authenticated application behavior.

### Performance Thresholds

The canonical k6 scenario defines explicit quality-gate thresholds:

```text
task_read_duration
p(95) < 500 ms

task_read_failures
rate < 1%
```

The measured execution produced:

| Metric | Threshold | Actual | Result |
| --- | ---: | ---: | --- |
| Task-read p95 latency | < 500 ms | 257.33 ms | Passed |
| Task-read failure rate | < 1% | 0.00% | Passed |

Additional task-read latency measurements:

```text
Average:  177.98 ms
Median:   158.13 ms
p90:      203.18 ms
p95:      257.33 ms
Maximum:  604.79 ms
```

The quality gate intentionally evaluates the dedicated task-read metric rather than aggregating setup, authentication, task creation, cleanup, and measured reads into one undifferentiated HTTP latency value.

### k6 Execution Report

The real interactive k6 HTML dashboard is published with this showcase:

[Open the rendered k6 performance report](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/k6/task-read-load.html)

The report source is retained in this repository under:

[`k6/`](./k6/)

## Public Browser Performance

The public browser-performance layer uses Lighthouse CI against the hosted application.

Three independent Lighthouse measurements are executed to reduce reliance on a single potentially noisy browser-performance sample.

### Measurement Results

| Metric | Run 1 | Run 2 | Run 3 | Median |
| --- | ---: | ---: | ---: | ---: |
| Performance Score | 0.69 | 0.85 | 0.79 | **0.79** |
| LCP | 5473 ms | 4410 ms | 5609 ms | **5473 ms** |
| TBT | 106 ms | 28 ms | 53 ms | **53 ms** |
| CLS | 0.000038 | 0 | 0 | **0** |

The canonical browser-performance policy defines:

```text
Performance Score ≥ 0.70
CLS               ≤ 0.10
TBT               ≤ 300 ms
LCP               ≤ 6000 ms
```

The aggregated execution satisfies the configured performance policy.

The individual run variance is intentionally retained as evidence rather than selecting only the strongest measurement. Browser-performance testing is inherently sensitive to runtime conditions, which is why the canonical framework executes multiple measurements and evaluates the aggregated signal.

### Public Lighthouse Reports

The three real Lighthouse reports are published individually:

- [Open public Lighthouse run 1](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-public/run-1.html)
- [Open public Lighthouse run 2](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-public/run-2.html)
- [Open public Lighthouse run 3](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-public/run-3.html)

The report sources are retained under:

[`lighthouse-public/`](./lighthouse-public/)

## Authenticated Browser Performance

The authenticated browser-performance layer extends Lighthouse coverage beyond publicly accessible application state.

Playwright establishes the authenticated test state before Lighthouse auditing:

```text
Deterministic task fixture
        ↓
Authenticated Playwright context
        ↓
Dashboard readiness assertion
        ↓
Authentication cookies extracted
        ↓
Lighthouse receives authenticated state
        ↓
3 independent browser measurements
        ↓
Median metric aggregation
        ↓
Shared performance policy
```

This allows the framework to measure application states that standalone Lighthouse navigation cannot access without authenticated browser context.

### Measurement Results

| Metric | Run 1 | Run 2 | Run 3 | Median |
| --- | ---: | ---: | ---: | ---: |
| Performance Score | 0.96 | 0.98 | 0.97 | **0.97** |
| LCP | 2578.19 ms | 2487.42 ms | 2578.38 ms | **2578.19 ms** |
| TBT | 94 ms | 31 ms | 65 ms | **65 ms** |
| CLS | 0 | 0 | 0 | **0** |
| Speed Index | 1652.76 ms | 1272.24 ms | 1580.13 ms | **1580.13 ms** |

The median result satisfies the same shared browser-performance policy used by the framework.

The Lighthouse artifacts confirm that the measured target is the authenticated `/dashboard` route. The individual reports contain the real navigation measurements rather than reconstructed showcase data.

### Authenticated Lighthouse Reports

The three real authenticated Lighthouse reports are published individually:

- [Open authenticated Lighthouse run 1](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-authenticated/run-1.html)
- [Open authenticated Lighthouse run 2](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-authenticated/run-2.html)
- [Open authenticated Lighthouse run 3](https://szabihudak.github.io/quality-engineering-showcase/showcases/performance/lighthouse-authenticated/run-3.html)

The report sources are retained under:

[`lighthouse-authenticated/`](./lighthouse-authenticated/)

## Performance Quality-Gate Model

The framework treats performance validation as an executable quality policy rather than passive reporting.

```text
API performance
    └── latency + failure thresholds
             │
             ├──────────────┐
             │              │
Public Lighthouse      Authenticated Lighthouse
    │                       │
3 measurements         3 measurements
    │                       │
metric aggregation     metric aggregation
    │                       │
shared policy          shared policy
             │              │
             └──────┬───────┘
                    ↓
             Performance gate
```

This provides independent signals for service-level behavior, public browser rendering, and authenticated application rendering.

## Evidence Policy

This showcase publishes only public-safe evidence derived from real canonical executions.

It does not maintain a separate performance implementation or showcase-specific thresholds.

The evidence demonstrates:

- authenticated API load generation;
- explicit latency and failure-rate quality gates;
- deterministic performance test-state setup and cleanup;
- multi-run browser-performance measurement;
- metric-level aggregation;
- shared Lighthouse policy enforcement;
- public and authenticated browser-performance coverage;
- and real interactive execution reports.

Local filesystem metadata, authentication material, generated user information, and other execution details that are not necessary to demonstrate the engineering capability are excluded from the public showcase.