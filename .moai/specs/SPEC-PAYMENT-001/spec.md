---
id: SPEC-PAYMENT-001
version: "2.0.0"
status: draft
created: "2026-02-03"
updated: "2026-03-17"
author: "Codex + soo-kate-yeon"
priority: HIGH
dependencies:
  - SPEC-AUTH-001
  - SPEC-BUSINESS-001
---

## HISTORY

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-02-03 | 1.0.0 | 템플릿 판매 기반 Paddle 결제 초안 작성 |
| 2026-03-17 | 2.0.0 | MCP quota / usage billing 전환에 맞게 전면 재정의 |

---

# SPEC-PAYMENT-001: Paddle Quota Billing Integration

## Summary

Paddle 결제 시스템은 더 이상 `Single Template / Double Package / Creator Pass` 중심 카탈로그를 기본값으로 삼지 않는다.

결제의 기본 단위는 다음으로 재정의된다.

- plan access
- included monthly tool units
- optional top-up or overage
- subscription lifecycle and billing visibility

기존 템플릿 라이선스 상품은 이행 기간 동안 유지할 수 있지만, 기본 상업 모델은 quota-bearing plan 이어야 한다.

## Problem

기존 결제 명세는 템플릿 개별 판매를 전제로 한다.

- checkout custom data가 `theme_id`, `tier=single|double|creator`에 묶여 있음
- webhook이 `user_license` 생성과 갱신 중심으로 설계됨
- Paddle product/price가 템플릿 패키지 SKU로 구성됨

이 구조는 MCP quota 모델과 맞지 않는다.

- 사용량 기반 과금은 entitlement, quota, top-up, overage 이벤트를 처리해야 한다
- checkout 결과는 특정 템플릿 소유권이 아니라 계정 quota allowance 로 귀결되어야 한다
- subscription 갱신 시 연장되는 것은 업데이트 기간이 아니라 quota-bearing entitlement 이다

## Goals

- Paddle 상품 구조를 quota plan 중심으로 재설계
- checkout 흐름이 included quota와 add-on quota를 지원
- webhook이 entitlement와 usage billing 상태를 갱신
- 기존 template-license 고객을 위한 마이그레이션 경로 유지

## Non-Goals

- 모든 과금 계산을 Paddle 내부만으로 해결
- 첫 릴리스에서 완전한 usage-based invoice reconciliation 구현
- legacy template 상품을 즉시 삭제

## Ubiquitous Requirements

**[TAG-PAYMENT-001-U001]** 시스템은 Paddle을 결제 처리 제공자로 사용해야 한다.

**[TAG-PAYMENT-001-U002]** 시스템은 기본 상업 모델로 quota-bearing subscription plans 를 지원해야 한다.

**[TAG-PAYMENT-001-U003]** 시스템은 optional quota top-up 또는 overage billing path 를 지원해야 한다.

**[TAG-PAYMENT-001-U004]** 모든 webhook 요청은 서명 검증을 통해 보안 처리되어야 한다.

## Event-Driven Requirements

**[TAG-PAYMENT-001-E001]** WHEN 사용자가 quota plan 구매를 시작하면 THEN Paddle checkout overlay 또는 hosted checkout 이 열려야 한다.

**[TAG-PAYMENT-001-E002]** WHEN plan 결제가 완료되면 THEN account entitlement 에 included monthly units 와 billing state 가 부여되어야 한다.

**[TAG-PAYMENT-001-E003]** WHEN top-up 결제가 완료되면 THEN 해당 account 에 추가 tool units 가 적립되어야 한다.

**[TAG-PAYMENT-001-E004]** WHEN subscription 이 갱신되면 THEN quota-bearing entitlement 기간이 연장되어야 한다.

**[TAG-PAYMENT-001-E005]** WHEN subscription 이 취소되면 THEN 현재 기간 종료 후 entitlement 가 갱신되지 않아야 한다.

## State-Driven Requirements

**[TAG-PAYMENT-001-S001]** IF 계정이 free plan 이면 THEN 기본 included units 만 보여야 하고 유료 quota-bearing entitlement 는 없어야 한다.

**[TAG-PAYMENT-001-S002]** IF 계정이 paid plan 이면 THEN included monthly units, current period, renewal 상태가 조회 가능해야 한다.

**[TAG-PAYMENT-001-S003]** IF 계정이 grandfathered template customer 이면 THEN transition allowance 또는 별도 migration entitlement 가 조회 가능해야 한다.

## Unwanted Behaviors

**[TAG-PAYMENT-001-UW001]** 시스템은 새 quota plan 구매를 template ownership purchase 로 기록하면 안 된다.

**[TAG-PAYMENT-001-UW002]** 시스템은 실제 billing semantics 와 다른 plan copy 를 checkout 에 노출하면 안 된다.

**[TAG-PAYMENT-001-UW003]** 시스템은 FramingUI 내부 재시도나 플랫폼 오류로 인한 숨은 사용량을 자동 과금하면 안 된다.

## Proposed Plan Catalog

### Base Plans

| Plan | Billing | Includes | Notes |
|------|---------|----------|------|
| Free | 무료 | 제한된 월간 tool units | shadow 또는 저용량 사용 |
| Developer | 월간/연간 | 개인용 included units | top-up 가능 |
| Enterprise | 맞춤 계약 | custom included units | SLA / support 별도 협의 |
| Enterprise | 계약형 | custom pooled units | SLA / procurement |

### Add-ons

| Add-on | Billing | Includes |
|--------|---------|----------|
| Tool Unit Top-up | 일회성 | 추가 tool units |
| Overage Billing | 사용량 기반 | included units 초과분 |

## Checkout Custom Data

```typescript
interface CheckoutCustomData {
  account_id: string;
  user_id: string;
  purchase_kind: 'plan' | 'top_up';
  plan_id?: 'developer' | 'enterprise';
  top_up_units?: number;
  billing_model: 'quota';
}
```

`theme_id` 는 더 이상 기본 checkout contract 의 필수값이 아니다.

## Webhook Events

### Required

- `transaction.completed`
- `subscription.created`
- `subscription.renewed`
- `subscription.updated`
- `subscription.canceled`
- `subscription.past_due`

### Internal Effects

- create or update subscription record
- create or update entitlement record
- allocate included monthly units
- allocate top-up units
- mark renewal/cancel state

## Data Model Impact

결제 연동은 최소한 다음 엔티티와 연결되어야 한다.

- `billing_accounts`
- `subscriptions`
- `entitlements`
- `quota_allocations`
- `usage_ledger`
- `invoices` or invoice snapshots

기존 `user_license` 중심 구조는 이행 기간 동안만 compatibility layer 로 남는다.

## Paddle Product Setup

### Products

| Product ID | 이름 | 설명 |
|------------|------|------|
| `developer_plan` | Developer Plan | 개인용 MCP quota subscription |
| `enterprise_plan` | Enterprise Plan | 엔터프라이즈용 맞춤 quota subscription |
| `tool_units_top_up` | Tool Units Top-up | 추가 quota pack |

### Prices

가격 수치는 shadow billing 결과 이후 확정한다.

| Price ID | Product | 가격 | 주기 |
|----------|---------|------|------|
| `pri_dev_monthly` | Developer Plan | TBD | 월간 |
| `pri_dev_yearly` | Developer Plan | TBD | 연간 |
| `pri_enterprise_contract` | Enterprise Plan | TBD | 맞춤 |
| `pri_tool_topup_*` | Tool Units Top-up | TBD | 일회성 |

## Migration Rules

- 기존 template license 는 계속 유효
- 기존 Creator Pass 고객은 transition allowance 를 받음
- 새 checkout 기본값은 quota plan
- legacy template 상품은 명시적 legacy path 로만 유지 가능

## Execution Sequence

1. billing semantics 를 `SPEC-BUSINESS-001` 과 정렬
2. checkout custom data 재설계
3. webhook entitlement 처리 재설계
4. Paddle product catalog 갱신
5. pricing page / legal copy 와 동기화
6. legacy template purchase path 를 optional 로 격하

## Validation

- checkout request payload 가 quota semantics 를 사용함
- webhook handler 가 entitlement/quota allocation 을 갱신함
- plan renewal / cancel 이 entitlement state 와 일치함
- top-up purchase 가 추가 units 로 반영됨
- legacy template flows 가 존재하더라도 기본 path 는 quota plan 임

## Acceptance Link

This SPEC is not complete until `SPEC-BUSINESS-001` Stage 3 acceptance items can be checked from real code paths and customer-facing text.
