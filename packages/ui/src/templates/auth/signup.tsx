/**
 * @framingui/ui - Signup Template
 * SPEC-UI-002: Authentication Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-025] 회원가입 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Input, Form, Card, Label, Checkbox)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 회원가입 템플릿이 사용자 온보딩 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 가입 불가
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
import { Separator } from '../../components/separator';
import type { ScreenTemplateProps } from '../types';
import { createTemplateFromCatalog } from '../create-template';

/**
 * Signup Template Component
 */
export function SignupTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Create Account';
  const subtitle = texts.subtitle || 'Sign up to get started';
  const buttonLabel = texts.button_label || 'Sign Up';
  const showSocialSignup = options.social_signup ?? false;

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
          {/* Name Input */}
          <div className="space-y-[var(--spacing-2)]">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" />
          </div>

          {/* Email Input */}
          <div className="space-y-[var(--spacing-2)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          {/* Password Input */}
          <div className="space-y-[var(--spacing-2)]">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          {/* Password Confirm Input */}
          <div className="space-y-[var(--spacing-2)]">
            <Label htmlFor="password-confirm">Confirm Password</Label>
            <Input id="password-confirm" type="password" placeholder="Confirm your password" />
          </div>

          {/* Terms Checkbox */}
          {slots.termsCheckbox && (
            <div className="flex items-start space-x-[var(--spacing-2)]">
              {slots.termsCheckbox}
            </div>
          )}

          {/* Sign Up Button */}
          <Button className="w-full">{buttonLabel}</Button>

          {/* Social Signup */}
          {showSocialSignup && slots.socialSignup && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--bg-background)] px-[var(--spacing-2)] text-[var(--text-muted-foreground)]">
                    Or sign up with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
                {slots.socialSignup}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          {slots.footer || (
            <p className="text-sm text-center w-full text-[var(--text-muted-foreground)]">
              Already have an account?{' '}
              <a href="#" className="text-[var(--text-primary)] hover:underline">
                Sign in
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
 * Signup Template Definition
 */
export const SignupTemplate = createTemplateFromCatalog('auth.signup', SignupTemplateComponent);
