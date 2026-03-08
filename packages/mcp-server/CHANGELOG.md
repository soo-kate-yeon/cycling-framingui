# Changelog

All notable changes to `@framingui/mcp-server` will be documented in this file.

## [0.6.13] - 2026-03-08

### Fixed

- Replaced unpublished workspace dependency specifiers with public semver ranges for `@framingui/core` and `@framingui/ui`.
- Restored `npx -y @framingui/mcp-server@latest` compatibility by removing `workspace:^` dependency entries from the published package metadata.

## [0.6.12] - 2026-03-08

### Added

- Added prompt aliases `screen` and `draft` so MCP-only slash menus can expose `/framingui:screen` and `/framingui:draft` directly.

### Changed

- Updated prompt catalog and tests to include direct command-style prompt entries for screen and draft workflows.

## [0.6.11] - 2026-03-08

### Added

- Added style contract detection to environment diagnostics with explicit states: `framingui-native`, `host-utility`, `mixed`, and `unknown`.
- Added required preflight metadata for `/screen` and `/section` so clients can run `validate-environment` style checks before generation when project context is known.

### Changed

- Updated screen and doctor workflows to treat style-contract preflight as a first-class generation guardrail.
- Extended slash command help and adapter outputs to surface preflight steps and blocking conditions for style mismatch scenarios.

## [0.6.8] - 2026-03-07

### Fixed

- Switched `screen-component-contract` to consume `SCREEN_COMPONENT_TYPES` through the published `@framingui/core` API instead of a monorepo-only source import, fixing MCP startup in consumer installs.

## [0.6.7] - 2026-03-07

### Fixed

- Replaced a leaked monorepo-only import in `screen-component-contract` with the public `@framingui/core` export so installed consumer projects can reconnect to the MCP server correctly.

## [0.6.6] - 2026-03-07

### Fixed

- Added a real `framingui-mcp --version` / `-v` CLI path so version checks no longer boot the stdio server.
- Updated `framingui-mcp init` to rewrite stale `framingui` entries in `.mcp.json` to the canonical `npx -y @framingui/mcp-server@latest` config.

## [0.6.5] - 2026-03-07

### Fixed

- Removed the hidden `whoami` prerequisite from the MCP workflow contract so authenticated sessions can call theme and generation tools directly.
- Unified theme entitlement checks across `whoami`, `list-themes`, and `preview-theme` and fail explicitly on authority mismatches instead of returning misleading empty or not-found responses.
- Synced screen validation and generation onto one shared component contract, improved generation output quality, and enriched generation context responses.
- Corrected the runtime server version banner and updated tool descriptions away from legacy local `.moai` wording.

### Changed

- Raised the minimum published `@framingui/core` and `@framingui/ui` dependency versions to include the latest screen contract and peer-dependency fixes.

## [0.6.4] - 2026-03-07

### Fixed

- Disabled shared auth-route caching for theme access checks so MCP sessions no longer reuse stale authorization state.
- Kept theme and component discovery aligned with the refreshed token and template catalogs used by the hosted API routes.

### Changed

- Raised the published `@framingui/core` and `@framingui/ui` dependency floor to the versions that include the prefixless token migration and latest catalog fixes.

## [0.6.3] - 2026-03-06

### Fixed

- Treated empty `list-themes` responses as invalid when the authenticated session already has licensed themes, preventing blank theme lists from being cached in MCP memory.
- Added `editorial-tech` to the master-account premium theme set so `whoami` and downstream tools stay aligned with the actual catalog.

## [0.6.2] - 2026-03-06

### Changed

- `preview-screen-template` now emits `@framingui/ui/templates` imports so generated code uses the template-only entrypoint.
- Raised the minimum supported `@framingui/core` and `@framingui/ui` versions to consume the catalog-backed template exports.

### Testing

- Replaced legacy registry-based template tool tests with API-based coverage for template listing and preview behavior.

## [0.6.1] - 2026-03-06

### Fixed

- **API 에러 처리 전면 개선**: `T | null` 반환을 `ApiResult<T>` discriminated union으로 교체하여 에러 원인(AUTH_FAILED, FORBIDDEN, NOT_FOUND, RATE_LIMITED 등)을 명확히 전달
- `preview-theme`에서 라이선스 보유 테마가 "not available"로 반환되는 버그 수정
- `fetchWithCache` 통합 패턴으로 캐시 → API → stale fallback 흐름 단일화

### Added

- `api-result.ts`: `ApiResult<T>`, `ApiErrorCode`, `formatToolError` 타입 시스템
- 서버 측 인증 캐시 (5분 TTL) — bcrypt 전체 스캔 반복 방지
- HTTP 에러 코드 분류 테스트 추가 (401, 403, 429, 500)

### Changed

- 전체 14개 tool handler에 ApiResult 언래핑 적용
- `recipe-resolver`, `template-matcher`, `css-generator` ApiResult 대응

## [0.6.0] - 2026-03-06

### Changed

- **아키텍처 전환**: MCP 서버가 `@framingui/core` / `@framingui/ui` 워크스페이스 패키지를 직접 import하는 대신, framingui.com API 라우트를 통해 데이터를 조회하도록 전환 (SPEC-MCP-007 Phase 2)
- `data-client.ts`에 7개 fetch 함수 추가: `fetchTemplateList`, `fetchTemplate`, `fetchComponentList`, `fetchComponent`, `fetchTokenList`, `fetchCSSVariables`, `fetchScreenExamples`
- `MemoryCache`에 `getStale()` 메서드 추가 — TTL 만료 후에도 stale 캐시를 반환하는 fallback 지원

### Removed

- `@framingui/core` production 의존성 제거
- `@framingui/ui` production 의존성 제거
- 로컬 하드코딩 데이터 파일 삭제: `component-registry.ts`, `component-props.ts`, `examples/screen-examples.ts`
- `css-generator.ts`에서 `@framingui/core` import 제거
- `core-resolver.ts`에서 `fs.readFileSync` 파일시스템 접근 제거

### Added

- API 실패 시 stale 캐시 fallback 동작 (네트워크 장애 대응)
- 76개 신규 단위/통합 테스트 추가 (cache, data-client, playground-web API 라우트)

## [0.5.6] - 2026-02-27

### Changed

- Phase 1: 테마 / 아이콘 라이브러리 데이터 소스를 framingui.com API로 전환
- `data-client.ts` 도입: `fetchTheme`, `fetchThemeList`, `fetchIconLibraries`, `fetchIconLibrary`
