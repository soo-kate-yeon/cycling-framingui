# SPEC-MCP-008 Acceptance Criteria

## Overview

| Field | Value |
|-------|-------|
| **SPEC ID** | SPEC-MCP-008 |
| **Title** | MCP Workflow Reliability and Contract Unification |
| **Version** | 1.0 |
| **Last Updated** | 2026-03-06 |

---

## Scenario 1: Protected Tools Work Without Hidden `whoami`

**Given** a valid authenticated MCP session  
**When** the agent calls `preview-theme` or `list-themes` before `whoami`  
**Then** the request succeeds without requiring a prior `whoami` call  
**And** `whoami` remains available as an inspection tool

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1.1 | Call `list-themes` first with valid auth | Success | ✅ Passed |
| 1.2 | Call `preview-theme("pebble")` first with valid auth | Success | ✅ Passed |
| 1.3 | Call protected tool with no auth | Structured `AUTH_REQUIRED` error with next action | ✅ Passed |
| 1.4 | Call `whoami` after protected tool | Returns current session capability snapshot | ✅ Passed |

---

## Scenario 2: Theme Authority Consistency

**Given** a session with licensed theme access  
**When** `whoami`, `list-themes`, and `preview-theme` are called  
**Then** all three tools should agree on accessible theme ids

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 2.1 | `whoami` lists `pebble` as licensed | `list-themes` includes `pebble` | ✅ Passed |
| 2.2 | `list-themes` returns `pebble` | `preview-theme("pebble")` succeeds | ✅ Passed |
| 2.3 | Entitlement mismatch is injected in test fixture | Structured inconsistency response, not empty success | ✅ Passed |
| 2.4 | Upstream API fails with stale fallback available | Response declares degraded mode and fallback source | Not Implemented |

---

## Scenario 3: Validation and Generation Parity

**Given** a screen definition using supported FramingUI components  
**When** `validate-screen-definition` accepts the definition  
**Then** `generate_screen` recognizes the same components under the same contract version

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 3.1 | Definition uses `Heading` and `Text` | Validation and generation both accept | ✅ Passed |
| 3.2 | Definition uses supported `Badge` and `Separator` | Validation and generation both accept | ✅ Passed |
| 3.3 | Card composition uses agreed representation rule | Validation and generation both accept | ✅ Passed |
| 3.4 | Unsupported component is provided | Validation or generation fails explicitly with consistent error code | ✅ Passed |

---

## Scenario 4: Generated Code Quality

**Given** a valid screen definition  
**When** `generate_screen` produces React output  
**Then** the output should be syntactically valid, preserve children, and avoid invented styling classes

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 4.1 | Text child is provided to a component | Rendered output contains the text | ✅ Passed |
| 4.2 | Nested child components are provided | Output nests them correctly | ✅ Passed |
| 4.3 | Tailwind output path is used | No unknown synthetic classes such as token-derived fake utilities | ✅ Passed |
| 4.4 | Unsupported codegen path is hit | Structured `UNSUPPORTED_FOR_CODEGEN` error | Not Implemented |
| 4.5 | Generated TSX fixture is compiled | Compile succeeds | Not Implemented |

---

## Scenario 5: Theme Recipe Application

**Given** a theme with recipe definitions such as `recipes.card.default`  
**When** context or code generation uses that theme  
**Then** recipe information is surfaced and applied without manual JSON inspection

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 5.1 | Context requested with `themeId: "pebble"` | Response includes recipe coverage for relevant components | ✅ Passed |
| 5.2 | Code generation uses themed card component | Generated output applies supported recipe strategy | ✅ Passed |
| 5.3 | Theme has no recipe for a component | Warning or unsupported strategy is explicit | Not Implemented |

---

## Scenario 6: Context Quality and Confidence Handling

**Given** a natural language screen request  
**When** `get-screen-generation-context` is called  
**Then** template and component suggestions should be confidence-aware and materially useful

### Test Cases

| # | Test Case | Expected Result | Status |
|---|-----------|-----------------|--------|
| 6.1 | Blog page description with low landing similarity | No forced low-confidence landing primary match | ✅ Passed |
| 6.2 | Dashboard description | Context includes dashboard-relevant components beyond a tiny fallback | ✅ Passed |
| 6.3 | Context response includes a template match | Confidence explanation is returned | Not Implemented |
| 6.4 | No strong template match exists | Response clearly indicates no primary template match | ✅ Passed |

---

## Integration Tests

### Test 1: Auth to Theme Flow

```gherkin
Given a valid authenticated session
When the agent calls list-themes and preview-theme("pebble") without calling whoami
Then both calls succeed
And whoami later returns a snapshot that includes pebble
```

### Test 2: Screen Workflow Parity

```gherkin
Given a screen definition using Heading, Text, Badge, and Card composition
When the agent calls validate-screen-definition and then generate_screen
Then the same contract version is used
And generation succeeds without drift-related component errors
```

### Test 3: Recipe-Aware Codegen

```gherkin
Given a theme with card recipes
When generate_screen emits supported React output for a card-heavy screen
Then recipe-backed styling is applied automatically
And the user does not need to inspect raw theme JSON
```

---

## Quality Gates

### Gate 1: Session Contract

- [x] No protected tool requires a prior `whoami` call
- [x] Auth failures return structured remediation

### Gate 2: Theme Consistency

- [x] Licensed theme ids are consistent across `whoami`, `list-themes`, and `preview-theme`
- [x] Silent empty successes are eliminated for entitlement mismatches

### Gate 3: Screen Contract Integrity

- [x] Validation and generation use one contract version
- [x] Component acceptance is consistent across tools

### Gate 4: Codegen Trustworthiness

- [x] Generated output preserves text children
- [x] Generated output contains no invented Tailwind classes
- [ ] Unsupported codegen paths fail explicitly

### Gate 5: Context Quality

- [x] Low-confidence template matches degrade safely
- [x] Context component coverage is substantially improved over current fallback behavior

---

**Status**: ✅ Completed with noted follow-up gaps
