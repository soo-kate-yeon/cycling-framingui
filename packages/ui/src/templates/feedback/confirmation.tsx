/**
 * @framingui/ui - Confirmation Template
 * SPEC-UI-002: Feedback Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-UI002-034] 확인 대화상자 템플릿 구현
 * [TAG-UI002-001] ScreenTemplate interface 준수
 * [TAG-UI002-002] Tekton 레이아웃 토큰 사용
 * [TAG-UI002-003] AI 커스터마이징 경계 정의 (texts, options, slots)
 * [TAG-UI002-004] 필수 컴포넌트 검증 (Button, Card)
 * [TAG-UI002-005] 반응형 브레이크포인트 지원
 * [TAG-UI002-006] WCAG 2.1 AA 준수
 *
 * WHY: 확인 템플릿이 중요한 액션 방지 UX를 보장
 * IMPACT: 템플릿 오류 시 사용자 의도치 않은 삭제/변경 실행
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
 * Confirmation Template Component
 */
export function ConfirmationTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
  options = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Are You Sure?';
  const message = texts.message || 'This action cannot be undone.';
  const confirmLabel = texts.confirm_label || 'Confirm';
  const cancelLabel = texts.cancel_label || 'Cancel';
  const isDestructive = options.is_destructive ?? false;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-[var(--spacing-4)] ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* Warning Icon (for destructive actions) */}
          {isDestructive && slots.warningIcon && (
            <div className="mb-[var(--spacing-2)]">{slots.warningIcon}</div>
          )}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Additional Details */}
          {slots.details && (
            <div className="bg-[var(--bg-muted)] p-[var(--spacing-4)] rounded-[var(--radius-md)] text-sm">
              {slots.details}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-[var(--spacing-3)]">
          <Button variant="outline">{cancelLabel}</Button>
          <Button variant={isDestructive ? 'destructive' : 'default'}>{confirmLabel}</Button>
        </CardFooter>
      </Card>
      {children}
    </div>
  );
}

/**
 * Confirmation Template Definition
 */
export const ConfirmationTemplate = createTemplateFromCatalog(
  'feedback.confirmation',
  ConfirmationTemplateComponent
);
