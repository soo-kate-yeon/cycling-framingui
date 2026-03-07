# SPEC-MCP-011 Acceptance

## Scenario 1: Command catalog is discoverable

Given a client or test harness requests the FramingUI command catalog
When the command registry is loaded
Then it returns the canonical commands:
- `/screen`
- `/section`
- `/draft`
- `/responsive`
- `/a11y`
- `/theme-swap`
- `/doctor`
- `/install-check`
- `/export`
- `/update`

## Scenario 2: Command help is sufficient for tab-help UX

Given a client inspects `/responsive`
When it requests the command metadata
Then the response contains:
- a one-line summary
- a canonical usage string
- argument definitions
- option definitions
- at least one example

## Scenario 3: Command adapters render the same registry in multiple formats

Given a client or CLI adapter requests the command registry
When it renders the registry in `json`, `markdown`, or `text`
Then each format includes `/screen` and `/responsive`
And each format preserves usage/help metadata from the canonical registry

## Scenario 4: `/screen` preserves the validated generation workflow

Given a client invokes `/screen`
When the workflow mapping is resolved
Then the mapped sequence includes:
1. `get-screen-generation-context`
2. `validate-screen-definition`
3. `generate_screen`
And `validate-environment` when a target project path is available

## Scenario 5: Responsive optimization absorbs density controls

Given a client inspects `/responsive`
When it reads supported options
Then `--density` is available with:
- `preserve`
- `denser`
- `lighter`
And no standalone `/density` command exists

## Scenario 6: Update command is part of the initial operations surface

Given a client inspects `/update`
When it reads the command metadata
Then the usage includes an optional project path
And the command is mapped to maintenance-style guidance rather than screen generation

## Scenario 7: Interactive CLI startup shows onboarding instead of raw stdio

Given a human user runs `npx @framingui/mcp-server` in an interactive terminal
When no subcommand is provided
Then the CLI prints a short onboarding guide
And it does not emit MCP protocol data on stdout

## Scenario 8: Excluded commands are not part of the phase

Given the initial registry is loaded
When command names are enumerated
Then `/palette` does not exist
And `/tone` does not exist
And `/hierarchy` does not exist
