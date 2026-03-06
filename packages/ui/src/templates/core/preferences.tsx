/**
 * @framingui/ui - Preferences Template
 * SPEC-UI-002: Core Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-029] 환경설정 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Card, Switch, Select)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 설정 템플릿이 사용자 커스터마이징 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 설정 변경 불가
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/button';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Preferences Template Component
 */
export function PreferencesTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Preferences';
  const subtitle = texts.subtitle || 'Manage your account settings and preferences';
  const saveLabel = texts.save_label || 'Save Changes';

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Settings Navigation */}
      {slots.settingsNav && (
        <aside className="w-64 border-r border-[var(--tekton-border-default)] p-[var(--tekton-spacing-4)] bg-[var(--tekton-bg-muted)]">
          {slots.settingsNav}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-[var(--tekton-spacing-8)]">
        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-[var(--tekton-spacing-8)]">
            <h1 className="text-3xl font-bold mb-[var(--tekton-spacing-2)]">{title}</h1>
            <p className="text-[var(--tekton-text-muted-foreground)]">{subtitle}</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-[var(--tekton-spacing-6)]">
            {/* General Settings */}
            {slots.generalSettings && (
              <Card>
                <CardHeader>
                  <CardTitle>General</CardTitle>
                  <CardDescription>Manage your general preferences</CardDescription>
                </CardHeader>
                <CardContent>{slots.generalSettings}</CardContent>
              </Card>
            )}

            {/* Appearance Settings */}
            {slots.appearanceSettings && (
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent>{slots.appearanceSettings}</CardContent>
              </Card>
            )}

            {/* Notifications Settings */}
            {slots.notificationsSettings && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage notification preferences</CardDescription>
                </CardHeader>
                <CardContent>{slots.notificationsSettings}</CardContent>
              </Card>
            )}

            {/* Additional Settings */}
            {slots.additionalSettings && slots.additionalSettings}
          </div>

          {/* Save Button */}
          <div className="mt-[var(--tekton-spacing-8)] flex justify-end gap-[var(--tekton-spacing-4)]">
            <Button variant="outline">Cancel</Button>
            <Button>{saveLabel}</Button>
          </div>
        </div>
      </main>
      {children}
    </div>
  );
}

/**
 * Preferences Template Definition
 */
export const PreferencesTemplate = createTemplateFromCatalog(
  'core.preferences',
  PreferencesTemplateComponent
);
