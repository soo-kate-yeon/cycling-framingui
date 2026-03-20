---
id: SPEC-PAYMENT-001
type: acceptance
version: "2.0.0"
created: "2026-02-03"
updated: "2026-03-18"
---

# SPEC-PAYMENT-001: Acceptance

## Checkout Contract

- [x] New checkout payloads can express `purchase_kind: 'plan'`.
- [x] New checkout payloads can express `purchase_kind: 'top_up'`.
- [x] Legacy template checkout payloads remain parseable during migration.

## Webhook Normalization

- [x] `transaction.completed` recognizes quota-plan purchases without creating legacy licenses.
- [x] `transaction.completed` recognizes top-up purchases without creating legacy licenses.
- [x] Quota-plan responses expose normalized `plan_id` and `granted_units`.
- [x] Top-up responses expose normalized `granted_units`.
- [x] Quota purchases write durable `quota_allocations` records instead of returning transition-only previews.
- [x] Plan purchases also upsert current `quota_entitlements` state.
- [x] `subscription.activated`, `subscription.canceled`, and `subscription.past_due` update entitlement lifecycle state.
- [x] `subscription.updated` renewal handling updates current-period timing and allowance rollover state.

## Lifecycle Handling

- [x] Plan renewal extends quota-bearing entitlement periods.
- [x] Plan cancellation prevents future quota renewal while preserving current-period access.
- [x] Refunds or credits reverse unused quota in a documented way.

## Migration Safety

- [x] Legacy template purchases still map to `user_licenses`.
- [x] Creator/all-access legacy purchases still resolve to explicit all-access theme IDs.
- [x] Missing `theme_id` for scoped legacy purchases fails closed.
- [x] Grandfathered legacy all-access customers have a visible transition allowance path.
- [x] Account quota APIs expose grandfathered transition allowance state for downstream billing surfaces.
- [x] Durable usage-event ingestion exists for MCP-originated billing visibility.
- [x] Remaining payment docs and internal surfaces no longer describe template-era SKUs as the default product catalog.

## Validation Log

- [x] `cd packages/playground-web && pnpm vitest run __tests__/api/paddle-webhook.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/paddle-config.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/paddle-contracts.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-allocations.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-entitlements.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-summary.test.ts __tests__/api/user-quota.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/docs/pricing-doc.test.ts`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/legacy-transition-allowance.test.ts __tests__/integration/settings-billing-page.test.tsx`
- [x] `cd packages/playground-web && pnpm vitest run __tests__/lib/db/quota-usage-events.test.ts __tests__/api/mcp-usage-events.test.ts __tests__/api/user-usage.test.ts`
- [x] `pnpm --filter @framingui/playground-web type-check`
