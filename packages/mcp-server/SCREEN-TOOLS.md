# Legacy Screen Tools Note

This file is kept only as a compatibility note for older references.

The current FramingUI screen workflow is documented in:

- `packages/mcp-server/docs/01-quickstart.md`
- `packages/mcp-server/docs/02-user-guide.md`
- `packages/mcp-server/docs/03-api-reference.md`

## Current Position

- `generate_screen` still exists, but it is an optional helper.
- `validate-screen-definition` is the primary structure validator.
- `get-screen-generation-context` is the main entry point for production screen work.
- slash-command guidance such as `/screen` and `/draft` is part of the supported workflow surface.
