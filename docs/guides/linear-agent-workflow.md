# Linear Agent Workflow

This guide defines how FramingUI should use Linear as the control plane for Symphony.

## Core Idea

Symphony does not need a webhook to start work in the basic model.

It polls Linear on a fixed interval, fetches issues in configured active states, and dispatches eligible issues. In the Symphony spec, the tick sequence is:

1. reconcile currently running issues
2. validate workflow config
3. fetch candidate issues from the tracker
4. sort and dispatch eligible work

This means the practical trigger is:

- an issue enters an active state configured in `WORKFLOW.md`
- the next poll tick sees it
- Symphony claims and starts it if concurrency and blocker rules allow

## Recommended Linear States

Use a narrow set of agent-facing states instead of letting every `Todo` or `In Progress` issue trigger automation.

Recommended workflow:

- `Triage`
  - default intake state
  - does not trigger Symphony
- `Needs Spec`
  - human planning or spec-writing state
  - does not trigger Symphony
- `Agent Ready`
  - full `plan -> run -> sync`
  - triggers Symphony
- `Agent Fast Path`
  - small fix path
  - triggers Symphony
- `Human Review`
  - agent handoff state after implementation
  - does not trigger new runs
- `Done`
  - terminal
- `Canceled`
  - terminal

## Recommended Labels

States determine whether Symphony starts. Labels refine how Codex should behave after it starts.

- `agent:ui`
  - use FramingUI MCP-first procedure
- `agent:fast-path`
  - confirms that the issue is intended for the quick path
- `agent:spec-required`
  - force formal planning or SPEC work
- `agent:docs`
  - ensure doc sync is part of delivery
- `agent:mcp`
  - signals MCP server or tool-surface impact

## Full Flow vs Fast Path

Use `Agent Ready` when:

- the issue spans multiple files or packages
- the task affects shared APIs, tokens, architecture, or MCP behavior
- a new SPEC is needed
- you expect substantial review discussion

Use `Agent Fast Path` when:

- the issue is clearly bounded
- the change is low risk
- no new SPEC should be required
- verification can stay narrow at first

If a fast-path issue grows beyond those boundaries, move it back to `Needs Spec` or `Agent Ready` and let the next run follow the full workflow.

## Example Transitions

Feature work:

- `Triage` -> `Needs Spec` -> `Agent Ready` -> `Human Review` -> `Done`

Small fix:

- `Triage` -> `Agent Fast Path` -> `Human Review` -> `Done`

Interrupted run:

- `Agent Ready` -> `Blocked`
- because the issue leaves the active state set, Symphony should stop the run on reconciliation

## Operational Rules

- Only `Agent Ready` and `Agent Fast Path` should be listed in `tracker.active_states`.
- Do not include broad states such as `Todo` unless you want nearly all open work to be automation-eligible.
- Use `Human Review` as the normal success handoff state.
- Let humans move an issue back into an active state if they want another automation pass.

## Why This Works Well

This keeps the board as the single control surface:

- state decides whether automation runs
- labels decide what flavor of automation runs
- moving an issue out of an active state acts as a stop signal

That gives you a board-driven override for both complex features and tiny fixes without changing Symphony itself.
