/**
 * @framingui/ui - Error Template
 * SPEC-UI-002: Feedback Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-032] 에러 상태 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 에러 템플릿이 오류 상황 피드백 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 에러 원인 파악 불가
 */

import { Button } from '../../components/button';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Error Template Component
 */
export function ErrorTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Something Went Wrong';
  const message = texts.message || 'An error occurred. Please try again.';
  const retryLabel = texts.retry_label || 'Try Again';
  const showRetry = options.show_retry ?? true;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--tekton-spacing-4)] ${className}`}
    >
      <div className="max-w-md text-center space-y-[var(--tekton-spacing-6)]">
        {/* Error Icon */}
        {slots.icon || (
          <div className="flex justify-center">
            <div className="rounded-full bg-[var(--tekton-bg-destructive)] bg-opacity-10 p-[var(--tekton-spacing-4)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[var(--tekton-text-destructive)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Error Message */}
        <div className="space-y-[var(--tekton-spacing-2)]">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-[var(--tekton-text-muted-foreground)]">{message}</p>
        </div>

        {/* Error Details */}
        {slots.errorDetails && (
          <div className="text-left bg-[var(--tekton-bg-muted)] p-[var(--tekton-spacing-4)] rounded-[var(--tekton-radius-md)] text-sm">
            {slots.errorDetails}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-[var(--tekton-spacing-3)]">
          {showRetry && <Button className="w-full">{retryLabel}</Button>}
          {slots.additionalActions && slots.additionalActions}
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Error Template Definition
 */
export const ErrorTemplate = createTemplateFromCatalog('feedback.error', ErrorTemplateComponent);
