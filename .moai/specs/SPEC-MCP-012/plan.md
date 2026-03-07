# SPEC-MCP-012 Plan

1. Add a style contract reader utility to classify the host project CSS contract.
2. Extend `validate-environment` schemas and output to include style contract diagnostics.
3. Update `screen-workflow` and `doctor-workflow` to treat style contract detection as part of the default process.
4. Extend slash command metadata for `/screen` and `/section` with `--style-contract`.
5. Add targeted tests for style contract diagnostics.
6. Sync README, package docs, and spec reports after validation.
