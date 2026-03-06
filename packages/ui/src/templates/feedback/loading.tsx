/**
 * @framingui/ui - Loading Template
 * SPEC-UI-002: Feedback Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-031] 로딩 상태 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 로딩 템플릿이 비동기 작업 피드백 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 로딩 상태 인지 불가
 */

import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Loading Template Component
 */
export function LoadingTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const message = texts.message || 'Loading...';
  const showMessage = options.show_message ?? true;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--tekton-spacing-4)] ${className}`}
    >
      <div className="flex flex-col items-center gap-[var(--tekton-spacing-4)]">
        {/* Loading Spinner */}
        {slots.spinner || (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tekton-border-primary)]" />
        )}

        {/* Loading Message */}
        {showMessage && (
          <p className="text-sm text-[var(--tekton-text-muted-foreground)]">{message}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Loading Template Definition
 */
export const LoadingTemplate = createTemplateFromCatalog(
  'feedback.loading',
  LoadingTemplateComponent
);
