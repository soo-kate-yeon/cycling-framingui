/**
 * @framingui/ui - Landing Template
 * SPEC-UI-002: Core Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-028] 랜딩 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 랜딩 템플릿이 메인 대시보드 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 메인 화면 접근 불가
 */

import { Button } from '../../components/button';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Landing Template Component
 */
export function LandingTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Welcome Back';
  const subtitle = texts.subtitle || 'Start a new conversation or continue where you left off';
  const ctaLabel = texts.cta_label || 'New Conversation';

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Sidebar */}
      {slots.sidebar && (
        <aside className="w-64 border-r border-[var(--tekton-border-default)] bg-[var(--tekton-bg-muted)]">
          {slots.sidebar}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        {slots.header && (
          <header className="border-b border-[var(--tekton-border-default)] p-[var(--tekton-spacing-4)]">
            {slots.header}
          </header>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-[var(--tekton-spacing-8)]">
          <div className="max-w-2xl w-full text-center space-y-[var(--tekton-spacing-6)]">
            {/* Title and Subtitle */}
            <div className="space-y-[var(--tekton-spacing-2)]">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-[var(--tekton-text-muted-foreground)]">{subtitle}</p>
            </div>

            {/* CTA Button */}
            <div>
              <Button size="lg">{ctaLabel}</Button>
            </div>

            {/* Recent Activity */}
            {slots.recentActivity && (
              <div className="mt-[var(--tekton-spacing-8)]">{slots.recentActivity}</div>
            )}

            {/* Suggestions */}
            {slots.suggestions && (
              <div className="mt-[var(--tekton-spacing-6)]">{slots.suggestions}</div>
            )}
          </div>
        </div>
      </main>
      {children}
    </div>
  );
}

/**
 * Landing Template Definition
 */
export const LandingTemplate = createTemplateFromCatalog('core.landing', LandingTemplateComponent);
