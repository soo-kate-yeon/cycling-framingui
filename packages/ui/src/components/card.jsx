/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 * @framingui - Card Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */
import * as React from 'react';
import { cn } from '../lib/utils';
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--bg-card-foreground)] shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-[var(--spacing-2)] p-[var(--spacing-6)]',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--bg-muted-foreground)]', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-[var(--spacing-6)] pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-[var(--spacing-6)] pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
//# sourceMappingURL=card.js.map
