# SPEC-MCP-012

## Title
MCP Style Contract Detection and CSS Parity Guardrails

## Status
Implemented

## Problem

The current screen workflow validates dependencies and Tailwind setup, but it does not validate whether the target project uses a style contract compatible with `@framingui/ui`.

This leads to a common failure mode:

- existing pages use direct Tailwind utilities such as `bg-white`, `text-neutral-950`
- generated FramingUI screens rely on component defaults backed by CSS variables such as `--bg-background`, `--border-default`, `--text-tertiary`
- the screen renders structurally, but visual styling appears broken or inconsistent

The workflow currently treats this as a generic styling issue instead of an explicit contract mismatch.

## Goals

1. Detect the target project's style contract before screen integration.
2. Surface contract mismatch risks in `validate-environment`.
3. Update `/screen`, `/section`, `screen-workflow`, and `doctor-workflow` to account for style contract selection.
4. Prevent silent migration from utility-first host styling to FramingUI-native variable styling.

## Non-Goals

1. Automatically rewriting user CSS.
2. Automatically migrating existing apps to FramingUI variables.
3. Introducing a new theme system or changing `@framingui/ui` variable names.

## Definitions

- `framingui-native`
  - Project imports `@framingui/ui/styles` or defines the full FramingUI variable contract required by component defaults.
- `host-utility`
  - Project appears to style pages with direct Tailwind utilities and does not define FramingUI variables.
- `mixed`
  - Project defines only part of the FramingUI variable contract. This is a high-risk state.
- `unknown`
  - No common global CSS entry file was found, so style contract could not be verified.

## Requirements

### R1. Style contract reader

Add a utility that inspects common CSS entry files and classifies the project as one of:

- `framingui-native`
- `host-utility`
- `mixed`
- `unknown`

The utility must also report:

- CSS files checked
- whether `@framingui/ui/styles` import was found
- which required FramingUI variables were found
- which required FramingUI variables are missing

### R2. Validate-environment must report styles

Extend `validate-environment` to optionally perform style contract detection and return:

- `styles.styleContract`
- `styles.cssFilesChecked`
- `styles.uiStylesImportFound`
- `styles.definedVariables`
- `styles.missingVariables`
- `styles.issues`
- `styles.fixes`

Default behavior must enable style checks.

### R3. Workflow guidance

Update `screen-workflow` so that:

- style contract detection is treated as Step 0
- the workflow explicitly warns against mixing host utility styling with FramingUI component defaults
- generated screens are expected to respect the detected contract unless the user asks for migration

Update `doctor-workflow` so that:

- style contract classification is part of diagnosis output
- migration to FramingUI-native styling is described as an explicit decision, not a silent fix

### R4. Slash command guidance

Update command metadata so `/screen` and `/section` can express the intended integration mode:

- `--style-contract host-utility`
- `--style-contract framingui-native`
- `--style-contract migrate`

This is guidance metadata for client UX and prompting. It does not require command execution plumbing in this SPEC.

## Acceptance Criteria

1. `validate-environment` returns `styles.styleContract = framingui-native` when a project imports `@framingui/ui/styles` or defines the required variables.
2. `validate-environment` returns `styles.styleContract = mixed` when only part of the variable contract is present, and includes missing variable names in the issue text.
3. `screen-workflow` documents style contract detection before code generation.
4. `/screen` and `/section` help metadata include `--style-contract`.
5. Tests cover the added style contract reporting behavior.
