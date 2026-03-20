---
id: SPEC-BUSINESS-001
version: "0.1.0"
status: in_progress
created: "2026-03-17"
updated: "2026-03-20"
author: "Codex"
---

# Plan

## Stage 1: Product and Analytics Foundation

1. Define billable MCP tool inventory and assign each tool to a provisional metering class.
2. Add a usage ledger to `@framingui/mcp-server` with no customer-facing enforcement.
3. Capture retry behavior, latency, auth account, and workflow outcome for every billable tool path.
4. Review 2-4 weeks of internal or beta usage before fixing public weights.

## Stage 2: Shadow Quota UX

1. Add entitlement and usage summaries to account-facing surfaces.
2. Add quota explanations, warning thresholds, and budget copy to pricing and onboarding.
3. Keep usage visible but non-blocking until forecast quality is acceptable.
4. Update MCP prompts, generated guides, and onboarding templates so `whoami` is positioned as quota and entitlement inspection.
5. Rename user-facing onboarding flows away from `trial` terminology where possible, while keeping compatibility shims for existing routes.

## Stage 3: Monetization Rollout

1. Launch Developer plans with included tool units.
2. Support paid overage via top-up or metered usage.
3. Add hard cap and soft cap controls.
4. Grandfather existing template customers into a transition allowance.

## Stage 4: System Rewrite

1. Rewrite template-first product copy across README, pricing, FAQ, and onboarding.
2. Update legal documents to reflect usage billing and subscription mechanics.
3. Replace license-centric entitlement terminology with quota-centric terminology where applicable.

## Repository Rollout Sequence

1. `packages/mcp-server`
2. `packages/playground-web/app/settings/billing`
3. `packages/playground-web/components/pricing`
4. `packages/playground-web/data/i18n/pricing`
5. `packages/playground-web/app/api/webhooks/paddle`
6. `packages/playground-web/data/i18n/landing`
7. `docs/legal/*`
8. `README.md` and package READMEs

## Acceptance Checklist Strategy

Each stage must produce explicit evidence that can be checked later:

1. code path exists
2. docs/spec text updated
3. validation command or spot-check recorded
4. user-facing terminology aligned with billing phase

## Sequencing Rules

1. Do not publicly enforce quota before usage instrumentation exists.
2. Do not finalize tool weights before observing real retry and support patterns.
3. Do not launch paid overage before legal and billing text is updated.
4. Do not remove existing template entitlements without a grandfathering path.

## Progress Notes

1. Completed: Stage 1 metering foundation and `whoami` shadow quota snapshot.
2. Completed: pricing, landing, README, and legal copy pivoted to MCP plus quota framing.
3. Completed: transition-access route is the default onboarding entrypoint, with legacy `trial` compatibility wrappers preserved.
4. Completed: `whoami` now exposes transition-access aliases alongside legacy `trial_*` fields for compatibility.
5. Completed: transition-access analytics events now use new identifiers, while legacy helper aliases remain available for gradual migration.
6. Completed: hard-cap and soft-cap behavior is now covered by handler-level MCP tests.
7. Completed: pricing documentation now defaults to quota plans and no longer leads with template-era SKUs.
8. Completed: grandfathered legacy all-access customers can see a transition allowance in billing surfaces.
9. Completed: billing surfaces now expose current-period usage totals and tool-class breakdowns.
10. Scope change: Team pooled quota and team-admin controls were removed from the active rollout.
11. Completed: durable billing-account/subscription records and signed refund adjustments now exist in the webhook layer.
12. Remaining: enforced quota debit flow.
