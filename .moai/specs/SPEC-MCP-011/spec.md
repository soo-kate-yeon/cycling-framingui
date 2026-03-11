---
id: SPEC-MCP-011
version: "1.0.0"
status: "in_progress"
created: "2026-03-11"
updated: "2026-03-11"
author: "Codex + soo-kate-yeon"
priority: "critical"
---

# SPEC-MCP-011: MCP Pipeline Quality Gates

## Summary

FramingUI MCP failures are disproportionately damaging during first-run adoption. The current test strategy verifies individual tools and some API routes, but it does not enforce a staged pipeline contract across installation environment, theme inspection, screen validation, code generation, CSS variable safety, and runtime rendering.

This SPEC introduces a two-lane quality strategy:

1. A cheap PR gate that blocks obvious MCP pipeline regressions on every pull request.
2. A heavier scheduled E2E lane that runs browser and runtime checks without slowing every PR.

## Problem

Observed failure mode:

- theme data and CSS variable contracts drift independently
- generated code compiles only in some environments
- legacy variable names can leak into recipes or output
- existing host CSS can interfere with FramingUI defaults
- the current CI structure does not test the guarded production workflow end-to-end

The result is that production-breaking MCP regressions can merge even when unit tests are green.

## Goals

- Define a single MCP pipeline quality contract that matches real user flow.
- Separate required PR coverage from slower nightly coverage.
- Ensure CSS variable contract regressions are caught before merge.
- Ensure core workflow tools remain mutually consistent.
- Leave room for future fixture-based app environment E2E without redesigning CI again.

## Non-Goals

- Building the full fixture matrix in the first implementation step
- Running all browser E2E on every pull request
- Replacing existing package-level unit tests

## Required Pipeline Stages

### PR Gate

The PR lane must validate the cheapest useful regressions:

1. Theme load/runtime normalization
2. Theme authority consistency
3. Screen contract parity between validation and generation
4. Generation quality for known regressions
5. CSS variable route contract

### Nightly Lane

The nightly lane must validate slower runtime behavior:

1. Built app boots in CI
2. Browser smoke checks against production-like Next.js output
3. Manual or scheduled expansion point for fixture-based environment E2E

## EARS Requirements

### Ubiquitous

- The repository SHALL define a dedicated MCP PR gate command.
- The repository SHALL define a separate MCP nightly/browser command or workflow.
- The PR gate SHALL run on pull requests to `main` and `master`.
- The nightly lane SHALL NOT be required for every PR.

### Event-Driven

- WHEN a pull request modifies MCP-adjacent code THEN the MCP PR gate SHALL fail if targeted contract tests fail.
- WHEN the nightly workflow runs THEN the browser E2E suite SHALL execute against a built application.
- WHEN a CSS variable regression leaks a legacy prefix or missing page variable contract THEN the PR gate SHALL fail.

### State-Driven

- IF a regression only affects browser/runtime integration and not the targeted contract tests THEN the nightly lane SHALL be the detection point.
- IF the repository later adds fixture-based pristine/existing-CSS app tests THEN they SHALL plug into the nightly lane before being promoted to PR-critical checks.

### Unwanted

- The repository SHALL NOT run the full browser E2E suite on every PR by default.
- The repository SHALL NOT rely only on homepage/docs smoke tests as the MCP quality signal.

## Initial Implementation Scope

### In Scope

- Add `ci:mcp:pr`
- Add `ci:mcp:nightly`
- Add PR job in `quality-gate.yml`
- Move heavy `e2e-tests.yml` away from PR-triggered mandatory execution
- Document the lane split in SPEC artifacts

### Deferred

- Fixture-based pristine Next.js app generation
- Fixture-based existing global CSS app generation
- CSS variable graph validation against generated class usage
- Visual diff assertions for generated screens

## Validation Commands

- `pnpm ci:mcp:pr`
- `pnpm --filter @framingui/core build`
- `pnpm --filter @framingui/playground-web type-check`
- `pnpm ci:mcp:nightly`

## Affected Files

- `package.json`
- `.github/workflows/quality-gate.yml`
- `.github/workflows/e2e-tests.yml`
- `.moai/specs/SPEC-MCP-011/*`

