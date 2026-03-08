# Token System

`@framingui/core` owns the token and theme runtime used across FramingUI packages.

## Layers

- atomic tokens
- semantic tokens
- component recipes and bindings

## Current Intent

The token system should support:

- theme loading
- variable-backed UI styling
- screen generation workflows
- MCP-friendly validation and lookup

## Contributor Guidance

- avoid duplicating token contracts in package-local docs
- keep public usage examples in package READMEs concise
- keep deep token logic close to code and tests
