/**
 * @framingui/ui - Profile Template
 * SPEC-UI-002: Core Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-030] 프로필 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Input, Form, Card, Label, Avatar)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 프로필 템플릿이 사용자 정보 관리 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 프로필 수정 불가
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Profile Template Component
 */
export function ProfileTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Profile';
  const subtitle = texts.subtitle || 'Manage your profile information';
  const saveLabel = texts.save_label || 'Save Changes';
  const userName = String(options.user_name || 'John Doe');
  const userEmail = String(options.user_email || 'john@example.com');

  return (
    <div className={`min-h-screen p-[var(--tekton-spacing-8)] ${className}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-[var(--tekton-spacing-8)]">
          <h1 className="text-3xl font-bold mb-[var(--tekton-spacing-2)]">{title}</h1>
          <p className="text-[var(--tekton-text-muted-foreground)]">{subtitle}</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-[var(--tekton-spacing-6)]">
            {/* Avatar Section */}
            {slots.avatar && (
              <div className="flex items-center gap-[var(--tekton-spacing-4)]">
                <div>{slots.avatar}</div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-xs text-[var(--tekton-text-muted-foreground)] mt-[var(--tekton-spacing-2)]">
                    JPG, PNG. Max 2MB
                  </p>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-[var(--tekton-spacing-2)]">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue={userName} />
            </div>

            {/* Email Input */}
            <div className="space-y-[var(--tekton-spacing-2)]">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userEmail} disabled />
              <p className="text-xs text-[var(--tekton-text-muted-foreground)]">
                Contact support to change your email address
              </p>
            </div>

            {/* Bio/Description */}
            {slots.bioField && (
              <div className="space-y-[var(--tekton-spacing-2)]">{slots.bioField}</div>
            )}

            {/* Additional Fields */}
            {slots.additionalFields && slots.additionalFields}
          </CardContent>
        </Card>

        {/* Additional Sections */}
        {slots.additionalSections && (
          <div className="mt-[var(--tekton-spacing-6)]">{slots.additionalSections}</div>
        )}

        {/* Action Buttons */}
        <div className="mt-[var(--tekton-spacing-8)] flex justify-end gap-[var(--tekton-spacing-4)]">
          <Button variant="outline">Cancel</Button>
          <Button>{saveLabel}</Button>
        </div>
      </div>
      {children}
    </div>
  );
}

/**
 * Profile Template Definition
 */
export const ProfileTemplate = createTemplateFromCatalog('core.profile', ProfileTemplateComponent);
