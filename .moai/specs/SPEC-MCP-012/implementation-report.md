# SPEC-MCP-012 Implementation Report

## Delivered

- Added `packages/mcp-server/src/utils/style-contract-reader.ts` to classify target projects as:
  - `framingui-native`
  - `host-utility`
  - `mixed`
  - `unknown`
- Extended `validate-environment` schemas and tool output with `styles` diagnostics:
  - style contract classification
  - CSS files checked
  - FramingUI style import detection
  - defined and missing variables
  - issues and suggested fixes
- Updated `screen-workflow` to treat style contract detection as Step 0 before code generation.
- Updated `doctor-workflow` to include style contract diagnosis and migration guidance.
- Added `--style-contract` help metadata to `/screen` and `/section`.
- Added required preflight metadata to `/screen` and `/section` so clients run `validate-environment (checkStyles: true)` before generation when `projectPath` is known.
- Updated command-help and adapter outputs to surface preflight steps and blocking conditions.
- Added targeted tests for FramingUI-native and mixed style contract cases.
- Added slash command registry coverage for `/screen` preflight requirements.
- Synced package docs and README to describe `validate-environment` style diagnostics.

## Validation

- `pnpm --filter @framingui/mcp-server exec vitest run __tests__/commands/slash-command-registry.test.ts __tests__/commands/slash-command-adapters.test.ts __tests__/tools/validate-environment.test.ts __tests__/prompts/prompt-catalog.test.ts`
- `pnpm --filter @framingui/mcp-server build`

## Remaining Risk

- Style contract detection uses common CSS entry file heuristics. Projects with non-standard stylesheet locations may report `unknown` until additional paths are supported.
- This SPEC intentionally does not perform automatic CSS migration; agents still need explicit user approval before changing host styling contracts.
