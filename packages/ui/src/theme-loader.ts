/**
 * @framingui/ui server-safe theme loader entry
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 서버 환경에서 client-only UI 엔트리 대신 theme loader만 가져오도록 분리
 * IMPACT: 서버 라우트가 useEffect/useState 의존성 때문에 빌드 실패하지 않음
 */
export {
  themeToCSS,
  injectThemeCSS,
  getCurrentThemeId,
  setThemeId,
  oklchToCSS,
  resolveSemanticToken,
} from './lib/theme-loader';

export type { ThemeDefinition, OKLCHColor } from './lib/theme-loader';
