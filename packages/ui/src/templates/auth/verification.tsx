/**
 * @framingui/ui - Verification Template
 * SPEC-UI-002: Authentication Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-027] 이메일 인증 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Card)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 이메일 인증 템플릿이 계정 보안 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 인증 프로세스 중단
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
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Verification Template Component
 */
export function VerificationTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Verify Your Email';
  const subtitle = texts.subtitle || "We've sent a verification link to your email address";
  const buttonLabel = texts.button_label || 'Continue';
  const showResend = options.show_resend ?? true;
  const userEmail = options.user_email || 'user@example.com';

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--spacing-4)] ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          {slots.icon && <div className="mb-[var(--spacing-4)]">{slots.icon}</div>}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-[var(--spacing-4)]">
          {/* Email Display */}
          <div className="bg-[var(--bg-muted)] p-[var(--spacing-3)] rounded-[var(--radius-md)] text-center">
            <p className="text-sm font-medium">{userEmail}</p>
          </div>

          {/* Continue Button */}
          <Button className="w-full">{buttonLabel}</Button>

          {/* Resend Link */}
          {showResend && (
            <div className="text-center">
              <p className="text-sm text-[var(--text-muted-foreground)]">
                Didn&apos;t receive the email?{' '}
                <button className="text-[var(--text-primary)] hover:underline">
                  Resend
                </button>
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {slots.footer || (
            <p className="text-sm text-center w-full text-[var(--text-muted-foreground)]">
              Wrong email?{' '}
              <a href="#" className="text-[var(--text-primary)] hover:underline">
                Change email address
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
 * Verification Template Definition
 */
export const VerificationTemplate = createTemplateFromCatalog(
  'auth.verification',
  VerificationTemplateComponent
);
