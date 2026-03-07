# SPEC-MCP-011 Plan

1. Define the canonical slash command registry schema and the initial 10-command catalog.
2. Add command-to-workflow mappings for existing MCP tools and prompt recipes.
3. Add command adapter renderers for `json`, `markdown`, and `text` help surfaces.
4. Expose command help metadata through MCP prompts and CLI commands that clients can render as slash help or `--help`.
5. Add a CLI-first onboarding guide path for direct `npx` use without breaking stdio mode.
6. Add a project update command that detects installed FramingUI packages and emits or runs the correct package-manager update command.
7. Add regression tests for command metadata shape, command lookup, adapter output, CLI onboarding behavior, and update command construction.
8. Sync docs for MCP usage, workflow guidance, command examples, and maintenance commands.
