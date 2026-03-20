---
id: SPEC-BUSINESS-001
version: "0.1.0"
status: draft
created: "2026-03-17"
updated: "2026-03-17"
author: "Codex + soo-kate-yeon"
priority: HIGH
---

# SPEC-BUSINESS-001: MCP Tool Quota Pricing Transition

## Summary

FramingUI should stop selling primarily through template ownership and move to a usage-based product model centered on MCP tool calling capacity.

The core product value is no longer "buy a theme/template and keep the files." The stronger value proposition is:

1. production-safe UI generation contracts
2. MCP-native discovery and validation workflows
3. theme-aware component intelligence
4. operating capacity for those workflows inside agent sessions

This SPEC defines the product, billing, and migration roadmap for moving from template licensing to an MCP quota business model.

## Problem

The current commercial model still reflects a static marketplace:

- template SKUs
- annual template update rights
- Creator Pass access to all templates
- legal text centered on digital downloads and template licenses

That model conflicts with how the product is actually evolving:

- README positions FramingUI as an MCP-installed system, not a template bundle
- MCP specs focus on context detection, guided discovery, validation, and direct-write workflows
- user value is created during iterative tool use, not at the point of downloading a template

There is also a product-trust problem.

- Template pricing assumes deterministic value per artifact.
- MCP and LLM workflows are probabilistic, iterative, and sometimes wasteful.
- A business model that ignores probabilistic execution hides the real cost surface from users.

If FramingUI keeps selling templates while the real value is MCP operating capacity, pricing, legal copy, onboarding, and product analytics will all stay misaligned.

## Goals

- Reposition FramingUI from template marketplace to MCP operating system for production UI work
- Introduce quota-based monetization for MCP tool usage
- Make probabilistic execution visible through usage, budgets, warnings, and tool classes
- Preserve an upgrade path for current template/license customers
- Build pricing that works for individual developers first, with optional enterprise extensions later

## Non-Goals

- Fully replacing package distribution through npm
- Charging users directly for third-party model tokens from day one
- Solving enterprise annual procurement in the first release
- Migrating every historical legal or marketing page in one pass

## Product Hypothesis

Customers are more willing to pay for:

- reliable access to guarded UI workflows
- predictable operating quotas with budget controls
- validation and export confidence
- durable individual usage visibility

than for:

- one-off ownership of theme files
- a vague promise of "all templates"

## Strategic Decision

FramingUI should sell **metered MCP capability**, not **static template inventory**.

The commercial object becomes:

- entitlement to use FramingUI MCP tools
- included monthly quota
- optional paid overage or top-ups
- optional plan extensions after individual usage economics stabilize

Templates and themes remain product assets, but they become inputs to the MCP workflow rather than the primary SKU.

## Pricing Model Principles

### 1. Do not price raw tool calls as if every call has equal value

A simple "1 tool call = 1 credit" model is easy to explain, but it is economically weak.

- A cheap metadata lookup and a large export or validation run do not have the same cost.
- LLM-driven retries and ambiguity create noisy call counts.
- Customers will perceive unfairness if a trivial read and a heavy generation call consume the same quota.

FramingUI should therefore meter **weighted usage units**, not naive call counts.

### 2. Keep the pricing surface legible

Users should still be able to reason about usage quickly.

Recommended abstraction:

- expose usage as `tool units`
- show the underlying tool count for transparency
- publish a small number of tool classes rather than per-tool micro-pricing

### 3. Separate access, included quota, and overage

Recommended packaging model:

- access plan: who can use the system and what features are enabled
- included quota: monthly tool-unit allowance
- overage: controlled additional usage via top-up or metered billing

### 4. Make uncertainty explicit in the UX

The quota model should acknowledge that agentic work is probabilistic.

Required controls:

- preflight estimate for expensive tools where possible
- visible per-tool unit cost
- workspace or account budgets
- warning thresholds at 50/80/100%
- hard cap or soft cap setting

## Proposed Usage Unit Framework

Initial working model:

| Tool class | Example FramingUI actions | Unit cost |
| --- | --- | ---: |
| Class A: discovery | `list-components`, `preview-component`, `list-layout-tokens` | 1 |
| Class B: contextualization | `get-screen-generation-context`, `preview-theme` | 2 |
| Class C: generation assist | blueprint generation, template matching, recipe resolution | 4 |
| Class D: guarded execution | `validate-screen-definition`, `validate-environment` | 6 |
| Class E: high-cost workflow | export, bulk validation, future remote generation | 10+ |

Notes:

- Exact weights should be calibrated from observed runtime, token, and support cost.
- Local-only deterministic helpers may remain free if they do not hit FramingUI-hosted infrastructure.
- If a tool triggers multiple remote operations, FramingUI should meter the aggregate workflow, not each hidden sub-step.

## Packaging Direction

### Developer

- low monthly fee
- included individual quota
- email support
- manual top-up allowed

### Enterprise

- annual commit
- custom quota terms
- SLA / support
- optional private deployment or BYO model strategy later

## Migration Strategy

### Existing template assets

Do not delete template/theme assets. Reframe them as:

- packaged workflow inputs
- licensed theme libraries where needed
- included content in higher plans, not the primary billable object

### Existing customers

Use a no-surprise migration:

- existing template licenses remain valid
- Creator Pass subscribers receive a grandfathered quota allowance for a fixed transition period
- new customers enter quota plans by default once GA starts

### Messaging shift

Old message:

- buy templates and use MCP to install them

New message:

- subscribe to FramingUI MCP capacity and use validated UI workflows backed by themes, components, and design contracts

## Roadmap

## Phase 0: Instrumentation and Truth Capture

Objective:

- learn the actual cost surface before enforcing billing

Deliverables:

- tool-level usage ledger in `@framingui/mcp-server`
- event taxonomy for tool name, tool class, latency, token proxy, auth account, project, and outcome
- account-level entitlement model for included quota, used quota, soft cap, hard cap
- internal dashboard or report for top tools, retry rates, and cost concentration

Exit criteria:

- 2-4 weeks of usage data
- 80%+ of billable workflows represented in the ledger
- first-pass weight recommendations per tool class
- `whoami` or equivalent account surface exposes a non-blocking shadow quota snapshot

## Phase 1: Shadow Billing

Objective:

- expose quota without blocking usage

Deliverables:

- `whoami` and account views show usage, remaining quota, and projected overage
- pricing page explains tool units and monthly allowances
- warning banners at 50/80/100%
- no hard enforcement yet

Exit criteria:

- users understand unit consumption
- support volume stays manageable
- shadow bills roughly match expected cost bands
- pricing, billing, and onboarding all explain that quota is visible but not yet enforced

## Phase 2: Controlled Monetization

Objective:

- start charging for quota while limiting trust risk

Deliverables:

- Developer plans launched
- top-up or metered overage enabled
- hard cap / soft cap controls
- Paddle subscription items configured for base plan plus recurring or one-time add-ons

Exit criteria:

- first paid cohort converts
- overage disputes remain low
- usage forecasting error narrows
- at least one checkout path sells quota-bearing plans rather than template-only licenses

## Phase 3: Product and Legal Rewrite

Objective:

- remove template-marketplace-first language from the system

Deliverables:

- README rewritten around MCP workflow value
- `packages/playground-web` pricing, FAQ, onboarding, and dashboard updated
- ToS, refund policy, and privacy policy updated for subscription and usage billing
- entitlement copy changed from template license to usage allowance where applicable

Exit criteria:

- no critical customer-facing page describes FramingUI primarily as a template marketplace
- legal text matches actual billing mechanics
- payment and entitlement specs no longer use template-first tier definitions as the default commercial model

## Data Model Changes

FramingUI should add or formalize the following entities:

- `billing_accounts`
- `subscriptions`
- `entitlements`
- `usage_ledger`
- `tool_metering_rules`
- `budget_policies`
- `invoice_line_item_snapshots`

Recommended ledger fields:

- account id
- user id
- workspace id
- session id
- tool name
- tool class
- unit cost
- raw tool calls
- estimated remote cost
- outcome status
- timestamp

## Package Impact

### `packages/mcp-server`

- add metering hooks for billable tools
- emit structured usage events
- expose entitlement and remaining quota in session/account tools
- enforce soft and hard caps

### `packages/playground-web`

- replace template-first pricing UI
- add account usage dashboard
- add upgrade and top-up flows
- add quota warnings in product surfaces

### `docs/legal`

- replace download-centered refund and license language where necessary
- define usage billing, overage handling, renewal, cancellation, and grandfathering

### Root docs

- rewrite README and getting-started flow around MCP capacity rather than template ownership

## Execution Order

The pivot should be executed in this order and not compressed into a single release:

1. `@framingui/mcp-server`
2. account/session visibility
3. pricing and billing surfaces
4. Paddle catalog and webhook semantics
5. legal documents and translated legal copies
6. README, package docs, landing page, and release messaging
7. legacy template-license cleanup

Rationale:

- metering must exist before pricing can be credible
- pricing must stabilize before legal text is rewritten
- checkout products must match both pricing and legal language before public launch

## Surface Checklist

The following surfaces must eventually be updated and can be checked during acceptance:

### MCP Server

- tool metering rules
- usage ledger
- quota snapshot exposure
- entitlement terminology
- prompt wording that currently assumes licensed themes only

### Product Web

- pricing page
- landing page pricing and CTA copy
- billing settings page
- account/license views
- FAQ and onboarding copy

### Payments

- Paddle products and prices
- checkout custom data schema
- webhook processing
- invoice line-item semantics

### Legal

- Terms of Service
- Refund Policy
- Privacy Policy
- localized copies in `en`, `ko`, and `ja`

### Distribution and Positioning

- root README
- package READMEs
- npm package description text where applicable
- GitHub repo positioning and release notes

## Key Risks

### Risk 1: Pure tool-call billing feels unfair

Mitigation:

- use weighted units
- publish tool classes
- show detailed usage history

### Risk 2: Users blame model inefficiency for quota burn

Mitigation:

- give expensive workflows preflight warnings
- cache deterministic results where possible
- do not bill hidden retries caused by FramingUI-side failures

### Risk 3: Legacy template customers feel downgraded

Mitigation:

- grandfather existing value
- give migration credits
- keep downloaded asset rights unchanged

### Risk 4: Legal copy lags behind implementation

Mitigation:

- do not launch paid quota until Terms, Refund, and pricing disclosures match the system

## Success Metrics

- share of new revenue from quota plans exceeds template-only revenue
- shadow-billing forecast error stays within acceptable band
- support tickets about pricing ambiguity decrease after Phase 2
- developer plan revenue remains healthier than legacy one-off template sales
- usage concentration shows repeat workflow usage, not one-time asset extraction

## Open Questions

1. Should FramingUI include a free local-only lane with zero hosted quota consumption?
2. Should validation tools always be billable, or partly subsidized because they reduce support burden?
3. Should overage be automatic metered billing, prepaid top-up packs, or both?
4. Should themes remain separately licensable for enterprise/offline use?
5. Should account quotas be shared across IDE clients and CI agents immediately, or phased in later?

## Recommended Immediate Next Moves

1. Implement Phase 0 instrumentation before changing public pricing.
2. Redefine pricing pages and legal docs only after shadow usage data exists.
3. Treat `tool units` as the external abstraction, not raw call count.
4. Keep template/theme assets as supporting value, not the billing anchor.
5. Rewrite payment architecture before changing Paddle products in production.
