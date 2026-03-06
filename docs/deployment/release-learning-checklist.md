# Release Learning Checklist

This document captures release and deployment guardrails learned from:

- the March 6, 2026 MCP theme/icon/template deployment failures
- the MCP workflow reliability and contract drift fixes completed in `SPEC-MCP-008`

Related docs:

- [Catalog Source of Truth](../architecture/catalog-source-of-truth.md)
- [Vercel Setup](./vercel-setup.md)
- [Staging Deployment Checklist](./staging-deployment-checklist.md)

## Why Releases Broke

The failures were not isolated bugs. They came from a few structural patterns repeating across packages:

1. Runtime behavior depended on local-only paths or local-only state.
2. Auth-sensitive API behavior was cached or inferred incorrectly.
3. Multiple packages defined the same contract differently.
4. Build and typecheck paths were not validated the same way as production paths.
5. Release steps did not enforce lockfile, artifact, and downstream compatibility together.

## Failure Classes

### 1. Local path dependency

Symptoms:

- `list-themes` and `preview-theme` returned zero data in deployed environments.
- packaged code behaved differently from local dev.

Root cause:

- `@framingui/core` treated local `.moai` directories as effective defaults.
- deployment `cwd` and local `cwd` were not equivalent.

### 2. Auth/cache mismatch

Symptoms:

- `whoami` showed a license but `list-themes` returned empty.
- theme/API responses leaked across sessions.

Root cause:

- auth-dependent `/api/mcp/*` responses were treated as shareable cache entries.
- `Vary: Authorization` and private cache semantics were missing or inconsistent.

### 3. Contract drift across packages

Symptoms:

- `validate-screen-definition` and `generate_screen` disagreed.
- `playground-web` components API exposed a different component universe from MCP.
- docs and prompts described a workflow different from runtime behavior.

Root cause:

- no single source of truth for screen components, theme authority, or tool workflow.
- hidden prerequisites such as `whoami` existed only in runtime code.

### 4. Clean-room build gaps

Symptoms:

- builds passed locally but failed in CI or Vercel.
- typecheck and runtime resolution did not use the same package entry paths.

Root cause:

- scripts assumed generated files or previous build output already existed.
- package consumers used different resolution rules in tests, TypeScript, Next.js, and runtime.

### 5. Release integrity gaps

Symptoms:

- published package versions and lockfile state diverged.
- downstream consumers broke after publish even when package-local tests were green.

Root cause:

- version bump, lockfile sync, pack artifact validation, and downstream smoke tests were not enforced as one unit.

## Operating Principles

### 1. Keep one source of truth per contract

Apply this to:

- theme authority
- screen component catalog
- template metadata
- tool workflow semantics

Rules:

- define one canonical artifact or API for each contract
- make every consumer read that contract instead of copying it
- treat duplicate hardcoded registries as release blockers

### 2. Never hide workflow prerequisites

Rules:

- if a tool requires prior state, expose it as explicit capability metadata or structured error data
- do not rely on prompt wording or tribal knowledge
- `whoami`-style inspection tools must not silently gate unrelated tools

### 3. Validate the same paths production will use

Rules:

- typecheck path, test path, build path, and runtime path must agree on package resolution
- if Next.js uses one module entry and Vitest uses another, that is a release risk
- prefer package exports and explicit build artifacts over ad hoc relative imports in consumers

### 4. Auth-sensitive endpoints must be private by default

Default headers for auth-dependent MCP routes:

```http
Cache-Control: private, no-store
Vary: Authorization
```

Rules:

- never share cached responses across identities
- never cache "empty but maybe stale" auth-dependent success as a normal success path

### 5. Generated output must earn production-ready language

Rules:

- generator output must be backed by tested mappings only
- unsupported output paths must fail explicitly
- generated code must preserve children/content and avoid invented classes or props

### 6. Release validation must include consumer reality

Rules:

- package-local green is necessary, not sufficient
- validate at least one downstream consumer for changed shared packages
- build artifacts, type declarations, and runtime entries must all be consumable

## Required Checklist

## 1. Source of Truth

- [ ] Themes, icon libraries, templates, and screen component metadata each have one canonical source
- [ ] No duplicated hardcoded catalog exists across `core`, `mcp-server`, and `playground-web`
- [ ] Docs, prompts, API routes, validators, and generators all match the same contract
- [ ] Hidden workflow gates are removed or surfaced explicitly

## 2. Catalog and Data Packaging

- [ ] Tracked package data is the default source for shipped behavior
- [ ] `.moai` is treated as override, cache, or local artifact only
- [ ] Deployed environments work without local-only generated directories
- [ ] Bundled JSON/data needed at runtime is included in package output

## 3. Auth and Session Semantics

- [ ] Protected tools work directly after authentication unless an explicit prerequisite is documented in code and API
- [ ] Auth failures return structured remediation, not vague string errors
- [ ] Session inspection tools do not unlock hidden state
- [ ] Entitlement, listing, and detail APIs agree for the same authenticated session

## 4. API Cache Safety

- [ ] Auth-dependent routes use `Cache-Control: private, no-store`
- [ ] Auth-dependent routes use `Vary: Authorization`
- [ ] Empty, stale, or unauthorized responses cannot poison later success paths
- [ ] Client-side caches do not persist entitlement mismatches as normal success

## 5. Contract Parity

- [ ] Validation and generation use the same schema version and component catalog
- [ ] API catalog routes expose the same supported top-level components as MCP tools
- [ ] Compound/subcomponent rules are represented consistently everywhere
- [ ] Theme authority is resolved from one capability model

## 6. Codegen Quality

- [ ] Generated output does not invent Tailwind classes or unsupported props
- [ ] Text children and nested children are preserved
- [ ] Unsupported generation paths fail explicitly
- [ ] Theme recipes are applied automatically where supported

## 7. Build and Typecheck

- [ ] Shared packages build from a clean state
- [ ] Consumer apps typecheck against built artifacts or package exports intentionally
- [ ] Build-specific config and typecheck-specific config do not fight each other
- [ ] Next.js, Vitest, and TypeScript resolve shared packages consistently enough to avoid drift

## 8. Release Integrity

- [ ] `package.json`, `CHANGELOG.md`, and `pnpm-lock.yaml` move together
- [ ] `pnpm install` or equivalent lockfile sync step has been run
- [ ] `npm pack --dry-run` or equivalent artifact check has been verified for changed packages
- [ ] downstream dependency ranges accept the released version

## 9. Deploy Validation

- [ ] Preview deploy output shows the actual branch and SHA
- [ ] CI logs make the failing stage obvious without local reproduction
- [ ] production build includes workspace dependency builds
- [ ] at least one real consumer path is verified after shared package changes

## Recommended Automation

### A. Contract parity tests

Add regression tests for:

- auth bootstrap without hidden `whoami`
- theme entitlement/list/detail consistency
- validation vs generation parity
- API catalog vs MCP catalog parity

### B. Clean-room build job

Run a CI job that:

- removes `dist`
- removes build info files
- avoids local-only generated folders
- rebuilds changed packages from scratch

### C. Consumer smoke job

For shared package changes, run a consumer build that exercises:

- package runtime import
- type declarations
- framework integration path such as Next.js or Vite

### D. Release integrity gate

Before publish:

- verify changed versions
- verify lockfile updates
- verify package pack output
- verify downstream install/build smoke path

## Stop-Release Questions

Stop the release if any answer is "no":

1. Does production behavior work without local-only state or directories?
2. Does every auth-dependent route avoid shared cache behavior?
3. Do all consumers read the same contract for this feature?
4. Do validation, generation, API, docs, and prompts agree?
5. Have build, typecheck, and runtime paths all been exercised?
6. Did version, changelog, lockfile, and artifact validation move together?

These are the main lessons. Most release failures in this repo have been contract failures, path failures, or validation-path mismatch failures, not isolated implementation bugs.
