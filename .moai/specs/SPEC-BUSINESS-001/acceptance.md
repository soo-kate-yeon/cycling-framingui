# Acceptance

## Stage 1

- A canonical list of billable MCP tools exists.
- Each billable tool is assigned a provisional metering class.
- Usage events are captured with account, tool, units, and outcome fields.
- Internal reporting can identify top quota consumers and retry-heavy workflows.
- A shadow quota snapshot can be inspected from an account-facing MCP surface.

## Stage 2

- Users can see included quota, used quota, and remaining quota.
- Users receive threshold warnings before running out of quota.
- Shadow usage is visible without blocking tool access.
- Pricing and billing surfaces explicitly state that shadow billing is visible but not enforced.
- MCP prompts, guides, or onboarding text describe `whoami` as a quota/entitlement inspection surface instead of a template-license unlock step.
- Transition-access onboarding uses quota-oriented naming by default, while legacy `trial` routes remain compatible during migration.

### Stage 2 Evidence

- [x] `whoami` returns shadow quota snapshots from `@framingui/mcp-server`.
- [x] `whoami` exposes `has_transition_access`, `access_expires_at`, and `access_days_left` while preserving legacy `trial_*` aliases.
- [x] New client onboarding calls `POST /api/access/transition` by default.
- [x] Legacy `POST /api/licenses/trial` remains as a compatibility wrapper.
- [x] User-facing pricing, landing, billing, and onboarding copy describe quota visibility instead of template purchase steps.
- [x] Transition-access analytics use new event identifiers by default, while legacy helper aliases remain available.

## Stage 3

- At least one paid plan includes monthly tool-unit allowance.
- Overage or top-up purchase flow exists.
- Soft cap and hard cap behavior is documented and testable.
- Existing template customers have a documented migration policy.
- Paddle checkout and webhook payloads use quota-plan semantics rather than template-tier semantics by default.
- New client code uses quota/transition access endpoints by default even if legacy storage or compatibility wrappers still use older names internally.

### Stage 3 Evidence

- [x] Pricing cards default to `Free Quota` and `Developer`.
- [x] Paddle checkout custom data distinguishes `plan`, `top_up`, and `legacy_template` purchase kinds.
- [x] Paddle webhook handling accepts quota-plan semantics by default.
- [x] Quota plan and top-up webhook handling now writes durable `quota_allocations` records.
- [x] Plan purchases now upsert current `quota_entitlements` state with included units.
- [x] Subscription `activated`, `canceled`, and `past_due` events now update entitlement lifecycle state.
- [x] Subscription renewal and current-period timing are now persisted into entitlement state.
- [x] Shadow quota snapshots now prefer active paid entitlement limits and current billing periods.
- [x] Hard cap and soft cap enforcement are executable and validated beyond shadow mode.
- [x] Grandfathered legacy all-access customers can see a transition allowance on billing surfaces.
- [x] `GET /api/user/quota` exposes grandfathered transition allowance state for account surfaces.
- [x] `GET /api/user/usage` exposes current-period MCP usage totals and tool-class breakdown for billing surfaces.

## Stage 4

- Customer-facing pricing no longer describes FramingUI primarily as a template marketplace.
- Landing and README copy describe FramingUI primarily as an MCP workflow product with quota visibility.
- README and onboarding describe MCP capacity and validated workflows as the primary value.
- Terms, refund policy, and privacy copy align with actual billing behavior.
- Translated legal copies are updated together with the source legal documents.
- Generated `AGENTS.md` / `CLAUDE.md` guidance and CLI onboarding no longer frame authentication primarily as template-license verification.

## Final Acceptance

- Pricing, entitlement logic, product copy, and legal text all describe the same business model.
- FramingUI can explain quota usage in a way that users can predict before spending.
- The system distinguishes low-cost discovery work from high-cost execution work.
- The rollout order can be audited from specs and completed work items without relying on tribal knowledge.

## Validation Log

- [x] `pnpm --filter @framingui/mcp-server typecheck`
- [x] `cd packages/mcp-server && pnpm vitest run __tests__/tools/auth-bootstrap.test.ts`
- [x] `pnpm --filter @framingui/playground-web type-check`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/integration/free-trial-modal.test.tsx`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-allocations.test.ts __tests__/api/paddle-webhook.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-summary.test.ts __tests__/api/user-quota.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-summary.test.ts __tests__/api/user-quota.test.ts __tests__/integration/settings-billing-page.test.tsx`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-usage-events.test.ts __tests__/api/mcp-usage-events.test.ts __tests__/api/user-usage.test.ts __tests__/integration/settings-billing-page.test.tsx`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/api/mcp-verify-canonicalization.test.ts`
- [x] `cd packages/mcp-server && pnpm vitest run __tests__/tools/usage-ledger.test.ts`
- [x] `cd packages/mcp-server && pnpm vitest run __tests__/index.quota-enforcement.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/docs/pricing-doc.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/legacy-transition-allowance.test.ts __tests__/integration/settings-billing-page.test.tsx`
