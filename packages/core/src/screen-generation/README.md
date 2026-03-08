# Screen Generation Runtime

Internal notes for the screen-generation runtime in `@framingui/core`.

## Purpose

This module provides the lower-level primitives behind FramingUI screen workflows:

- screen-definition validation
- screen resolution
- React and style output helpers

## Current Product Relationship

The recommended product workflow is no longer direct manual use of these files.
Production users should go through `@framingui/mcp-server`, which adds:

- theme and component discovery
- guarded screen-generation prompts
- structure validation before code writing
- environment and source-file checks

## Files

- `API.md`: internal API orientation
- `INTEGRATION.md`: repository-level integration notes
- `PHASE-1.md` to `PHASE-3.md`: historical implementation notes
