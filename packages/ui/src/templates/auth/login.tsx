/**
 * @framingui/ui - Login Template
 * SPEC-UI-001 Phase 3: Authentication Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-024] 로그인 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Input, Form, Card, Label)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 로그인 템플릿이 인증 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 로그인 불가
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
 * Login Template Component
 */
export function LoginTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Welcome Back';
  const subtitle = texts.subtitle || 'Sign in to your account';
  const buttonLabel = texts.button_label || 'Sign In';
  const showSocialLogin = options.social_login ?? false;
  const showRememberMe = options.remember_me ?? false;

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

          {/* Password Input */}
          <div className="space-y-[var(--spacing-2)]">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {slots.forgotPassword && <div>{slots.forgotPassword}</div>}
            </div>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          {/* Remember Me */}
          {showRememberMe && slots.rememberMe && (
            <div className="flex items-center space-x-[var(--spacing-2)]">
              {slots.rememberMe}
            </div>
          )}

          {/* Sign In Button */}
          <Button className="w-full">{buttonLabel}</Button>

          {/* Social Login */}
          {showSocialLogin && slots.socialLogin && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--bg-background)] px-[var(--spacing-2)] text-[var(--text-muted-foreground)]">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-[var(--spacing-4)]">
                {slots.socialLogin}
              </div>
            </>
          )}
        </CardContent>

        <CardFooter>
          {slots.footer || (
            <p className="text-sm text-center w-full text-[var(--text-muted-foreground)]">
              Don&apos;t have an account?{' '}
              <a href="#" className="text-[var(--text-primary)] hover:underline">
                Sign up
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
 * Login Template Definition
 */
export const LoginTemplate = createTemplateFromCatalog('auth.login', LoginTemplateComponent);
