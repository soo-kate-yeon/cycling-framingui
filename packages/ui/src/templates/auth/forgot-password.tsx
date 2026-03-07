/**
 * @framingui/ui - Forgot Password Template
 * SPEC-UI-002: Authentication Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-026] 비밀번호 재설정 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Input, Form, Card, Label)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 비밀번호 재설정 템플릿이 계정 복구 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 계정 복구 불가
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/card';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Forgot Password Template Component
 */
export function ForgotPasswordTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Forgot Password?';
  const subtitle = texts.subtitle || "Enter your email address and we'll send you a reset link";
  const buttonLabel = texts.button_label || 'Send Reset Link';

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--spacing-4)] ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          {slots.logo && <div className="mb-[var(--spacing-4)]">{slots.logo}</div>}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-[var(--spacing-4)]">
          {/* Email Input */}
          <div className="space-y-[var(--spacing-2)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          {/* Send Reset Link Button */}
          <Button className="w-full">{buttonLabel}</Button>
        </CardContent>

        <CardFooter>
          {slots.footer || (
            <p className="text-sm text-center w-full text-[var(--text-muted-foreground)]">
              Remember your password?{' '}
              <a href="#" className="text-[var(--text-primary)] hover:underline">
                Back to login
              </a>
            </p>
          )}
        </CardFooter>
      </Card>
      {children}
    </div>
  );
}

/**
 * Forgot Password Template Definition
 */
export const ForgotPasswordTemplate = createTemplateFromCatalog(
  'auth.forgot-password',
  ForgotPasswordTemplateComponent
);
