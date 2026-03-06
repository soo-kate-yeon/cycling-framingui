/**
 * @framingui/ui - Empty Template
 * SPEC-UI-002: Feedback Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-033] 빈 상태 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 빈 상태 템플릿이 데이터 부재 피드백 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 다음 액션 파악 불가
 */

import { Button } from '../../components/button';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Empty Template Component
 */
export function EmptyTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'No Items Found';
  const message = texts.message || 'Get started by creating your first item';
  const ctaLabel = texts.cta_label || 'Create New';
  const showCta = options.show_cta ?? true;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--tekton-spacing-4)] ${className}`}
    >
      <div className="max-w-md text-center space-y-[var(--tekton-spacing-6)]">
        {/* Empty Icon/Illustration */}
        {slots.illustration || (
          <div className="flex justify-center">
            <div className="rounded-full bg-[var(--tekton-bg-muted)] p-[var(--tekton-spacing-8)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-[var(--tekton-text-muted-foreground)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Empty Message */}
        <div className="space-y-[var(--tekton-spacing-2)]">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-[var(--tekton-text-muted-foreground)]">{message}</p>
        </div>

        {/* CTA Button */}
        {showCta && (
          <div>
            <Button size="lg">{ctaLabel}</Button>
          </div>
        )}

        {/* Help Text */}
        {slots.helpText && (
          <div className="text-sm text-[var(--tekton-text-muted-foreground)]">{slots.helpText}</div>
        )}
      </div>
      {children}
    </div>
  );
}

/**
 * Empty Template Definition
 */
export const EmptyTemplate = createTemplateFromCatalog('feedback.empty', EmptyTemplateComponent);
