/**
 * @framingui/ui - Dashboard Template
 * SPEC-UI-001 Phase 3: Dashboard Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 대시보드 템플릿이 데이터 시각화를 보장
 * IMPACT: 템플릿 오류 시 대시보드 표시 불가
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Separator } from '../../components/separator';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

// ... imports

/**
 * Dashboard Template Component
 */
export function DashboardTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Dashboard';
  const subtitle = texts.subtitle || 'Welcome to your dashboard';

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Sidebar */}
      {slots.sidebar && (
        <aside className="w-64 border-r border-[var(--tekton-border-default)] bg-[var(--tekton-bg-card)] hidden lg:block">
          {slots.sidebar}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[var(--tekton-bg-background)]">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-[var(--tekton-border-default)] bg-[var(--tekton-bg-background)]/80 backdrop-blur-md p-[var(--tekton-spacing-4)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--tekton-text-foreground)]">{title}</h1>
              <p className="text-sm text-[var(--tekton-text-muted-foreground)]">{subtitle}</p>
            </div>
            {slots.headerActions && <div>{slots.headerActions}</div>}
          </div>
        </header>

        {/* Content Area */}
        <div className="py-[var(--tekton-layout-section-py,var(--tekton-spacing-6))] px-[var(--tekton-layout-container-px,var(--tekton-spacing-6))] space-y-[var(--tekton-layout-stack-gap,var(--tekton-spacing-6))] max-w-[var(--tekton-layout-container-xl)] mx-auto">
          {/* Metrics Row */}
          {slots.metrics && (
            <div className="grid gap-[var(--tekton-spacing-4)] grid-cols-2 lg:grid-cols-4">
              {slots.metrics}
            </div>
          )}

          <Separator />

          {/* Main Content Grid (12 Columns) */}
          <div className="grid gap-x-[var(--tekton-layout-grid-gap-x,var(--tekton-spacing-6))] gap-y-[var(--tekton-layout-grid-gap-y,var(--tekton-spacing-6))] lg:grid-cols-12">
            {/* Primary Content (8 Cols) */}
            {slots.primaryContent && (
              <div className="lg:col-span-8 space-y-[var(--tekton-layout-stack-gap,var(--tekton-spacing-6))]">
                {/* We remove the forced Card wrapper to allow full design control (e.g. Equinox Poster) */}
                {slots.primaryContent}
              </div>
            )}

            {/* Secondary Content (4 Cols) */}
            {slots.secondaryContent && (
              <div className="lg:col-span-4 space-y-[var(--tekton-layout-stack-gap,var(--tekton-spacing-6))]">
                {/* Secondary content usually behaves like a sidebar panel */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{texts.secondary_title || 'Activity'}</CardTitle>
                    <CardDescription>
                      {texts.secondary_description || 'Recent updates'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">{slots.secondaryContent}</CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Additional Sections */}
          {slots.additionalSections && <div>{slots.additionalSections}</div>}
        </div>
      </main>
      {children}
    </div>
  );
}

/**
 * Dashboard Template Definition
 */
export const DashboardTemplate = createTemplateFromCatalog(
  'dashboard.overview',
  DashboardTemplateComponent
);
