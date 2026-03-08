# Screen Generation Integration

Internal integration notes for contributors working across packages.

## Recommended Integration Path

For end-user or agent-facing flows, integrate through `@framingui/mcp-server`.
That layer owns:

- discovery tools
- slash-command guidance
- style-contract handling
- validation and handoff checks

## Use `@framingui/core` Directly When

- building internal runtime utilities
- testing low-level resolution behavior
- updating code-generation primitives

## Avoid

- documenting public MCP workflows here
- duplicating package README onboarding
- pointing contributors to outdated legacy docs
