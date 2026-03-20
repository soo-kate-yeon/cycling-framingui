# FramingUI Pricing Model

> Last Updated: 2026-03-20

## Product Model

FramingUI now sells MCP workflow capacity, not vague template ownership.

- Billing is based on `weighted tool units`.
- Each MCP tool is assigned a provisional unit weight based on cost and workflow impact.
- Accounts can inspect quota before enforcement through shadow billing surfaces such as `whoami` and the billing settings page.
- Legacy template and theme purchases remain valid during the migration window, but they are no longer the default product catalog.

## Plans

| Plan           | Price                | Included Quota         | Best For                                             | Notes                                                        |
| -------------- | -------------------- | ---------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Free Quota** | $0                   | Starter monthly quota  | Evaluation, first project setup, light discovery     | Shadow usage visibility is available before hard enforcement |
| **Developer**  | Active catalog price | Monthly included units | Individual builders shipping recurring MCP workflows | Upgrade path from transition access                          |

## How Quota Works

Quota is measured in weighted tool units rather than raw call counts.

| Tool Class         | Example Tools                                         | Typical Weight |
| ------------------ | ----------------------------------------------------- | -------------- |
| Discovery          | `list-components`, `list-themes`, `preview-component` | 1              |
| Context            | `preview-theme`, `get-screen-generation-context`      | 2              |
| Generation         | `generate-blueprint`, `generate_screen`               | 4              |
| Guarded Validation | `validate-screen-definition`, `validate-environment`  | 6              |
| Execution          | `export-screen` and similar heavy delivery paths      | 10             |

This weighting exists because LLM and MCP workflows are probabilistic. A retry-heavy guarded validation path should not be priced the same as a lightweight catalog lookup.

## Shadow Billing

Shadow billing records usage as if quota were enforced, without charging or blocking by default.

FramingUI uses shadow billing to answer three questions before turning on enforcement:

1. How many units does a real workflow consume for a screen, feature, or app?
2. How much free quota should be included before the product stops feeling usable?
3. Which tools create retries or cost spikes that should be reweighted before rollout?

When enforcement is enabled, FramingUI can operate in two modes:

- `soft cap`: calls continue, but the response warns that usage exceeded the included quota
- `hard cap`: billable calls that would exceed quota are blocked until the account upgrades or adds more quota

## Top-Ups And Overage

- Paid plans can include one-time `top_up` purchases for additional units.
- Plan subscriptions store the current billing period and included monthly allowance.
- Top-up units are tracked separately so the system can explain how much of an account's quota came from plan allowance versus add-on capacity.
- Overage billing should only be enabled after the same accounting is visible to the user in billing and MCP surfaces.

## Legacy Customer Migration

Legacy customers keep the access rights they already purchased.

- Existing template and theme licenses remain valid.
- Legacy all-access customers keep their historical access while migration rules are applied.
- Transition-access onboarding remains available during the pivot so existing users are not forced into an abrupt cutover.
- New pricing conversations should start from quota plans, not from legacy asset bundles.

## Update And Support Policy

Included support and product maintenance depend on the active plan or entitlement state.

- Hosted catalog access, MCP verification, and quota visibility are service features.
- Support covers onboarding, billing questions, account recovery, and MCP workflow issues.
- FramingUI does not guarantee that probabilistic LLM workflows will always produce the same result from the same prompt.
- Enforcement, warning thresholds, and unit weights may evolve as shadow billing data improves accuracy.

## Legal Alignment

Pricing, billing, and legal text must describe the same service model.

- Terms of Service define FramingUI primarily as an MCP-backed software service.
- Refund Policy distinguishes quota plans from legacy downloadable assets.
- Privacy Policy covers usage, billing, and entitlement metadata needed to operate the quota model.

## Operational Checklist

- [x] Pricing surfaces default to quota plans.
- [x] Shadow quota is visible in account-facing surfaces.
- [x] Paddle checkout supports `plan`, `top_up`, and `legacy_template` purchase kinds.
- [x] Webhook handling writes durable quota allocations and entitlement periods.
- [x] Hard-cap and soft-cap behaviors are covered by executable tests.
- [ ] Refund and credit reversal rules for unused quota are fully automated.
