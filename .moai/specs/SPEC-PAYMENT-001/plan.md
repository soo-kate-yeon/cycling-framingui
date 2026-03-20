---
id: SPEC-PAYMENT-001
type: plan
version: "2.0.0"
created: "2026-02-03"
updated: "2026-03-20"
---

# SPEC-PAYMENT-001: Quota Billing Plan

## Phase 1: Checkout Contract

- [x] Distinguish `legacy_template`, `plan`, and `top_up` in Paddle custom data.
- [x] Default new pricing UI to quota plans.
- [x] Keep legacy template purchases only as compatibility paths.

## Phase 2: Webhook Normalization

- [x] Parse quota purchase semantics from Paddle webhook payloads.
- [x] Resolve price targets into normalized `plan` or `top_up` meaning.
- [x] Return transition-mode settlement previews with normalized `granted_units`.
- [x] Persist normalized quota settlements into durable `quota_allocations` storage.
- [x] Upsert current `quota_entitlements` state from plan purchases.
- [x] Lift entitlement state through activation, cancel, and past-due subscription events.
- [x] Lift entitlement state through renewal timing and current-period boundaries.

## Phase 3: Entitlement Persistence

- [x] Create durable records for billing account and subscription.
- [x] Create durable records for entitlement and quota allocation.
- [x] Allocate included units on plan purchase and renewal.
- [x] Allocate additive units on top-up purchase.
- [x] Preserve legacy `user_licenses` as a compatibility layer only.

## Phase 4: Lifecycle Enforcement

- [x] Reflect cancel / renewal / past-due state in entitlement records.
- [x] Surface current-period allowance and renewal state in account APIs.
- [x] Enforce soft-cap / hard-cap behavior only after legal and pricing text are aligned.
- [x] Record signed quota adjustments for refunds and credits.

## Phase 5: Migration Completion

- [x] Define grandfathering or transition allowance for legacy template customers.
- [x] Remove template-era product copy from remaining internal payment surfaces.
- [x] Audit webhook and checkout code so quota semantics are the default code path.

## Current Evidence

- `packages/playground-web/lib/paddle/contracts.ts` encodes quota-aware checkout data.
- `packages/playground-web/lib/paddle/config.ts` resolves quota plan and top-up prices.
- `packages/playground-web/app/api/webhooks/paddle/route.ts` emits normalized `granted_units` for plan and top-up purchases in transition mode.
- `packages/playground-web/__tests__/api/paddle-webhook.test.ts` verifies quota-plan and top-up webhook normalization.

## Exit Criteria

1. A paid quota purchase results in a durable entitlement balance change.
2. A top-up purchase results in an additive durable quota allocation.
3. Renewal and cancellation mutate quota-bearing subscription state instead of only legacy licenses.
4. Refund and credit adjustments can reverse quota through signed adjustment allocations.
5. Pricing UI, checkout payloads, webhook effects, and legal text all describe the same quota model.
